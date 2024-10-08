const fetch = require("node-fetch");

async function getAccessToken(notionId, notionSecret, code) {
    return await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization':
          "Basic " +
          Buffer.from(`${notionId}:${notionSecret}`).toString("base64"),
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.REDIRECT_URI,
      }),
    }).then((res) => res.json());
}

module.exports = {getAccessToken}