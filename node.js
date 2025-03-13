const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS for frontend-backend communication
app.use(cors());

// Endpoint to handle video download
app.get('/download', async (req, res) => {
  const videoURL = req.query.url;

  if (!ytdl.validateURL(videoURL)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    const info = await ytdl.getInfo(videoURL);
    const videoTitle = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_'); // Sanitize title for filename
    const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highest' });

    res.header('Content-Disposition', `attachment; filename="${videoTitle}.mp4"`);
    ytdl(videoURL, { format: videoFormat }).pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to download video' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});