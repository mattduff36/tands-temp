const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Load environment variables from .env.local
if (fs.existsSync('.env.local')) {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const envLines = envFile.split('\n');
    envLines.forEach(line => {
        if (line.includes('=')) {
            const [key, value] = line.split('=');
            process.env[key.trim()] = value.trim();
        }
    });
}

// Import the API function
const contactHandler = require('./api/contact');

const PORT = 3000;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml'
};

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    console.log(`${req.method} ${pathname}`);

    // Handle API routes
    if (pathname.startsWith('/api/')) {
        if (pathname === '/api/contact') {
            try {
                // Create a response object that mimics Vercel's response
                const mockRes = {
                    statusCode: 200,
                    headers: {},
                    status: function(code) {
                        this.statusCode = code;
                        return this;
                    },
                    setHeader: function(name, value) {
                        this.headers[name] = value;
                        return this;
                    },
                    json: function(data) {
                        this.headers['Content-Type'] = 'application/json';
                        res.writeHead(this.statusCode, this.headers);
                        res.end(JSON.stringify(data));
                    },
                    end: function() {
                        res.writeHead(this.statusCode, this.headers);
                        res.end();
                    }
                };

                // Parse request body for POST requests
                if (req.method === 'POST') {
                    let body = '';
                    req.on('data', chunk => {
                        body += chunk.toString();
                    });
                    req.on('end', async () => {
                        try {
                            req.body = JSON.parse(body);
                            await contactHandler(req, mockRes);
                        } catch (error) {
                            console.error('Error parsing request body:', error);
                            res.writeHead(400, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify({message: 'Invalid JSON'}));
                        }
                    });
                } else {
                    await contactHandler(req, mockRes);
                }
            } catch (error) {
                console.error('API Error:', error);
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'Internal server error'}));
            }
            return;
        }
    }

    // Handle static files
    let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath);
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error reading file');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    } else {
        res.writeHead(404);
        res.end('File not found');
    }
});

server.listen(PORT, () => {
    console.log(`Local development server running at:`);
    console.log(`  http://localhost:${PORT}`);
    console.log(`  http://127.0.0.1:${PORT}`);
    console.log(`\nPress Ctrl+C to stop the server`);
    
    // Try to open browser (Windows)
    const { exec } = require('child_process');
    exec(`start http://localhost:${PORT}`, (err) => {
        if (err) {
            console.log('Could not open browser automatically');
        }
    });
}); 