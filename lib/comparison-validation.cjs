function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateComparisonData(value, fileName) {
  const issues = [];

  if (!isRecord(value)) {
    return [`Expected a JSON object in ${fileName}.`];
  }

  if (!isRecord(value.meta)) {
    issues.push('Expected "meta" to be an object.');
  } else {
    for (const field of ["title", "description"]) {
      if (!isNonEmptyString(value.meta[field])) {
        issues.push(`Expected "meta.${field}" to be a non-empty string.`);
      }
    }
  }

  for (const field of ["toolA", "toolB"]) {
    if (!isRecord(value[field]) || !isNonEmptyString(value[field].name)) {
      issues.push(`Expected "${field}.name" to be a non-empty string.`);
    }
  }

  for (const field of ["slug", "verdict"]) {
    if (!isNonEmptyString(value[field])) {
      issues.push(`Expected "${field}" to be a non-empty string.`);
    }
  }

  const expectedSlug = fileName.replace(/\.json$/i, "");
  if (isNonEmptyString(value.slug) && value.slug !== expectedSlug) {
    issues.push(`Slug "${value.slug}" does not match filename "${expectedSlug}".`);
  }

  for (const field of ["introduction", "heroSubtitle", "quickVerdict"]) {
    if (value[field] !== undefined && !isNonEmptyString(value[field])) {
      issues.push(`Expected "${field}" to be a non-empty string when present.`);
    }
  }

  const title = value.meta?.title;
  const description = value.meta?.description;
  const heroSubtitle = value.heroSubtitle ?? value.introduction ?? description;
  const quickVerdict = value.quickVerdict ?? value.verdict;
  if (typeof title === "string" && title.trim().length <= 20) {
    issues.push('Expected "meta.title" to contain more than 20 characters.');
  }
  if (typeof description === "string" && description.trim().length < 100) {
    issues.push('Expected "meta.description" to contain at least 100 characters.');
  }
  if (typeof heroSubtitle === "string" && heroSubtitle.trim().length < 60) {
    issues.push('Expected "heroSubtitle" to contain at least 60 characters.');
  }
  if (typeof quickVerdict === "string" && quickVerdict.trim().length < 80) {
    issues.push('Expected "quickVerdict" to contain at least 80 characters.');
  }

  if (value.decisionFramework !== undefined) {
    if (!isRecord(value.decisionFramework)) {
      issues.push('Expected "decisionFramework" to be an object.');
    } else {
      for (const field of ["toolA", "toolB"]) {
        if (!isNonEmptyString(value.decisionFramework[field])) {
          issues.push(`Expected "decisionFramework.${field}" to be a non-empty string.`);
        }
      }
    }
  }

  if (!Array.isArray(value.comparison)) {
    issues.push('Expected "comparison" to be an array.');
  } else {
    if (value.comparison.length < 6) {
      issues.push('Expected "comparison" to contain at least six criteria.');
    }
    value.comparison.forEach((criterion, index) => {
      if (!isRecord(criterion)) {
        issues.push(`Expected comparison[${index}] to be an object.`);
        return;
      }
      for (const field of ["category", "toolA", "toolB"]) {
        if (!isNonEmptyString(criterion[field])) {
          issues.push(`Expected comparison[${index}].${field} to be a non-empty string.`);
        }
      }
      if (!["toolA", "toolB", "tie"].includes(criterion.winner)) {
        issues.push(`Invalid comparison[${index}].winner.`);
      }
    });
  }

  if (value.tradeoffs !== undefined) {
    if (!Array.isArray(value.tradeoffs)) {
      issues.push('Expected "tradeoffs" to be an array.');
    } else {
      if (value.tradeoffs.length < 4) {
        issues.push('Expected "tradeoffs" to contain at least four entries.');
      }
      value.tradeoffs.forEach((tradeoff, index) => {
        if (!isRecord(tradeoff)) {
          issues.push(`Expected tradeoffs[${index}] to be an object.`);
          return;
        }
        for (const field of ["category", "toolA", "toolB"]) {
          if (!isNonEmptyString(tradeoff[field])) {
            issues.push(`Expected tradeoffs[${index}].${field} to be a non-empty string.`);
          }
        }
      });
    }
  } else if ((value.comparison?.length ?? 0) < 4) {
    issues.push('Expected at least four tradeoffs or comparison criteria.');
  }

  if (!Array.isArray(value.faq)) {
    issues.push('Expected "faq" to be an array.');
  } else {
    if (value.faq.length < 5) {
      issues.push('Expected "faq" to contain at least five entries.');
    }
    value.faq.forEach((entry, index) => {
      if (!isRecord(entry)) {
        issues.push(`Expected faq[${index}] to be an object.`);
        return;
      }
      for (const field of ["q", "a"]) {
        if (!isNonEmptyString(entry[field])) {
          issues.push(`Expected faq[${index}].${field} to be a non-empty string.`);
        }
      }
    });
  }

  if (value.codeExamples !== undefined) {
    if (!isRecord(value.codeExamples)) {
      issues.push('Expected "codeExamples" to be an object.');
    } else {
      for (const field of ["scenario", "tech1Snippet", "tech2Snippet"]) {
        if (
          value.codeExamples[field] !== undefined &&
          !isNonEmptyString(value.codeExamples[field])
        ) {
          issues.push(`Expected "codeExamples.${field}" to be a non-empty string.`);
        }
      }
      for (const field of ["tech1Snippet", "tech2Snippet"]) {
        if (!isNonEmptyString(value.codeExamples[field])) {
          issues.push(`Expected "codeExamples.${field}" to be a non-empty string.`);
        }
      }
    }
  }

  return issues;
}

module.exports = { validateComparisonData };
