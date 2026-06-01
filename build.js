const fs = require('fs');
const path = require('path');

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  console.log('Cleaning existing dist/ folder...');
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Helper to copy files recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy primary assets
const filesToCopy = ['index.css', 'app.js'];
for (const file of filesToCopy) {
  const src = path.join(__dirname, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} to dist/`);
  }
}

// Copy all HTML files in root
const files = fs.readdirSync(__dirname);
for (const file of files) {
  if (file.endsWith('.html')) {
    fs.copyFileSync(path.join(__dirname, file), path.join(distDir, file));
    console.log(`Copied ${file} to dist/`);
  }
}

// Copy assets folder recursively
const assetsSrc = path.join(__dirname, 'assets');
const assetsDest = path.join(distDir, 'assets');
if (fs.existsSync(assetsSrc)) {
  copyDir(assetsSrc, assetsDest);
  console.log('Copied assets/ folder recursively to dist/');
}

console.log('Build completed successfully!');
