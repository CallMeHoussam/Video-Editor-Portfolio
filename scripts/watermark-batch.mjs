#!/usr/bin/env node

/**
 * Evoless Video Watermark Automation Tool
 * 
 * Batch processes MP4 and MOV videos with an elegant, unobtrusive text watermark.
 * Watermark default: "evoless.editor" in bottom-right corner with safe margins.
 * Default opacity: 35% (strictly capped at 50% max).
 * 
 * Features:
 * - Automatically finds FFmpeg on Windows (C:\ffmpeg\bin\ffmpeg.exe or system PATH).
 * - Interactive prompts when run without arguments (e.g. double-clicking watermark.bat).
 * - Fully configurable via command line flags.
 * - Preserves original aspect ratio, video resolution, and audio stream (-c:a copy).
 * - Uses high quality H.264 video encoding (-c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p).
 * - Never overwrites original files.
 * - Skips already processed files or warns before processing.
 * - Displays per-file progress and summary statistics.
 */

import fs from 'fs';
import path from 'path';
import { spawn, spawnSync } from 'child_process';
import readline from 'readline';

// Supported video file extensions
const SUPPORTED_EXTS = new Set(['.mp4', '.mov', '.m4v', '.webm', '.mkv']);

// Find available FFmpeg binary
function findFFmpegBinary() {
  const candidates = [
    'C:\\ffmpeg\\bin\\ffmpeg.exe',
    'C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe',
    'ffmpeg',
  ];

  for (const candidate of candidates) {
    try {
      const res = spawnSync(candidate, ['-version'], { stdio: 'ignore' });
      if (res.status === 0) return candidate;
    } catch {
      // continue checking
    }
  }
  return null;
}

// Find suitable Windows font
function findWindowsFont() {
  const fontCandidates = [
    'C:\\Windows\\Fonts\\segoeui.ttf',
    'C:\\Windows\\Fonts\\arial.ttf',
    'C:\\Windows\\Fonts\\tahoma.ttf',
    'C:\\Windows\\Fonts\\calibri.ttf',
  ];

  for (const f of fontCandidates) {
    if (fs.existsSync(f)) {
      return f;
    }
  }
  return null;
}

// Parse command-line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    input: '',
    output: '',
    text: 'evoless.editor',
    opacity: 0.35,
    margin: 36,
    fontsize: 28,
    fontfile: '',
    force: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--input' || arg === '-i') {
      options.input = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      options.output = args[++i];
    } else if (arg === '--text' || arg === '-t') {
      options.text = args[++i];
    } else if (arg === '--opacity' || arg === '-a') {
      const val = parseFloat(args[++i]);
      if (!isNaN(val)) {
        // Enforce maximum 50% opacity per user specification
        options.opacity = Math.min(0.5, Math.max(0.05, val));
      }
    } else if (arg === '--fontsize' || arg === '-s') {
      const val = parseInt(args[++i], 10);
      if (!isNaN(val)) options.fontsize = val;
    } else if (arg === '--margin' || arg === '-m') {
      const val = parseInt(args[++i], 10);
      if (!isNaN(val)) options.margin = val;
    } else if (arg === '--fontfile' || arg === '-f') {
      options.fontfile = args[++i];
    } else if (arg === '--force') {
      options.force = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    }
  }

  return options;
}

