import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import cors from "cors";
import axios from "axios";
import {
  Leaderboard,
  Score,
} from "./types";

// Initialize Firebase Admin SDK
admin.initializeApp();
const corsHandler = cors({origin: true});

/**
 * Cloud Function: Fetch and store leaderboard data.
 */
export const fetchLeaderboard = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      const stageId = req.query.stageId as string;

      if (!stageId) {
        res.status(400).send("Stage ID is required.");
        return;
      }

      console.log(`Fetching leaderboard for stage ID: ${stageId}`);

      const leaderboardData = await axios.get(`https://platform.acexr.com/api/1.1/obj/leaderboard/${stageId}`);
      const leaderboard: Leaderboard = leaderboardData.data.response;

      const constraints = JSON.stringify([
        {
          key: "_id",
          constraint_type: "in",
          value: leaderboard.scores_list_custom_score,
        },
      ]);

      const scoreData = await axios.get(`https://platform.acexr.com/api/1.1/obj/score?constraints=${constraints}`);
      const scores: Score[] = scoreData.data.response.results;

      const db = admin.firestore();
      const stageRef = db.collection("leaderboards").doc(stageId);


      // Save leaderboard metadata
      await stageRef.set({
        stageName: leaderboard.stagename_text,
        threshold: leaderboard.threshold_number,
        createdAt: new Date(),
      });

      // Batch save scores
      const batch = db.batch();
      scores.forEach((score) => {
        const scoreRef = stageRef.collection("scores").doc(score._id);
        batch.set(scoreRef, {
          displayName: score.displayname_text,
          hitFactor: score.hitfactor_number,
          rank: score.acerank_option_rank,
          timeInSeconds: score.timeinseconds_number,
        });
      });

      await batch.commit();

      console.log(`Successfully saved leaderboard for stage ID: ${stageId}`);
      res.status(200).send("Leaderboard data successfully fetched and stored.");
    } catch (error) {
      console.error("Error in fetchLeaderboard:", error);
      res.status(500).send("Failed to process leaderboard data.");
    }
  });
});

/**
 * Cloud Function: Retrieve leaderboard data.
 */
export const getLeaderboard = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      const stageId = req.query.stageId as string;

      if (!stageId) {
        res.status(400).send("Stage ID is required.");
        return;
      }

      console.log(`Retrieving leaderboard scores for stage ID: ${stageId}`);

      const db = admin.firestore();
      const scoresSnapshot = await db
        .collection("leaderboards")
        .doc(stageId)
        .collection("scores")
        .orderBy("hitFactor", "desc")
        .get();

      const scores: Score[] = [];
      scoresSnapshot.forEach((doc) => {
        scores.push(doc.data() as Score);
      });

      console.log(`Retrieved ${scores.length} scores for stage ID: ${stageId}`);
      res.status(200).json(scores);
    } catch (error) {
      console.error("Error in getLeaderboard:", error);
      res.status(500).send("Failed to retrieve leaderboard data.");
    }
  });
});
