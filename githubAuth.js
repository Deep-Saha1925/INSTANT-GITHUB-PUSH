// src/auth/githubAuth.js
const vscode = require("vscode");
const http = require("http");
const open = require("open");
const fetch = require("node-fetch");

async function githubLogin(context) {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  // Start a temporary local server to catch GitHub's redirect
  const server = http.createServer(async (req, res) => {
    if (req.url.startsWith("/callback")) {
      const urlParams = new URL(req.url, "http://localhost:54321");
      const code = urlParams.searchParams.get("code");

      res.end("✅ Authorization successful! You can close this tab.");
      server.close();

      // Exchange code for access token
      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
      });
      const data = await tokenRes.json();

      const token = data.access_token;
      if (token) {
        await context.globalState.update("githubToken", token);
        vscode.window.showInformationMessage("✅ GitHub login successful!");
      } else {
        vscode.window.showErrorMessage("❌ GitHub login failed");
      }
    }
  });

  server.listen(54321, () => {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user&redirect_uri=http://localhost:54321/callback`;
    open(authUrl);
  });
}

module.exports = { githubLogin };