function promptAsync(rl, question, defaultValue) {
  return new Promise((resolve) => {
    rl.question(`${question} [${defaultValue}]: `, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

async function runInteractive(options) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('\n======================================================');
  console.log('       EVOLESS VIDEO WATERMARK BATCH PROCESSOR        ');
  console.log('======================================================\n');

  try {
    if (!options.input) {
      let defaultIn = path.join(process.cwd(), 'videos_input');
      options.input = await promptAsync(rl, 'Enter input directory (folder with videos)', defaultIn);
    }

    if (!options.output) {
      let defaultOut = path.join(path.dirname(options.input), path.basename(options.input) + '_watermarked');
      options.output = await promptAsync(rl, 'Enter output directory (for watermarked videos)', defaultOut);
    }

    const textAns = await promptAsync(rl, 'Watermark text', options.text);
    options.text = textAns;

    const opacityAns = await promptAsync(rl, 'Opacity (0.10 to 0.50 max)', options.opacity.toString());
    const parsedOp = parseFloat(opacityAns);
    if (!isNaN(parsedOp)) {
      options.opacity = Math.min(0.50, Math.max(0.05, parsedOp));
    }

    const marginAns = await promptAsync(rl, 'Bottom-right safe margin (px)', options.margin.toString());
    const parsedMargin = parseInt(marginAns, 10);
    if (!isNaN(parsedMargin)) options.margin = parsedMargin;

  } finally {
    rl.close();
  }
}

function formatDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}m ${s}s`;
}

async function processVideo(ffmpegBin, inputFile, outputFile, options) {
  return new Promise((resolve) => {
    // Escape colon for FFmpeg drawtext fontfile path on Windows (e.g. C\:/Windows/...)
    let escapedFont = options.fontfile.replace(/\\/g, '/').replace(/:/g, '\\:');

    // Build FFmpeg drawtext filter
    // Uses Segoe UI or Arial with subtle shadow for crisp contrast on any background
    // Coordinates: bottom-right with safe margins: x=w-tw-margin, y=h-th-margin
    const drawTextFilter = [
      `fontfile='${escapedFont}'`,
      `text='${options.text.replace(/'/g, "\\'")}'`,
      `fontsize=${options.fontsize}`,
      `fontcolor=white@${options.opacity.toFixed(2)}`,
      `shadowcolor=black@${(options.opacity * 0.7).toFixed(2)}`,
      `shadowx=2`,
      `shadowy=2`,
      `x=w-tw-${options.margin}`,
      `y=h-th-${options.margin}`,
    ].join(':');

    const ffmpegArgs = [
      '-hide_banner',
      '-loglevel', 'error',
      '-stats',
      '-y',
      '-i', inputFile,
      '-vf', `drawtext=${drawTextFilter}`,
      '-c:v', 'libx264',
      '-crf', '18',
      '-preset', 'slow',
      '-pix_fmt', 'yuv420p',
      '-c:a', 'copy',
      outputFile,
    ];

    const child = spawn(ffmpegBin, ffmpegArgs, { stdio: ['inherit', 'pipe', 'pipe'] });

    let stderrData = '';
    child.stderr.on('data', (d) => {
      const text = d.toString();
      stderrData += text;
      // Extract frame or time progress from FFmpeg stats output
      const timeMatch = text.match(/time=(\d{2}:\d{2}:\d{2}\.\d{2})/);
      if (timeMatch) {
        process.stdout.write(`\r  -> Encoding progress: time=${timeMatch[1]} `);
      }
    });

    child.on('close', (code) => {
      process.stdout.write('\r                                                   \r');
      if (code === 0) {
        resolve({ success: true });
      } else {
        resolve({ success: false, error: stderrData.trim() || `Exit code ${code}` });
      }
    });

    child.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });
  });
}

