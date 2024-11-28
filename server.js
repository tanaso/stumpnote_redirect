const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(cors());
app.use(bodyParser.json());

// Notion APIの設定
const NOTION_API_BASE = "https://api.notion.com/v1";
const NOTION_API_VERSION = "2022-06-28";

// ルート
app.get("/", (req, res) => {
  res.send("Backend is running!");
  console.log(req.body);
});

app.get("/auth/callback", async (req, res) => {
    const code = req.query.code;
  
    if (!code) {
      res.status(400).json({ error: "No code provided" });
      return;
    }

    axios.post(
        "myapp://oauth/callback?code=" + code
    )
  
    // try {
    //   const tokenResponse = await axios.post(
    //     "https://api.notion.com/v1/oauth/token",
    //     {
    //       grant_type: "authorization_code",
    //       code,
    //       redirect_uri: process.env.NOTION_REDIRECT_URI,
    //       client_id: process.env.NOTION_CLIENT_ID,
    //       client_secret: process.env.NOTION_CLIENT_SECRET,
    //     },
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
  
    //   console.log("Access Token:", tokenResponse.data.access_token);
    // //   res.json(tokenResponse.data); // アクセストークンをフロントエンドに返却
    //     window.location.replace(
    //         "myapp://oauth/callback?code=" + code
    //     );
    // } catch (error) {
    //   console.error("Error fetching token:", error.response?.data || error.message);
    //   res.status(500).json({ error: "Failed to fetch token" });
    // }
});
  

// Notion OAuthトークン取得エンドポイント
app.post("/auth/token", async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post(
      "https://api.notion.com/v1/oauth/token",
      {
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.NOTION_REDIRECT_URI,
        client_id: process.env.NOTION_CLIENT_ID,
        client_secret: process.env.NOTION_CLIENT_SECRET,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // アクセストークンを返却
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching token:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch token" });
  }
});

// Notion APIを使用してユーザーのページリストを取得
app.post("/notion/pages", async (req, res) => {
  const { accessToken } = req.body;

  try {
    const response = await axios.get(`${NOTION_API_BASE}/databases`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Notion-Version": NOTION_API_VERSION,
      },
    });

    // データベースリストを返却
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching pages:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch pages" });
  }
});

// サーバーを起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
