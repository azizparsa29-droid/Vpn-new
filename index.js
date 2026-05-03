const express = require('express');
const app = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

// رله اصلی - Apps Script به این endpoint درخواست می‌زند
app.post('/relay', async (req, res) => {
  try {
    const { url, method = 'GET', headers = {}, body } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'Missing url parameter' });
    }

    console.log(`Relaying to: ${url} (${method})`);

    const fetchOptions = {
      method: method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...headers
      }
    };

    if (body) {
      fetchOptions.body = body;
    }

    const response = await fetch(url, fetchOptions);
    const responseBody = await response.text();
    const responseHeaders = {};
    
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    console.log(`Response from ${url}: ${response.status}`);

    res.json({
      status: response.status,
      headers: responseHeaders,
      body: responseBody
    });

  } catch (error) {
    console.error('Relay error:', error);
    res.status(500).json({ error: error.message });
  }
});

// مسیر اصلی برای تست
app.get('/', (req, res) => {
  res.send('Relay server is running. Use POST /relay endpoint.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Relay server running on port ${PORT}`);
});
