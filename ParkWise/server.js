const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Sample data for now. Later, this will come from the camera analysis.
const sampleParkingAnalysis = {
    site: "BPSU OCEA Parking Area",
    capturedAt: new Date().toISOString(),
   gaps: [
    { id: "G1", widthCm: 242, xPercent: 25, yPercent: 58 },
    { id: "G2", widthCm: 198, xPercent: 68, yPercent: 58 }
]
};

const server = http.createServer((req, res) => {
    // Return sample parking analysis when this URL is requested.
    if (req.method === "GET" && req.url === "/api/parking/latest") {
        res.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8"
        });
        res.end(JSON.stringify(sampleParkingAnalysis));
        return;
    }

    // 1. Build the file path for the website
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, 'public', filePath);

    // 2. Figure out the file type based on its extension
    let extname = path.extname(filePath);
    let contentType = 'text/html';

    if (extname === '.css') contentType = 'text/css';
    if (extname === '.png') contentType = 'image/png';
    if (extname === '.jpg' || extname === '.jpeg') contentType = 'image/jpeg';
    if (extname === '.svg') contentType = 'image/svg+xml';
    if (extname === '.js') contentType = 'text/javascript';
    if (extname === '.webmanifest') contentType = 'application/manifest+json';

    // 3. Read and send the website file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log('Server running on http://localhost:' + PORT);
});