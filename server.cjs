const express = require('express');
const path = require('path');
const app = express();
const port = 7860;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/config', (req, res) => {
  res.json({
    clientId: process.env.OAUTH_CLIENT_ID,
    scopes: process.env.OAUTH_SCOPES || "openid profile",
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
