const express = require('express');
const fs = require('fs');
const multer  = require('multer');
const path = require('path');
const WebSocket = require('ws');
const http = require('http');
const url = require('url');
require('dotenv').config();

const app = express();
const port = 3333;

// Define a custom storage strategy for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    // Always use the same filename
    cb(null, 'latest_image' + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
const wss = new WebSocket.Server({ noServer: true });

// Create an HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('HTTP Server Running');
  });


wss.on('connection', function connection(ws) {
  console.log('A client connected via WebSocket.');
  const filePath = path.join(__dirname, 'uploads', 'latest_image.jpg'); // Ensure the path is correct
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('Error reading the latest image file:', err);
      // Optionally, send an error message to the client
      // ws.send('Error loading latest image');
      return;
    }
    const base64Image = data.toString('base64');
    // Send the Base64-encoded image to the newly connected client
    ws.send(base64Image);
  });
});

// Handle upgrade requests
server.on('upgrade', function upgrade(request, socket, head) {
  const pathname = url.parse(request.url).pathname;
  const queryParams = new URLSearchParams(url.parse(request.url).query);
  const password = queryParams.get('password');

  if (password === process.env.FRONTEND_PASSWORD) {
    wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
    });
    } else {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        // If you were to use a code, it might look something like this, but it's not standard:
        // socket.close(4000); // This line is more illustrative than functional
    }
});


server.listen(8888, function() {
  console.log('Server and WebSocket running on port 8888');
});
function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

app.post('/upload', upload.single('image'), (req, res) => {
  const filePath = req.file.path;
  
  // Read the file and convert it to Base64
  fs.readFile(filePath, (err, data) => {
    if (err) throw err;
    
    const base64Image = data.toString('base64');
    broadcast(base64Image); // Broadcast the Base64-encoded image
    res.send('Image uploaded and broadcasted successfully');
  });
});

app.use(express.static('public'));
app.use('/images', express.static('uploads'));

app.listen(port, () => {
  console.log(`HTTP server listening at http://localhost:${port}`);
});
