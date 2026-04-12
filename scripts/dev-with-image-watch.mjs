#!/usr/bin/env node

import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const childProcesses = [];
let shuttingDown = false;

function runNpmScript(scriptName) {
  const child = spawn(npmCommand, ["run", scriptName], {
    stdio: "inherit",
    env: process.env,
  });

  childProcesses.push(child);
  return child;
}

function shutdown(signal = "SIGTERM") {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of childProcesses) {
    if (child.exitCode === null) {
      child.kill(signal);
    }
  }
}

const imageWatcher = runNpmScript("images:watch");
const nextDev = runNpmScript("dev:next");

imageWatcher.on("exit", (code) => {
  if (shuttingDown) {
    return;
  }

  if (code !== 0) {
    console.error(
      `[dev] images:watch stopped unexpectedly with exit code ${code}.`
    );
    shutdown("SIGTERM");
    process.exit(code ?? 1);
  }
});

nextDev.on("exit", (code) => {
  shutdown("SIGTERM");
  process.exit(code ?? 0);
});

process.on("SIGINT", () => {
  shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});
