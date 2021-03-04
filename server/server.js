const express = require('express')
const app = express()
const port = 3001
const fs = require('fs')
const cors = require('cors')

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/find-file', (req, res) => {
  const path = req.query.path
  // fs.readdir(path, (err, files) => {
  //   files.forEach(file => console.log(file))
  // })
  if (fs.existsSync(path) && path.match(/.*\/.*.mp3$/)) {
    res.json({found: true})
  } else {
    res.json({found: false})
  }
})

app.get('/stream', (req, res) => {
  // Ensure there is a range given for the video
  const range = req.headers.range;
  
  const mediaPath = req.query.path
  const mediaSize = fs.statSync(mediaPath).size;

  if (range) {
    const CHUNK_SIZE = 7 ** 6; // default: 10 ** 6

    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, mediaSize - 1);

    const contentLength = end - start + 1;

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${mediaSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "audio/mp3",
    };

    
    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    const mediaStream = fs.createReadStream(mediaPath, { start, end });
    mediaStream.pipe(res);
  } else {
    const head = {
      'Content-Length': mediaSize,
      'Content-Type': "audio/mp3",
    }
    res.writeHead(200, head)
    fs.createReadStream(mediaPath).pipe(res)
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})