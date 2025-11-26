const express = require("express");
const cors = require("cors");
const { SessionsClient } = require("@google-cloud/dialogflow-cx");

const app = express();
app.use(cors());
app.use(express.json());

// --- Dialogflow CX configuration for your DesignPatternAgent ---
const projectId = "designpattern-456617";
const location  = "global";
const agentId   = "2f3bf99f-2be1-4f88-8857-dcec1d5b1265";

// ABSOLUTE PATH TO YOUR JSON KEY (Windows style).
// Make sure this path matches where your file actually is.
const keyFilePath = "C:\\Users\\nikit\\OneDrive - Georgia Institute of Technology\\designpattern-backend\\designpattern-456617-bef9c3400ad5.json";

// Log for sanity
console.log("Using key file:", keyFilePath);

// Create Dialogflow CX SessionsClient using the key file directly
const client = new SessionsClient({
  keyFilename: keyFilePath,
});

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
