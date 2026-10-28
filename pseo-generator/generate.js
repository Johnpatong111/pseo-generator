const { main } = require("./scripts/generate-comparisons");

main().catch((error) => {
  console.error(`Generowanie porównań nie powiodło się: ${error.message}`);
  process.exitCode = 1;
});
