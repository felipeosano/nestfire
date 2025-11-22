const path = require('node:path');

function runGenerateFirebaseDeployment() {
  require(path.join(__dirname, '..', 'src', 'scripts', 'generate-firebase-deployment.js'));
}

function runCheckAndInstallFirebase() {
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
