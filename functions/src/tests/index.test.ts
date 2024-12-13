/* eslint-disable */
import * as admin from "firebase-admin";
import {Response} from "express";
import * as functions from "firebase-functions";
import axios from "axios";
import {fetchLeaderboard, getLeaderboard} from "../index";

// Mock external dependencies
jest.mock("axios");

// Mock CORS to bypass it in tests
jest.mock("cors", () => () => (req: any, res: any, next: any) => next());

// Firestore Mock Types
type FirestoreBatchMock = {
  set: jest.Mock<void, [any]>;
  commit: jest.Mock<Promise<void>>;
};

type FirestoreMock = {
  collection: jest.Mock<FirestoreMock, [string]>;
  doc: jest.Mock<FirestoreMock, [string]>;
  set: jest.Mock<Promise<void>, [any]>;
  batch: jest.Mock<FirestoreBatchMock>;
  orderBy: jest.Mock<FirestoreMock, [string, "asc" | "desc"]>;
  get: jest.Mock<
    Promise<{ forEach: (cb: (doc: any) => void) => void }>
  >;
};

// Firestore Mock Implementation
const batchMock: FirestoreBatchMock = {
  set: jest.fn(),
  commit: jest.fn().mockResolvedValue(Promise.resolve()),
};

const firestoreMock: FirestoreMock = {
  collection: jest.fn((path: string) => firestoreMock),
  doc: jest.fn((id: string) => firestoreMock),
  set: jest.fn(async (data: any) => Promise.resolve()),
  batch: jest.fn(() => batchMock),
  orderBy: jest.fn((field: string, direction: "asc" | "desc") => firestoreMock),
  get: jest.fn(() =>
    Promise.resolve({
      forEach: (cb: (doc: any) => void) => {
        cb({data: () => ({displayName: "Player1", hitFactor: 90})});
      },
    })
  ),
};

// Mock Firebase Admin SDK
jest.mock("firebase-admin", () => {
  return {
    initializeApp: jest.fn(),
    firestore: jest.fn(() => firestoreMock),
  };
});

// Mock Express Request and Response
const mockRequest = (query: any): Partial<functions.https.Request> => ({
  query,
  rawBody: Buffer.from(""),
});

const mockResponse = (): Partial<Response> => {
  const res: any = {};
  res.status = jest.fn(() => res);
  res.send = jest.fn();
  res.json = jest.fn();
  return res;
};

// Tests
describe("Cloud Functions Tests", () => {
  const stageId = "test-stage";
  const req = mockRequest({stageId});
  const res = mockResponse();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getLeaderboard - success", async () => {
    await getLeaderboard(req as functions.https.Request, res as Response);

    expect(admin.firestore().collection).toHaveBeenCalledWith("leaderboards");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {displayName: "Player1", hitFactor: 90},
    ]);
  });

  test("fetchLeaderboard - success", async () => {
    const leaderboardData = {scores_list_custom_score: ["id1", "id2"]};
    const scoresData = [
      {_id: "id1", displayname_text: "Player1", hitfactor_number: 90},
      {_id: "id2", displayname_text: "Player2", hitfactor_number: 80},
    ];

    const mockedAxios = axios as jest.Mocked<typeof axios>;

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        response: leaderboardData,
      },
    });
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        response: {
          results: scoresData,
        },
      },
    });

    await fetchLeaderboard(req as functions.https.Request, res as Response);
    await new Promise((resolve) => setImmediate(resolve));

    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    expect(admin.firestore().collection).toHaveBeenCalledWith("leaderboards");
    expect(admin.firestore().batch().commit).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      "Leaderboard data successfully fetched and stored."
    );
  });
});
