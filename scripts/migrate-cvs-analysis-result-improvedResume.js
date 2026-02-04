/**
 * One-off migration:
 * Wrap `cvs[i].analysis_result` (structured resume JSON) into:
 *   { "improvedResume": <structuredResume> }
 *
 * This keeps admin/database rows consistent with the desired storage shape
 * while runtime APIs can still unwrap for backward compatibility.
 *
 * Run:
 *   node scripts/migrate-cvs-analysis-result-improvedResume.js
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const cvsPath = path.join(projectRoot, 'data', 'cvs.json');

function safeJsonParse(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

function shouldWrap(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  if (obj.improvedResume && typeof obj.improvedResume === 'object') return false;
  return (
    'personalInfo' in obj ||
    'summary' in obj ||
    'technicalSkills' in obj ||
    'professionalExperience' in obj ||
    'education' in obj ||
    'certifications' in obj ||
    'languages' in obj ||
    'additionalInfo' in obj
  );
}

function main() {
  if (!fs.existsSync(cvsPath)) {
    console.error(`Missing file: ${cvsPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(cvsPath, 'utf-8');
  const rows = JSON.parse(raw);
  if (!Array.isArray(rows)) {
    console.error('Invalid cvs.json: expected array');
    process.exit(1);
  }

  let changed = 0;

  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    const parsed = safeJsonParse(row.analysis_result);
    if (!parsed) continue;
    if (!shouldWrap(parsed)) continue;

    row.analysis_result = JSON.stringify({ improvedResume: parsed });
    changed += 1;
  }

  if (changed === 0) {
    console.log('No rows needed migration.');
    return;
  }

  fs.writeFileSync(cvsPath, JSON.stringify(rows, null, 2), 'utf-8');
  console.log(`Migrated ${changed} row(s) in data/cvs.json`);
}

main();



