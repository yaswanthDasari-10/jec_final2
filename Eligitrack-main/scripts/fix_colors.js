const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, '../jec_frontend/front/src');
const files = [
  path.join(base, 'pages/AdminDashboard.jsx'),
  path.join(base, 'pages/Applicants.jsx'),
  path.join(base, 'pages/ManageJobs.jsx'),
  path.join(base, 'pages/AddJob.jsx'),
  path.join(base, 'pages/Profile.jsx'),
  path.join(base, 'pages/Applications.jsx'),
  path.join(base, 'pages/Jobs.jsx'),
];

const replacements = [
  ['#14b8a6', '#a855f7'],
  ['#0f766e', '#7c3aed'],
  ['#0d9488', '#9333ea'],
  ['#2dd4bf', '#c084fc'],
  ['#6366f1', '#f59e0b'],
  ['#4f46e5', '#d97706'],
  ['#a5b4fc', '#fcd34d'],
  ['rgba(20,184,166,', 'rgba(168,85,247,'],
  ['rgba(20, 184, 166,', 'rgba(168, 85, 247,'],
  ['rgba(99,102,241,', 'rgba(245,158,11,'],
  ['rgba(99, 102, 241,', 'rgba(245, 158, 11,'],
  ['accentColor: "#14b8a6"', 'accentColor: "#a855f7"'],
  ['accent-teal-500', 'accent-violet-500'],
  // Admin violet orbs -> amber
  ['rgba(99,102,241,0.15)', 'rgba(245,158,11,0.12)'],
];

for (const file of files) {
  if (!fs.existsSync(file)) { console.log('SKIP (not found):', file); continue; }
  let content = fs.readFileSync(file, 'utf8');
  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }
  fs.writeFileSync(file, content, 'utf8');
  console.log('✅ Updated:', path.basename(file));
}
console.log('All done!');
