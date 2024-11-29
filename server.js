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

// In-memory storage for access tokens (replace with a database in production)
let accessTokenStore = null;

// Notion APIエンドポイント
const NOTION_TOKEN_URL = "https://api.notion.com/v1/oauth/token";

// エンドポイント: Notionのリダイレクト先
app.get("/auth/callback", (req, res) => {
    const code = req.query.code;
  
    if (!code) {
      return res.status(400).json({ error: "Authorization code is missing" });
    }
  
    try {
      // 認証コードをReact Nativeに返す
      console.log("Authorization Code:", code);
      res.json({ code });
    } catch (error) {
      console.error("Error handling callback:", error.message);
      res.status(500).json({ error: "Failed to handle authorization callback" });
    }
});

// エンドポイント: React Nativeクライアントがアクセストークンを取得
app.get("/get-token", (req, res) => {
  if (!accessTokenStore) {
    return res.status(404).json({ error: "No access token available" });
  }

  res.json({ access_token: accessTokenStore });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
