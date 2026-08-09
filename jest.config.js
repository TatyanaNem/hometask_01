/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  testMatch: ["<rootDir>/__tests__/**/*.e2e.test.ts"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "__tests__/tsconfig.json" }],
  },
};
