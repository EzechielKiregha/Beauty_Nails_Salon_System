export default [
  // GLOBAL IGNORES: No other keys allowed here
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "**/dist/**",
      "**/node_modules/**",
      "**/coverage/**",
      // ... your other ignore patterns
    ],
  },
  // RULE CONFIGURATION: Applies to everything NOT ignored above
  {
    rules: {
      "no-unused-expressions": "error",
    },
  },
];
