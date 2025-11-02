// ================================================================
// DEBUG VIDEO LOADER - ตรวจสอบและแก้ไขปัญหาการโหลดวิดีโอ
// ================================================================

console.log('🔍 Starting Video Loader Debug...');

// Storage key
const STORAGE_KEY = 'multimedia_videos';

function debugVideoSystem() {
    console.log('=== DEBUG VIDEO SYSTEM ===');
    
    // 1. ตรวจสอบ localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log('📊 LocalStorage Data:', stored);
    
    if (stored) {
        try {
            const videos = JSON.parse(stored);
            console.log(`✅ Found ${videos.length} videos in localStorage`);
            videos.forEach((video, index) => {
                console.log(`Video ${index + 1}:`, {
                    title: video.title,
                    videoId: video.videoId,
                    category: video.category,
                    url: `https://www.youtube.com/embed/${video.videoId}`
                });
            });
        } catch (error) {
            console.error('❌ Error parsing localStorage data:', error);
        }
    } else {
        console.log('⚠️ No videos found in localStorage');
    }
    
    // 2. ตรวจสอบ video grid container
    const videoGrid = document.querySelector('.video-grid');
    console.log('📺 Video Grid Container:', videoGrid);
    if (videoGrid) {
        console.log('✅ Video grid found');
        console.log('Current HTML length:', videoGrid.innerHTML.length);
        console.log('Current video items:', videoGrid.querySelectorAll('.video-item').length);
    } else {
        console.log('❌ Video grid container not found');
    }
    
    // 3. ตรวจสอบ iframe elements
    const iframes = document.querySelectorAll('.video-container iframe');
    console.log(`🎬 Found ${iframes.length} iframe elements`);
    
    iframes.forEach((iframe, index) => {
        console.log(`Iframe ${index + 1}:`, {
            src: iframe.src,
            loading: iframe.loading,
            width: iframe.offsetWidth,
            height: iframe.offsetHeight
        });
    });
}

function forceLoadVideos() {
    console.log('🚀 Force loading videos...');
    
    const videoGrid = document.querySelector('.video-grid');
    if (!videoGrid) {
        console.error('❌ Video grid not found');
        return;
    }
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        console.log('⚠️ No videos in localStorage - keeping default videos');
        return;
    }
    
    try {
        const videos = JSON.parse(stored);
        console.log(`📚 Loading ${videos.length} videos...`);
        
        // Generate HTML
        const html = videos.map(video => {
            const videoId = extractVideoId(video.url || video.videoId);
            return `
            <div class="video-item" data-category="${video.category}">
                <div class="video-container">
                    <iframe 
                        src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&fs=1&cc_load_policy=0&iv_load_policy=3" 
                        frameborder="0" 
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowfullscreen
                        loading="lazy"
                        width="100%"
                        height="315"
                        title="Debug Test Video">
                    </iframe>
                </div>
                <div class="video-info">
                    <h4>${video.title || 'ไม่มีชื่อ'}</h4>
                    <p>${video.description || 'ไม่มีคำอธิบาย'}</p>
                    <span class="student-name">นักศึกษา: ${video.studentName || 'ไม่ระบุชื่อ'}</span>
                </div>
            </div>`;
        }).join('\n');
        
        videoGrid.innerHTML = html;
        console.log('✅ Videos loaded successfully!');
        
        // Re-initialize video filters
        if (typeof initVideoGallery === 'function') {
            initVideoGallery();
        }
        
    } catch (error) {
        console.error('❌ Error loading videos:', error);
    }
}

function extractVideoId(url) {
    if (!url) return '';
    
    // If it's already just an ID
    if (url.length === 11 && !url.includes('/')) {
        return url;
    }
    
    // Extract from various YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return match[1];
        }
    }
    
    return url; // Return as-is if no pattern matches
}

function clearVideoStorage() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('video_gallery_updated');
    console.log('🗑️ Video storage cleared');
}

function addTestVideo() {
    const testVideo = {
        title: 'วิดีโอทดสอบ',
        description: 'วิดีโอทดสอบจากระบบ Debug',
        studentName: 'ระบบทดสอบ',
        category: 'animation',
        videoId: 'aqCBD2qg7b8', // Sample video ID
        url: 'https://www.youtube.com/watch?v=aqCBD2qg7b8'
    };
    
    let videos = [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        videos = JSON.parse(stored);
    }
    
    videos.push(testVideo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
    localStorage.setItem('video_gallery_updated', Date.now().toString());
    
    console.log('✅ Test video added');
    forceLoadVideos();
}

// Make functions available globally for console debugging
window.debugVideoSystem = debugVideoSystem;
window.forceLoadVideos = forceLoadVideos;
window.clearVideoStorage = clearVideoStorage;
window.addTestVideo = addTestVideo;

// Auto-run debug on load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        debugVideoSystem();
    }, 1000);
});

console.log('🛠️ Debug functions loaded. Use in console:');
console.log('- debugVideoSystem() - ตรวจสอบสถานะระบบ');
console.log('- forceLoadVideos() - บังคับโหลดวิดีโอใหม่');
console.log('- addTestVideo() - เพิ่มวิดีโอทดสอบ');
console.log('- clearVideoStorage() - ลบข้อมูลวิดีโอ');