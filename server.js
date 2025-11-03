const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'videos.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Helper function to read videos from JSON file
async function readVideos() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or is empty, return empty array
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

// Helper function to write videos to JSON file
async function writeVideos(videos) {
    try {
        // Ensure data directory exists
        const dataDir = path.dirname(DATA_FILE);
        await fs.mkdir(dataDir, { recursive: true });
        
        // Write with pretty formatting
        await fs.writeFile(DATA_FILE, JSON.stringify(videos, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing videos:', error);
        throw error;
    }
}

// API Routes

// GET /api/videos - Get all videos
app.get('/api/videos', async (req, res) => {
    try {
        const videos = await readVideos();
        res.json(videos);
    } catch (error) {
        console.error('Error reading videos:', error);
        res.status(500).json({ error: 'Failed to read videos' });
    }
});

// POST /api/videos - Save all videos (replaces entire array)
app.post('/api/videos', async (req, res) => {
    try {
        const videos = req.body;
        
        // Validate that it's an array
        if (!Array.isArray(videos)) {
            return res.status(400).json({ error: 'Videos must be an array' });
        }
        
        await writeVideos(videos);
        res.json({ success: true, message: 'Videos saved successfully', count: videos.length });
    } catch (error) {
        console.error('Error saving videos:', error);
        res.status(500).json({ error: 'Failed to save videos' });
    }
});

// POST /api/videos/add - Add a single video
app.post('/api/videos/add', async (req, res) => {
    try {
        const newVideo = req.body;
        const videos = await readVideos();
        
        videos.push(newVideo);
        await writeVideos(videos);
        
        res.json({ success: true, message: 'Video added successfully', video: newVideo });
    } catch (error) {
        console.error('Error adding video:', error);
        res.status(500).json({ error: 'Failed to add video' });
    }
});

// DELETE /api/videos/:id - Delete a video by ID
app.delete('/api/videos/:id', async (req, res) => {
    try {
        const videoId = req.params.id;
        let videos = await readVideos();
        
        const initialLength = videos.length;
        videos = videos.filter(v => v.id !== videoId);
        
        if (videos.length === initialLength) {
            return res.status(404).json({ error: 'Video not found' });
        }
        
        await writeVideos(videos);
        res.json({ success: true, message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ error: 'Failed to delete video' });
    }
});

// PUT /api/videos/:id - Update a video by ID
app.put('/api/videos/:id', async (req, res) => {
    try {
        const videoId = req.params.id;
        const updatedVideo = req.body;
        let videos = await readVideos();
        
        const index = videos.findIndex(v => v.id === videoId);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Video not found' });
        }
        
        videos[index] = { ...videos[index], ...updatedVideo };
        await writeVideos(videos);
        
        res.json({ success: true, message: 'Video updated successfully', video: videos[index] });
    } catch (error) {
        console.error('Error updating video:', error);
        res.status(500).json({ error: 'Failed to update video' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📁 Data file: ${DATA_FILE}`);
    console.log(`🔗 API endpoints:`);
    console.log(`   GET    /api/videos       - Get all videos`);
    console.log(`   POST   /api/videos       - Save all videos`);
    console.log(`   POST   /api/videos/add   - Add a single video`);
    console.log(`   PUT    /api/videos/:id   - Update a video`);
    console.log(`   DELETE /api/videos/:id   - Delete a video`);
});
