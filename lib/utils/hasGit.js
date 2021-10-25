const { execSync } = require('child_process');

function hasGit() {
  try {
    execSync('git --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = hasGit;
