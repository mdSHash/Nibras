const fs = require('fs');
const path = require('path');

const eventsData = JSON.parse(fs.readFileSync('./src/dataList.json', 'utf8'));

const HONORIFICS_PATTERN =
  /رضي الله عنهم|رضي الله عنها|رضي الله عنهما|رضي الله عنه|رحمه الله|رحمها الله|رحمهم الله|ﷺ|صلى الله عليه وسلم|عليه السلام/g;

const normalizeArabicName = (value) =>
  value
    .normalize("NFKC")
    .replace(HONORIFICS_PATTERN, "")
    .replace(/[إأآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[ؤئ]/g, "ء")
    .replace(/ـ/g, "")
    .replace(/[ً-ٟ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const companionsModule = fs.readFileSync('./src/companionsList.ts', 'utf8');

const companionsData = Array.from(
  companionsModule.matchAll(
    /id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?aliases:\s*\[([\s\S]*?)\]/g
  )
).map((match) => ({
  id: match[1],
  name: match[2],
  title: match[3],
  aliases: Array.from(match[4].matchAll(/"([^"]+)"/g)).map((aliasMatch) => aliasMatch[1])
}));

const getCompanionSearchKeys = (companion) => {
  const keys = [companion.id, companion.name, companion.title, ...companion.aliases]
    .filter(Boolean)
    .map((value) => normalizeArabicName(value));

  return Array.from(new Set(keys));
};

const findCompanion = (figureName) => {
  const normalizedQuery = normalizeArabicName(figureName);

  if (!normalizedQuery) return undefined;

  return companionsData.find((companion) =>
    getCompanionSearchKeys(companion).some((key) => key === normalizedQuery)
  );
};

const companionFrequency = new Map();
const matchedCompanions = new Set();
const missingCompanions = new Map();

eventsData.forEach((event, eventIndex) => {
  const companionNames = new Set();

  if (event.details?.companion_roles) {
    event.details.companion_roles.forEach(role => {
      if (role.name) {
        companionNames.add(role.name);
      }
    });
  }

  if (event.entities?.key_figures) {
    event.entities.key_figures.forEach(figure => {
      companionNames.add(figure);
    });
  }

  companionNames.forEach(name => {
    companionFrequency.set(name, (companionFrequency.get(name) || 0) + 1);

    const companion = findCompanion(name);
    if (companion) {
      matchedCompanions.add(name);
    } else {
      if (!missingCompanions.has(name)) {
        missingCompanions.set(name, {
          count: 0,
          events: []
        });
      }
      const missing = missingCompanions.get(name);
      missing.count++;
      missing.events.push({
        title: event.title,
        index: eventIndex
      });
    }
  });
});

const sortedMissing = Array.from(missingCompanions.entries())
  .sort((a, b) => b[1].count - a[1].count);

const totalUnique = companionFrequency.size;
const totalMatched = matchedCompanions.size;
const totalMissing = missingCompanions.size;

let report = `# Companion Verification Report\n\n`;
report += `Generated: ${new Date().toISOString()}\n\n`;
report += `## Summary Statistics\n\n`;
report += `- **Total Unique Companion References**: ${totalUnique}\n`;
report += `- **Successfully Matched**: ${totalMatched} (${((totalMatched/totalUnique)*100).toFixed(1)}%)\n`;
report += `- **Missing from Database**: ${totalMissing} (${((totalMissing/totalUnique)*100).toFixed(1)}%)\n`;
report += `- **Total Events Analyzed**: ${eventsData.length}\n\n`;

report += `## Currently Available Companions\n\n`;
companionsData.forEach(c => {
  report += `- ${c.name} (${c.title})\n`;
});

report += `\n## Missing Companions\n\n`;
report += `The following companions are referenced in events but not found in the companions database.\n`;
report += `Listed by frequency (most referenced first):\n\n`;

sortedMissing.forEach(([name, data], index) => {
  report += `### ${index + 1}. ${name}\n`;
  report += `- **Frequency**: ${data.count} reference${data.count > 1 ? 's' : ''}\n`;
  report += `- **Found in events**:\n`;
  data.events.slice(0, 5).forEach(evt => {
    report += `  - ${evt.title}\n`;
  });
  if (data.events.length > 5) {
    report += `  - ... and ${data.events.length - 5} more events\n`;
  }
  report += `\n`;
});

report += `## Recommendations\n\n`;
report += `### Priority 1: High-Frequency Companions (10+ references)\n\n`;
const highPriority = sortedMissing.filter(([_, data]) => data.count >= 10);
if (highPriority.length > 0) {
  highPriority.forEach(([name, data]) => {
    report += `- **${name}** (${data.count} references)\n`;
  });
} else {
  report += `None found.\n`;
}

report += `\n### Priority 2: Medium-Frequency Companions (5-9 references)\n\n`;
const mediumPriority = sortedMissing.filter(([_, data]) => data.count >= 5 && data.count < 10);
if (mediumPriority.length > 0) {
  mediumPriority.forEach(([name, data]) => {
    report += `- **${name}** (${data.count} references)\n`;
  });
} else {
  report += `None found.\n`;
}

report += `\n### Priority 3: Low-Frequency Companions (1-4 references)\n\n`;
const lowPriority = sortedMissing.filter(([_, data]) => data.count < 5);
report += `${lowPriority.length} companions with 1-4 references each.\n`;

report += `\n## Next Steps\n\n`;
report += `1. Add biographies for Priority 1 companions first\n`;
report += `2. Verify historical accuracy and source citations for each\n`;
report += `3. Include proper honorifics in all companion names\n`;
report += `4. Add comprehensive aliases for Arabic search optimization\n`;
report += `5. Re-run this verification after additions to track progress\n`;

fs.writeFileSync('companion-verification-report.md', report, 'utf8');

console.log('Report generated: companion-verification-report.md');
console.log(`\nSummary:`);
console.log(`- Total unique companions: ${totalUnique}`);
console.log(`- Matched: ${totalMatched}`);
console.log(`- Missing: ${totalMissing}`);
console.log(`\nTop 10 missing companions by frequency:`);
sortedMissing.slice(0, 10).forEach(([name, data], i) => {
  console.log(`${i+1}. ${name} (${data.count} references)`);
});

