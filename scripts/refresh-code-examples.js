const { readdirSync, readFileSync, writeFileSync } = require("node:fs");
const path = require("node:path");
const { getCategoryId } = require("./generate-comparisons");
const { createCodeExamples } = require("../lib/snippet-catalog.cjs");

const dataDirectory = path.resolve(__dirname, "..", "data");
const locales = ["en", "es", "de", "fr", "pl"];
const boilerplatePattern =
  /\b(?:hello(?:\s*,?\s*world|\s+there)?|hallo(?:\s*,?\s*welt)?|witaj(?:\s*,?\s*świecie)?|hola(?:\s*,?\s*mundo)?|bonjour(?:\s*,?\s*le\s*monde)?|welcome(?:\s+to\s+.+)?|witaj\s+w(?:\s+.+)?)\b/i;
const explicitAnyPattern = /:\s*any\b|<\s*any\s*>|\bas\s+any\b/;

function assertCodeExamples(examples, filePath) {
  for (const [field, source] of Object.entries({
    tech1Snippet: examples.tech1Snippet,
    tech2Snippet: examples.tech2Snippet,
  })) {
    if (boilerplatePattern.test(source)) {
      throw new Error(`Greeting boilerplate found in ${field} at ${filePath}`);
    }
    if (explicitAnyPattern.test(source)) {
      throw new Error(`Explicit any type found in ${field} at ${filePath}`);
    }
    if (/[^\x00-\x7F]/u.test(source)) {
      throw new Error(`Non-ASCII localized text found in ${field} at ${filePath}`);
    }
    if (source.trim().length < 100) {
      throw new Error(`Code example ${field} is too short at ${filePath}`);
    }
  }
  if (
    examples.tech1Snippet === examples.tech2Snippet &&
    !filePath.toLowerCase().includes("cassandra-vs-scylladb")
  ) {
    throw new Error(`The comparison has identical code examples at ${filePath}`);
  }
  if (!examples.scenario?.trim()) {
    throw new Error(`Missing localized task description at ${filePath}`);
  }
}

function main() {
  const updates = [];
  const directories = [
    ...locales.map((locale) => ({
      path: path.join(dataDirectory, locale),
      locale,
    })),
    { path: dataDirectory, locale: "pl" },
  ];

  for (const { path: directory, locale } of directories) {
    const files = readdirSync(directory)
      .filter((name) => name.endsWith(".json"))
      .sort();
    for (const fileName of files) {
      const filePath = path.join(directory, fileName);
      const comparison = JSON.parse(readFileSync(filePath, "utf8"));
      const slug = fileName.slice(0, -".json".length);
      if (comparison.slug !== slug) {
        throw new Error(`Comparison slug does not match ${filePath}`);
      }

      const category = getCategoryId(slug);
      const codeExamples = createCodeExamples(slug, category, locale);
      assertCodeExamples(codeExamples, filePath);
      updates.push({
        filePath,
        content: `${JSON.stringify({ ...comparison, codeExamples }, null, 2)}\n`,
      });
    }
  }

  for (const update of updates) {
    writeFileSync(update.filePath, update.content, "utf8");
  }
  console.log(`Refreshed TypeScript examples in ${updates.length} comparison files.`);
}

main();
