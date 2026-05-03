const express = require('express');
const app = express();

app.use(express.json());
app.use(express.text());

// رله ساده - هر درخواست را به مقصد هدایت می‌کند
app.all('*', async (req, res) => {
  try {
    const targetUrl = req.query.url || req.body.url;
    
    if (!targetUrl) {
      return res.status(400).send('Missing url parameter');
    }

    const fetchOptions = {
      method: req.method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    // اگر بدنه درخواست وجود داشت، اضافه کن
    if (req.method !== 'GET' && req.body) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.text();
    
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).send('Relay error: ' + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Relay server running on port ${PORT}`);
});
