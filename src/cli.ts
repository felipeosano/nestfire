#!/usr/bin/env node
import path from 'node:path';

function runGenerateFirebaseDeployment() {
  // @ts-ignore
  // eslint-disable-next-line
  require(path.join(__dirname, '..', 'src', 'scripts', 'generate-firebase-deployment.js'));
}

function runCheckAndInstallFirebase() {
  // @ts-ignore
  // eslint-disable-next-line
  require(path.join(__dirname, '..', 'src', 'scripts', 'check-and-install-firebase.js'));
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'init') {
    runGenerateFirebaseDeployment();
    runCheckAndInstallFirebase();
    return;
  }

  console.log('Usage:');
  console.log('  nestfire init');
}

main();
