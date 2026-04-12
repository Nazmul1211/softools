#!/usr/bin/env node

import { promises as fs, watch as watchFileSystem } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = path.resolve(process.cwd(), "public");
const RASTER_EXTENSIONS = new Set([".png", ".jpg", ".jpeg"]);
const WEBP_EFFORT = 6;
const WATCH_DEBOUNCE_MS = 250;
const WATCH_MODE = process.argv.includes("--watch");
const REMOVE_SOURCE_AFTER_CONVERT = process.argv.includes("--remove-source");
const AUTO_REMOVE_SOURCE_DIRS = ["images", "legacy-images"];

function parseQuality() {
  const qualityValue = process.env.IMAGE_WEBP_QUALITY ?? "75";
  const quality = Number.parseInt(qualityValue, 10);

  if (!Number.isInteger(quality) || quality < 1 || quality > 100) {
    throw new Error(
      `IMAGE_WEBP_QUALITY must be an integer from 1 to 100. Received: ${qualityValue}`
    );
  }

  return quality;
}

function formatBytes(bytes) {
  const absoluteBytes = Math.abs(bytes);

  if (absoluteBytes < 1024) {
    return `${bytes} B`;
  }

  const units = ["KB", "MB", "GB", "TB"];
  let unitIndex = -1;
  let value = absoluteBytes;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const signedValue = bytes < 0 ? -value : value;
  return `${signedValue.toFixed(2)} ${units[unitIndex]}`;
}

async function safeStat(filePath) {
  try {
    return await fs.stat(filePath);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return null;
    }

    throw error;
  }
}

function isRasterImage(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return RASTER_EXTENSIONS.has(extension);
}

function getWebpPath(sourcePath) {
  return sourcePath.replace(/\.(png|jpe?g)$/i, ".webp");
}

function toDisplayPath(filePath) {
  return path.relative(process.cwd(), filePath);
}

function shouldAutoRemoveSource(sourcePath) {
  const relativePath = path
    .relative(PUBLIC_DIR, sourcePath)
    .replaceAll(path.sep, "/");

  return AUTO_REMOVE_SOURCE_DIRS.some(
    (directory) =>
      relativePath === directory || relativePath.startsWith(`${directory}/`)
  );
}

async function removeSourceFile(sourcePath) {
  try {
    await fs.unlink(sourcePath);
    console.log(
      `[images:watch] Removed ${toDisplayPath(sourcePath)} after WebP conversion.`
    );
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return;
    }

    throw error;
  }
}

async function collectRasterFiles(directoryPath) {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const discoveredFiles = [];

  for (const entry of entries) {
    const entryPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      const childFiles = await collectRasterFiles(entryPath);
      discoveredFiles.push(...childFiles);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (isRasterImage(entryPath)) {
      discoveredFiles.push(entryPath);
    }
  }

  return discoveredFiles;
}

async function convertImage(sourcePath, quality) {
  const webpPath = getWebpPath(sourcePath);
  const sourceStats = await fs.stat(sourcePath);
  const existingWebpStats = await safeStat(webpPath);

  if (existingWebpStats && existingWebpStats.mtimeMs >= sourceStats.mtimeMs) {
    return {
      sourceBytes: sourceStats.size,
      webpBytes: existingWebpStats.size,
      converted: false,
      sourcePath,
      webpPath,
    };
  }

  await sharp(sourcePath)
    .rotate()
    .webp({ quality, effort: WEBP_EFFORT })
    .toFile(webpPath);

  const webpStats = await fs.stat(webpPath);

  return {
    sourceBytes: sourceStats.size,
    webpBytes: webpStats.size,
    converted: true,
    sourcePath,
    webpPath,
  };
}

