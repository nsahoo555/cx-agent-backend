# DesignPatternAgent Backend

Minimal Node.js backend that connects a web chat UI to your Dialogflow CX agent
`DesignPatternAgent` (project `designpattern-456617`, location `global`).

## Local setup

1. Install Node.js (v18+ recommended).
2. In this folder, run:

   ```bash
   npm install
   ```

3. Create a Google Cloud service account with Dialogflow CX permissions and
   download the JSON key file.
4. Set the environment variable so the Dialogflow SDK can find your key:

   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/to/your-key.json"
   ```

5. Start the server:

   ```bash
   npm start
   ```

6. Test it:

   ```bash
   curl -X POST http://localhost:8080/chat \
     -H "Content-Type: application/json" \
     -d '{"sessionId":"test123","text":"Hi"}'
   ```

You should see a JSON response with `replies` from your agent.

## Deploying

- Push this folder to GitHub.
- Use a host like Render, Railway, or Google Cloud Run.
- Set `GOOGLE_APPLICATION_CREDENTIALS` according to their docs
  (either upload the JSON key or store it as a secret).
- Once deployed, your public endpoint will look like:

  `https://YOUR-BACKEND-URL/chat`
