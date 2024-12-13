module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  testMatch: ["**/src/tests/**/*.test.ts"],
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
};
