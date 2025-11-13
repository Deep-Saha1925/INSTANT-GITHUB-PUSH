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
      new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }).toString(),
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, error, error_description } = tokenResponse.data;

    if (error) {
      console.error("GitHub error:", error_description);
      return res.send("❌ GitHub OAuth error: " + error_description);
    }

    if (!access_token) return res.send("❌ No access token received.");

    console.log("✅ Access token received:", access_token);
    res.send("✅ Authorized! You can close this tab and return to VS Code.");
  } catch (err) {
    console.error("OAuth error:", err.response?.data || err.message);
    res.send("❌ OAuth failed. See logs for details.");
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));