import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.get("/", (req, res) => res.send("✅ GitEasy OAuth backend is running."));

app.get("/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.send("❌ Missing code from GitHub.");

  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const { access_token } = tokenResponse.data;
    if (!access_token) return res.send("❌ Failed to get token.");

    res.send("✅ Authorized! You can close this tab and return to VS Code.");
    console.log("Access token:", access_token);
  } catch (err) {
    console.error(err);
    res.send("❌ OAuth failed.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));