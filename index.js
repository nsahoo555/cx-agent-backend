const express = require("express");
const cors = require("cors");
const { SessionsClient } = require("@google-cloud/dialogflow-cx");

// --- Dialogflow CX configuration for your DesignPatternAgent ---
const projectId = "designpattern-456617";
const location  = "global";
const agentId   = "2f3bf99f-2be1-4f88-8857-dcec1d5b1265";

// Use env var in production (Render), file path locally
let client;

if (process.env.GOOGLE_CLOUD_CREDENTIALS) {
  // On Render: JSON string in env var
  console.log("Using credentials from GOOGLE_CLOUD_CREDENTIALS env var");
  const creds = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS);
  client = new SessionsClient({
    credentials: creds,
  });
} else {
  // Local dev: key file on disk
  const keyFilePath = "C:\\Users\\nikit\\designpattern-456617-bef9c3400ad5.json";
  console.log("Using local key file:", keyFilePath);
  client = new SessionsClient({
    keyFilename: keyFilePath,
  });
}


app.post("/chat", async (req, res) => {
  try {
    const { sessionId, text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Missing 'text' in body" });
    }

    const sid = sessionId || "anon-session";

    const sessionPath = client.projectLocationAgentSessionPath(
      projectId,
      location,
      agentId,
      sid
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: { text },
        languageCode: "en",
      },
    };

    const [response] = await client.detectIntent(request);

    const messages =
      response.queryResult.responseMessages
        .map((m) => (m.text && m.text.text) || [])
        .flat()
        .filter(Boolean);

    res.json({ replies: messages });
  } catch (err) {
    // 💥 RETURN THE REAL ERROR IN THE RESPONSE
    console.error("Dialogflow error message:", err.message);
    console.error("Dialogflow error details:", err.details || err);

    res.status(500).json({
      error: err.message || "Internal error",
      details: err.details || null,
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
