const express = require('express');
const axios = require('axios');
const app = express();

// إعدادات يمكنك تغييرها عن بعد
const TARGET_HOST = 'https://api22-core-c-alisg.tiktokv.com';
const TARGET_PATH = '/lite/v2/feed/fyp/';

app.post('/lite/v2/feed/fyp/', async (req, res) => {
  try {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', async () => {
      const body = Buffer.concat(chunks);
      const headers = { ...req.headers };
      delete headers['host'];
      delete headers['content-length'];
      delete headers['accept-encoding'];

      const qs = new URLSearchParams(req.query).toString();
      const url = `${TARGET_HOST}${TARGET_PATH}?${qs}`;

      const response = await axios.post(url, body, {
        headers,
        responseType: 'arraybuffer',
        validateStatus: () => true
      });

      const respHeaders = { ...response.headers };
      delete respHeaders['transfer-encoding'];
      res.set(respHeaders).status(response.status).send(response.data);
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(502).json({ status_code: 1 });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
