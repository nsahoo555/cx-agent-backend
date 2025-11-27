const express = require("express");
const cors = require("cors");
const { SessionsClient } = require("@google-cloud/dialogflow-cx");

const app = express();
app.use(cors());
app.use(express.json());

// --- Dialogflow CX configuration ---
const projectId = "designpattern-456617";
const location = "global";
const agentId = "2f3bf99f-2be1-4f88-8857-dcec1d5b1265";

let client;

// Use env var on Render, local key file on your laptop
if (process.env.GOOGLE_CLOUD_CREDENTIALS) {
  console.log("Using credentials from GOOGLE_CLOUD_CREDENTIALS env var");
  const creds = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS);
  client = new SessionsClient({
    credentials: creds,
  });
} else {
  const keyFilePath =
    "C:\\Users\\nikit\\designpattern-456617-bef9c3400ad5.json"; // <-- your local key path
  console.log("Using local key file:", keyFilePath);
  client = new SessionsClient({
    keyFilename: keyFilePath,
  });
}

// Chat endpoint
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

    const messages = (response.queryResult.responseMessages || [])
      .map((m) => (m.text && m.text.text) || [])
      .flat()
      .filter(Boolean);

    res.json({ replies: messages });
  } catch (err) {
    console.error("Dialogflow error:", err);
    res.status(500).json({
      error: err.message || "Internal error",
      details: err.details || null,
    });
  }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
