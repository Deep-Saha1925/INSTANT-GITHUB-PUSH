const vscode = require("vscode");
const fetch = require("node-fetch");
const { execSync } = require("child_process");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

// ✅ Read GitHub OAuth credentials
const CLIENT_ID = process.env.CLIENT_ID;

// ✅ Your deployed Railway backend
const BACKEND_URL = "https://instant-github-push-production.up.railway.app";

// ✅ GitHub OAuth redirect URL (handled by your backend)
const REDIRECT_URI = `${BACKEND_URL}/callback`;

async function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "extension.createAndPushRepo",
    async function () {
      if (!CLIENT_ID) {
        vscode.window.showErrorMessage("Missing CLIENT_ID in .env file!");
        return;
      }

      vscode.window.showInformationMessage("Redirecting to GitHub for authorization...");

      // Step 1️⃣: Generate GitHub OAuth URL
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo`;

      // Step 2️⃣: Open GitHub OAuth URL in default browser
      vscode.env.openExternal(vscode.Uri.parse(authUrl));

      // Step 3️⃣: Notify user
      vscode.window.showInformationMessage(
        "Authorize GitHub in your browser. Once authorized, return to VS Code."
      );

      // ⚙️ Optional improvement:
      // You can ask the user to paste a code/token that backend logs or sends later.
      vscode.window.showInformationMessage(
        "GitEasy cloud backend is handling authorization securely."
      );
    }
  );

  context.subscriptions.push(disposable);
}

async function createAndPushRepo(accessToken) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage("No workspace folder is open in VS Code!");
    return;
  }

  const cwd = workspaceFolders[0].uri.fsPath;
  const repoName = await vscode.window.showInputBox({
    prompt: "Enter the new GitHub repository name:",
    ignoreFocusOut: true,
  });

  if (!repoName) return;

  vscode.window.showInformationMessage("Creating GitHub repository...");

  const response = await fetch("https://api.github.com/user/repos", {
    method: "POST",
    headers: {
      Authorization: `token ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: repoName, private: false }),
  });

  const data = await response.json();

  if (!response.ok) {
    vscode.window.showErrorMessage(`Repository creation failed: ${data.message}`);
    return;
  }

  try {
    vscode.window.showInformationMessage(`Repository created: ${data.html_url}`);

    execSync("git init", { cwd, stdio: "inherit", shell: true });
    execSync("git add .", { cwd, stdio: "inherit", shell: true });
    execSync('git commit -m "Initial commit"', { cwd, stdio: "inherit", shell: true });
    execSync("git branch -M main", { cwd, stdio: "inherit", shell: true });
    execSync(`git remote add origin ${data.clone_url}`, { cwd, stdio: "inherit", shell: true });
    execSync("git push -u origin main", { cwd, stdio: "inherit", shell: true });

    vscode.window.showInformationMessage("Code pushed successfully to GitHub!");
  } catch (err) {
    vscode.window.showErrorMessage("Git push failed: " + err.message);
  }
}

function deactivate() {}

module.exports = { activate, deactivate };