async function main() {
  const options = parseArgs();

  if (options.help) {
    console.log(`
Evoless Batch Watermark Tool
Usage: node scripts/watermark-batch.mjs [options]

Options:
  -i, --input <dir>       Input directory containing original videos
  -o, --output <dir>      Output directory for watermarked videos
  -t, --text <string>     Watermark text (default: "evoless.editor")
  -a, --opacity <float>   Watermark opacity (default: 0.35, max 0.50)
  -s, --fontsize <num>    Font size in px (default: 28)
  -m, --margin <num>      Margin in px from bottom-right (default: 36)
  -f, --fontfile <path>   Path to custom TTF font
      --force             Overwrite existing output files
  -h, --help              Show this help message
    `);
    process.exit(0);
  }

  // Detect FFmpeg
  const ffmpegBin = findFFmpegBinary();
  if (!ffmpegBin) {
    console.error('\n[ERROR] FFmpeg binary was not found!');
    console.error('Please ensure FFmpeg is installed at C:\\ffmpeg\\bin\\ffmpeg.exe or in your Windows PATH.');
    process.exit(1);
  }

  // Detect Windows font
  if (!options.fontfile) {
    const detectedFont = findWindowsFont();
    if (!detectedFont) {
      console.error('\n[ERROR] Could not detect a standard Windows font (Segoe UI or Arial).');
      console.error('Please provide a font with --fontfile <path>.');
      process.exit(1);
    }
    options.fontfile = detectedFont;
  }

  // If input or output not passed via flags, run interactive wizard
  if (!options.input || !options.output) {
    await runInteractive(options);
  }

  // Resolve absolute paths
  const inputDir = path.resolve(options.input);
  const outputDir = path.resolve(options.output);

  if (!fs.existsSync(inputDir)) {
    console.error(`\n[ERROR] Input directory does not exist: "${inputDir}"`);
    console.log('Creating sample input directory...');
    fs.mkdirSync(inputDir, { recursive: true });
    console.log(`Please place your videos in: ${inputDir}`);
    process.exit(1);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Scan input directory for videos
  const allFiles = fs.readdirSync(inputDir);
  const videoFiles = allFiles.filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return SUPPORTED_EXTS.has(ext);
  });

  if (videoFiles.length === 0) {
    console.log(`\nNo supported videos found in: ${inputDir}`);
    console.log(`Supported extensions: ${Array.from(SUPPORTED_EXTS).join(', ')}`);
    process.exit(0);
  }

  console.log('\n--- Configuration ---');
  console.log(`FFmpeg:       ${ffmpegBin}`);
  console.log(`Input:        ${inputDir}`);
  console.log(`Output:       ${outputDir}`);
  console.log(`Watermark:    "${options.text}"`);
  console.log(`Opacity:      ${(options.opacity * 100).toFixed(0)}% (capped at 50% max)`);
  console.log(`Font Size:    ${options.fontsize}px`);
  console.log(`Safe Margin:  ${options.margin}px from bottom-right`);
  console.log(`Font File:    ${options.fontfile}`);
  console.log(`Files found:  ${videoFiles.length}`);
  console.log('---------------------\n');

  let processedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;
  const startTime = Date.now();

  for (let i = 0; i < videoFiles.length; i++) {
    const filename = videoFiles[i];
    const inputFile = path.join(inputDir, filename);
    const outputFile = path.join(outputDir, filename);

    console.log(`[${i + 1}/${videoFiles.length}] ${filename}`);

    // Check if output already exists (never overwrite unless --force is explicitly provided)
    if (fs.existsSync(outputFile) && !options.force) {
      console.log(`  -> Skipped: Output file already exists. (Use --force to overwrite)`);
      skippedCount++;
      continue;
    }

    const result = await processVideo(ffmpegBin, inputFile, outputFile, options);

    if (result.success) {
      console.log(`  -> Watermarked successfully.`);
      processedCount++;
    } else {
      console.error(`  -> Failed: ${result.error}`);
      failedCount++;
    }
  }

  const durationSec = (Date.now() - startTime) / 1000;
  console.log('\n======================================================');
  console.log('                   BATCH SUMMARY                      ');
  console.log('======================================================');
  console.log(`Total videos found:  ${videoFiles.length}`);
  console.log(`Successfully processed: ${processedCount}`);
  console.log(`Skipped (already exists): ${skippedCount}`);
  console.log(`Failed:              ${failedCount}`);
  console.log(`Total time elapsed:  ${formatDuration(durationSec)}`);
  console.log(`Output directory:    ${outputDir}`);
  console.log('======================================================\n');
}

main().catch((err) => {
  console.error('\nFatal error:', err);
  process.exit(1);
});