async function convertUpdatedImage(sourcePath, quality) {
  if (!isRasterImage(sourcePath)) {
    return;
  }

  const sourceStats = await safeStat(sourcePath);
  if (!sourceStats || !sourceStats.isFile()) {
    return;
  }

  const result = await convertImage(sourcePath, quality);
  if (result.converted) {
    console.log(
      `[images:watch] Converted ${toDisplayPath(result.sourcePath)} -> ${toDisplayPath(result.webpPath)}.`
    );
  }

  if (
    REMOVE_SOURCE_AFTER_CONVERT &&
    shouldAutoRemoveSource(sourcePath) &&
    (await safeStat(result.webpPath))
  ) {
    await removeSourceFile(sourcePath);
  }
}

async function runFullConversion(quality) {
  const publicDirStats = await safeStat(PUBLIC_DIR);

  if (!publicDirStats || !publicDirStats.isDirectory()) {
    throw new Error(`Public directory not found: ${PUBLIC_DIR}`);
  }

  const rasterFiles = await collectRasterFiles(PUBLIC_DIR);

  if (rasterFiles.length === 0) {
    console.log("[images:convert] No PNG/JPG/JPEG files found in /public.");
    return true;
  }

  rasterFiles.sort((a, b) => a.localeCompare(b));

  let convertedCount = 0;
  let skippedCount = 0;
  let totalSourceBytes = 0;
  let totalWebpBytes = 0;
  const failures = [];

  for (const sourcePath of rasterFiles) {
    try {
      const result = await convertImage(sourcePath, quality);

      totalSourceBytes += result.sourceBytes;
      totalWebpBytes += result.webpBytes;

      if (result.converted) {
        convertedCount += 1;
      } else {
        skippedCount += 1;
      }
    } catch (error) {
      failures.push({
        sourcePath,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const bytesSaved = totalSourceBytes - totalWebpBytes;
  const savingsPercent =
    totalSourceBytes > 0
      ? ((bytesSaved / totalSourceBytes) * 100).toFixed(2)
      : "0.00";

  console.log(
    `[images:convert] Converted ${convertedCount} file(s), skipped ${skippedCount} up-to-date file(s), quality ${quality}%.`
  );
  console.log(
    `[images:convert] Source ${formatBytes(totalSourceBytes)} -> WebP ${formatBytes(totalWebpBytes)} (${formatBytes(bytesSaved)} saved, ${savingsPercent}%).`
  );

  if (failures.length > 0) {
    console.error("[images:convert] Failed conversions:");
    for (const failure of failures) {
      console.error(`- ${failure.sourcePath}: ${failure.message}`);
    }
    process.exitCode = 1;
  }

  return failures.length === 0;
}

function watchForChanges(quality) {
  console.log(
    `[images:watch] Watching ${PUBLIC_DIR} for PNG/JPG/JPEG changes...`
  );

  const pendingTimers = new Map();
  const watcher = watchFileSystem(
    PUBLIC_DIR,
    { recursive: true },
    (_eventType, fileName) => {
      if (!fileName) {
        return;
      }

      const relativePath = fileName.toString();
      const sourcePath = path.join(PUBLIC_DIR, relativePath);

      if (!isRasterImage(sourcePath)) {
        return;
      }

      const existingTimer = pendingTimers.get(sourcePath);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      const timer = setTimeout(async () => {
        pendingTimers.delete(sourcePath);
        try {
          await convertUpdatedImage(sourcePath, quality);
        } catch (error) {
          console.error(
            `[images:watch] Failed ${toDisplayPath(sourcePath)}: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      }, WATCH_DEBOUNCE_MS);

      pendingTimers.set(sourcePath, timer);
    }
  );

  return new Promise((resolve, reject) => {
    const shutdown = () => {
      for (const timer of pendingTimers.values()) {
        clearTimeout(timer);
      }
      pendingTimers.clear();
      watcher.close();
      resolve();
    };

    watcher.on("error", (error) => {
      reject(error);
    });

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  });
}

async function main() {
  const quality = parseQuality();
  const isSuccessful = await runFullConversion(quality);

  if (WATCH_MODE) {
    await watchForChanges(quality);
    return;
  }

  if (!isSuccessful) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(
    `[images:convert] Fatal error: ${
      error instanceof Error ? error.message : String(error)
    }`
  );
  process.exit(1);
});
