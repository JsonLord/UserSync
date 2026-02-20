const express = require('express');
const path = require('path');
const app = express();
const port = 7860;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/craft', async (req, res) => {
  const { content, variation } = req.body;
  const apiKey = process.env.BLABLADOR_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'BLABLADOR_API_KEY is not configured on the server.' });
  }

  const model = content.length > 500 ? 'alias-large' : 'alias-fast';
  const prompt = `You are a professional content creator. Help me craft a ${variation || 'social media post'} based on the following content:\n\n${content}\n\nProvide 3 distinct and engaging variations.`;

  try {
    const response = await fetch('https://api.helmholtz-blablador.fz-juelich.de/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: 'You are a helpful assistant that helps craft engaging marketing and social media content.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.json({ result: data.choices[0].message.content });
  } catch (error) {
    console.error('Blablador API error:', error);
    res.status(500).json({ error: 'Failed to connect to Blablador API.' });
  }
});

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
