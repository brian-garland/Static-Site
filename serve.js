const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve static files from the static directory
app.use('/static', express.static(path.join(__dirname, 'static')));

// Handle all routes
app.get('*', (req, res) => {
    const urlPath = req.path === '/' ? '/index' : req.path;
    const filePath = path.join(__dirname, 'public', urlPath, 'index.html');
    
    // Check if the file exists
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        // Fallback to index.html for any unmatched routes
        res.sendFile(path.join(__dirname, 'public/index.html'));
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 