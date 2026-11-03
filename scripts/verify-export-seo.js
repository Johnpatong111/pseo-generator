const { readdirSync, readFileSync } = require("node:fs");
const path = require("node:path");

const comparisonPathSegment = `${path.sep}compare${path.sep}`;
const stats = {
  pages: 0,
  maxTitleLength: 0,
  maxTitlePage: "",
  titlesOver60: 0,
  descriptionsOver155: 0,
  descriptionsUnder100: 0,
  typescriptDescriptions: 0,
  pagesWithEllipsis: 0,
  pagesMissingFaqPage: 0,
  pagesMissingTechArticle: 0,
  pagesWithInvalidJsonLd: 0,
  pagesWithFewerThanTwoFaqQuestions: 0,
};

function inspect(filePath) {
  const html = readFileSync(filePath, "utf8");
  stats.pages += 1;

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  if (title.length > stats.maxTitleLength) {
    stats.maxTitleLength = title.length;
    stats.maxTitlePage = filePath;
  }
  if (title.length > 60) stats.titlesOver60 += 1;

  const description =
    html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  if (description.length > 155) stats.descriptionsOver155 += 1;
  if (description.length < 100) stats.descriptionsUnder100 += 1;
  if (/typescript/iu.test(description)) stats.typescriptDescriptions += 1;

  if (html.includes(String.fromCharCode(8230))) stats.pagesWithEllipsis += 1;
  if (!html.includes('"@type":"FAQPage"')) stats.pagesMissingFaqPage += 1;
  if (!html.includes('"@type":"TechArticle"')) stats.pagesMissingTechArticle += 1;

  const jsonLdSource = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  )?.[1];
  if (!jsonLdSource) {
    stats.pagesWithInvalidJsonLd += 1;
    return;
  }

  try {
    const graph = JSON.parse(
      jsonLdSource.replace(/\\u003c/gu, "<").replace(/\\u003e/gu, ">"),
    )["@graph"];
    const faqPage = graph.find((node) => node["@type"] === "FAQPage");
    const questions = faqPage?.mainEntity?.length ?? 0;
    if (questions < 2) stats.pagesWithFewerThanTwoFaqQuestions += 1;
  } catch {
    stats.pagesWithInvalidJsonLd += 1;
  }
}

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(filePath);
    } else if (
      entry.name.endsWith(".html") &&
      filePath.includes(comparisonPathSegment)
    ) {
      inspect(filePath);
    }
  }
}

if (!readdirSync(path.resolve(__dirname, "..", "out")).length) {
  throw new Error("The out/ directory is empty. Run `npm run build` first.");
}

walk(path.resolve(__dirname, "..", "out"));
console.log(stats);
