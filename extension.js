const vscode = require("vscode");
const express = require("express");
const open = require("open");
const fetch = require("node-fetch");
const { execSync } = require("child_process");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const PORT = 5173;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;

async function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "extension.createAndPushRepo",
    async function () {
      if (!CLIENT_ID || !CLIENT_SECRET) {
        vscode.window.showErrorMessage(
          "❌ Missing CLIENT_ID or CLIENT_SECRET in .env file!"
        );
        return;
      }

      vscode.window.showInformationMessage("🔑 Redirecting to GitHub for authorization...");

      const app = express();
      let server;

      // Step 1: Create GitHub OAuth URL
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo`;

      // Step 2: Open GitHub OAuth URL in browser
      await open(authUrl);

      // Step 3: Handle OAuth callback
      server = app.listen(PORT, () => {
        console.log(`🌐 Listening for GitHub OAuth callback on port ${PORT}`);
      });

      app.get("/callback", async (req, res) => {
        const code = req.query.code;
        if (!code) {
          res.send("❌ Authorization failed or cancelled.");
          return;
        }

        try {
          // Step 4: Exchange code for access token
          const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              client_id: CLIENT_ID,
              client_secret: CLIENT_SECRET,
              code,
              redirect_uri: REDIRECT_URI,
            }),
          });

          const tokenData = await tokenResponse.json();
          const accessToken = tokenData.access_token;

          if (!accessToken) {
            res.send("❌ Failed to obtain GitHub access token. Please retry.");
            return;
          }

          res.send("<h2>✅ GitHub authorization successful! You can close this tab.</h2>");
          server.close();

          vscode.window.showInformationMessage("✅ GitHub authorized successfully!");
          await createAndPushRepo(accessToken);

        } catch (error) {
          console.error("GitHub OAuth Error:", error);
          res.send("❌ OAuth process failed. Check VS Code logs for details.");
          server.close();
        }
      });
    }
  );

  context.subscriptions.push(disposable);
}

async function createAndPushRepo(accessToken) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage("❌ No workspace folder is open in VS Code!");
    return;
  }

  const cwd = workspaceFolders[0].uri.fsPath;
  const repoName = await vscode.window.showInputBox({
    prompt: "Enter the new GitHub repository name:",
    ignoreFocusOut: true,
  });

  if (!repoName) return;

  vscode.window.showInformationMessage("📦 Creating GitHub repository...");

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
    vscode.window.showErrorMessage(`❌ Repository creation failed: ${data.message}`);
    return;
  }

  try {
    vscode.window.showInformationMessage(`✅ Repository created: ${data.html_url}`);

    execSync("git init", { cwd, stdio: "inherit", shell: true });
    execSync("git add .", { cwd, stdio: "inherit", shell: true });
    execSync('git commit -m "Initial commit"', { cwd, stdio: "inherit", shell: true });
    execSync("git branch -M main", { cwd, stdio: "inherit", shell: true });
    execSync(`git remote add origin ${data.clone_url}`, { cwd, stdio: "inherit", shell: true });
    execSync("git push -u origin main", { cwd, stdio: "inherit", shell: true });

    vscode.window.showInformationMessage("🚀 Code pushed successfully to GitHub!");
  } catch (err) {
    vscode.window.showErrorMessage("❌ Git push failed: " + err.message);
  }
}

function deactivate() {}

module.exports = { activate, deactivate };