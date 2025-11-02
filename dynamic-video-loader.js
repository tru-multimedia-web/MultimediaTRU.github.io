// ================================================================
// DYNAMIC VIDEO GALLERY LOADER - AUTO UPDATE FROM ADMIN
// ================================================================

console.log('🔄 Dynamic Video Gallery Loading...');

// Storage key (same as admin panel)
const STORAGE_KEY = 'multimedia_videos';

// Category names mapping
const categoryNames = {
    'animation': 'แอนิเมชัน',
    'game': 'เกม',
    'web': 'เว็บไซต์',
    'video': 'วิดีโอ',
    'graphic': 'กราฟิก'
};

// Initialize dynamic video gallery
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Ready - Loading Dynamic Video Gallery');
    loadDynamicVideoGallery();
    
    // Also initialize the original video gallery functionality
    if (typeof initVideoGallery === 'function') {
        initVideoGallery();
    }
});

function loadDynamicVideoGallery() {
    const videoGridContainer = document.querySelector('.video-grid');
    
    if (!videoGridContainer) {
        console.log('❌ Video grid container not found');
        return;
    }
    
    console.log('🔍 Loading dynamic video gallery...');
    
    // Load videos from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    let videos = [];
    
    if (stored) {
        try {
            videos = JSON.parse(stored);
            console.log(`📚 Loaded ${videos.length} videos from admin panel`);
        } catch (error) {
            console.error('❌ Error parsing localStorage data:', error);
            return; // Keep existing videos if there's an error
        }
    } else {
        console.log('📚 No admin videos found, keeping default videos');
        return; // Keep the existing static videos
    }
    
    if (videos.length === 0) {
        console.log('📚 Admin video list is empty, keeping default videos');
        return; // Keep the existing static videos
    }
    
    // Validate videos before loading
    const validVideos = videos.filter(video => {
        if (!video.title || (!video.videoId && !video.url)) {
            console.warn('⚠️ Invalid video found:', video);
            return false;
        }
        return true;
    });
    
    if (validVideos.length === 0) {
        console.log('⚠️ No valid videos found, keeping default videos');
        return;
    }
    
    // Clear existing videos and replace with admin videos
    videoGridContainer.innerHTML = generateVideoHTML(validVideos);
    console.log(`🎬 Dynamic video gallery loaded successfully! (${validVideos.length} videos)`);
    
    // Reinitialize video functionality
    if (typeof initVideoGallery === 'function') {
        console.log('🔄 Reinitializing video gallery functionality...');
        setTimeout(() => {
            initVideoGallery();
        }, 100);
    }
    
    // Trigger any other video setup functions
    if (typeof setupWorkingVideoReset === 'function') {
        setupWorkingVideoReset();
    }
}

function generateVideoHTML(videos) {
    return videos.map(video => {
        // Extract video ID from URL if needed
        let videoId = video.videoId;
        if (video.url && !videoId) {
            videoId = extractVideoIdFromUrl(video.url);
        }
        
        console.log(`🎬 Generating video: ${video.title} - ID: ${videoId}`);
        
        return `
        <div class="video-item" data-category="${video.category || 'animation'}">
            <div class="video-container">
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&fs=1&cc_load_policy=0&iv_load_policy=3" 
                    frameborder="0" 
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen
                    loading="lazy"
                    width="100%"
                    height="315"
                    title="${video.title || 'YouTube Video'}">
                </iframe>
            </div>
            <div class="video-info">
                <h4>${video.title || 'ไม่มีชื่อเรื่อง'}</h4>
                <p>${video.description || 'ไม่มีคำอธิบาย'}</p>
                <span class="student-name">นักศึกษา: ${video.studentName || 'ไม่ระบุชื่อ'}</span>
            </div>
        </div>`;
    }).join('\n');
}

function extractVideoIdFromUrl(url) {
    if (!url) return '';
    
    // If it's already just an ID (11 characters, no special chars)
    if (url.length === 11 && /^[a-zA-Z0-9_-]+$/.test(url)) {
        return url;
    }
    
    // Extract from various YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    
    console.warn(`⚠️ Could not extract video ID from: ${url}`);
    return url; // Return as-is if no pattern matches
}

// Function to refresh video gallery (can be called from admin panel)
function refreshVideoGallery() {
    loadDynamicVideoGallery();
}

// Listen for storage changes (when admin updates videos)
window.addEventListener('storage', function(e) {
    if (e.key === STORAGE_KEY || e.key === 'video_gallery_updated') {
        console.log('📢 Video gallery updated from admin panel');
        setTimeout(() => {
            loadDynamicVideoGallery();
        }, 500); // Small delay to ensure data is saved
    }
});

// Listen for localStorage changes in same tab (fallback)
setInterval(function() {
    const updateSignal = localStorage.getItem('video_gallery_updated');
    if (updateSignal && updateSignal !== window.lastUpdateSignal) {
        window.lastUpdateSignal = updateSignal;
        console.log('🔄 Auto-refreshing video gallery...');
        loadDynamicVideoGallery();
    }
}, 2000); // Check every 2 seconds

// Make function available globally
window.refreshVideoGallery = refreshVideoGallery;