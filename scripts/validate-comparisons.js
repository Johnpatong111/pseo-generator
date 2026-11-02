const { readdirSync, readFileSync } = require("node:fs");
const path = require("node:path");
const { validateComparisonData } = require("../lib/comparison-validation.cjs");

const projectRoot = path.resolve(__dirname, "..");
const dataRoot = path.join(projectRoot, "data");
const locales = ["en", "es", "de", "fr", "pl"];
const strict = process.argv.includes("--strict");

function getComparisonFiles(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort();
}

function validateFile(filePath) {
  const fileName = path.basename(filePath);
  try {
    const value = JSON.parse(readFileSync(filePath, "utf8"));
    return validateComparisonData(value, fileName);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return [`Could not read or parse JSON: ${reason}`];
  }
}

function main() {
  let validCount = 0;
  let invalidCount = 0;
  let fileCount = 0;
  let directoryFailure = false;
  const directories = locales.map((locale) => ({
    directory: path.join(dataRoot, locale),
    label: locale,
  }));

  for (const { directory, label } of directories) {
    let files;
    try {
      files = getComparisonFiles(directory);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      console.error(`[data validation] Cannot scan ${label}: ${reason}`);
      directoryFailure = true;
      continue;
    }
    if (files.length === 0) {
      console.error(`[data validation] No comparison JSON files found for ${label}.`);
      directoryFailure = true;
      continue;
    }

    for (const fileName of files) {
      fileCount += 1;
      const filePath = path.join(directory, fileName);
      const issues = validateFile(filePath);
      if (issues.length > 0) {
        invalidCount += 1;
        console.error(
          `[data validation] Skipping ${path.relative(projectRoot, filePath)}:\n  - ${issues.join("\n  - ")}`,
        );
      } else {
        validCount += 1;
      }
    }
  }

  console.log(
    `[data validation] ${validCount}/${fileCount} comparison files valid; ${invalidCount} invalid file(s) will be skipped.`,
  );

  if (directoryFailure || validCount === 0 || (strict && invalidCount > 0)) {
    process.exitCode = 1;
  }
}

main();
