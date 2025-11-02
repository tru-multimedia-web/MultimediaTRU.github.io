// ================================================================
// VIDEO GALLERY FIX - แก้ไขปัญหาการแสดงวิดีโอ YouTube
// ================================================================

console.log('🛠️ Video Gallery Fix Loading...');

// Configuration
const VIDEO_CONFIG = {
    storageKey: 'multimedia_videos',
    updateSignalKey: 'video_gallery_updated',
    retryAttempts: 3,
    retryDelay: 1000
};

// Enhanced video loader with error handling
class VideoGalleryManager {
    constructor() {
        this.isLoading = false;
        this.loadAttempts = 0;
        this.videoGrid = null;
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }
    
    initialize() {
        console.log('🚀 Initializing Video Gallery Manager');
        this.videoGrid = document.querySelector('.video-grid');
        
        if (!this.videoGrid) {
            console.error('❌ Video grid container not found');
            return;
        }
        
        console.log('✅ Video grid found, starting video loading process');
        
        // Load videos with retry mechanism
        this.loadVideosWithRetry();
        
        // Set up storage listeners
        this.setupStorageListeners();
        
        // Set up periodic checking
        this.setupPeriodicCheck();
    }
    
    async loadVideosWithRetry() {
        if (this.isLoading) {
            console.log('⏳ Video loading already in progress');
            return;
        }
        
        this.isLoading = true;
        this.loadAttempts++;
        
        console.log(`🔄 Loading videos (attempt ${this.loadAttempts})`);
        
        try {
            const success = await this.loadVideos();
            if (success) {
                console.log('✅ Videos loaded successfully');
                this.loadAttempts = 0;
            } else if (this.loadAttempts < VIDEO_CONFIG.retryAttempts) {
                console.log(`⚠️ Loading failed, retrying in ${VIDEO_CONFIG.retryDelay}ms...`);
                setTimeout(() => {
                    this.isLoading = false;
                    this.loadVideosWithRetry();
                }, VIDEO_CONFIG.retryDelay);
                return;
            } else {
                console.log('❌ Max retry attempts reached, keeping default videos');
            }
        } catch (error) {
            console.error('❌ Error during video loading:', error);
        }
        
        this.isLoading = false;
    }
    
    async loadVideos() {
        const stored = localStorage.getItem(VIDEO_CONFIG.storageKey);
        
        if (!stored) {
            console.log('📚 No admin videos found, keeping default videos');
            return true; // Not an error, just no custom videos
        }
        
        let videos;
        try {
            videos = JSON.parse(stored);
            console.log(`📚 Found ${videos.length} videos in localStorage`);
        } catch (error) {
            console.error('❌ Error parsing video data:', error);
            return false;
        }
        
        if (!Array.isArray(videos) || videos.length === 0) {
            console.log('📚 Video list is empty, keeping default videos');
            return true;
        }
        
        // Validate and clean video data
        const validVideos = this.validateVideos(videos);
        if (validVideos.length === 0) {
            console.log('⚠️ No valid videos found, keeping default videos');
            return true;
        }
        
        // Generate and inject video HTML
        try {
            const videoHTML = this.generateVideoHTML(validVideos);
            this.videoGrid.innerHTML = videoHTML;
            
            console.log(`🎬 Successfully loaded ${validVideos.length} videos`);
            
            // Reinitialize gallery functionality
            await this.reinitializeGallery();
            
            return true;
        } catch (error) {
            console.error('❌ Error generating video HTML:', error);
            return false;
        }
    }
    
    validateVideos(videos) {
        return videos.filter((video, index) => {
            // Check required fields
            if (!video.title) {
                console.warn(`⚠️ Video ${index + 1}: Missing title`);
                return false;
            }
            
            if (!video.videoId && !video.url) {
                console.warn(`⚠️ Video ${index + 1}: Missing videoId and url`);
                return false;
            }
            
            // Extract and validate video ID
            const videoId = this.extractVideoId(video.videoId || video.url);
            if (!videoId || videoId.length !== 11) {
                console.warn(`⚠️ Video ${index + 1}: Invalid video ID: ${videoId}`);
                return false;
            }
            
            // Set extracted video ID
            video.videoId = videoId;
            
            console.log(`✅ Video ${index + 1}: ${video.title} (${videoId})`);
            return true;
        });
    }
    
    extractVideoId(input) {
        if (!input) return '';
        
        // If it's already a valid 11-character ID
        if (typeof input === 'string' && input.length === 11 && /^[a-zA-Z0-9_-]+$/.test(input)) {
            return input;
        }
        
        // Extract from various YouTube URL formats
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
            /^([a-zA-Z0-9_-]{11})$/
        ];
        
        for (const pattern of patterns) {
            const match = String(input).match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        console.warn(`⚠️ Could not extract valid video ID from: ${input}`);
        return '';
    }
    
    generateVideoHTML(videos) {
        return videos.map(video => {
            const videoId = video.videoId;
            const category = video.category || 'animation';
            const title = this.escapeHtml(video.title || 'ไม่มีชื่อเรื่อง');
            const description = this.escapeHtml(video.description || 'ไม่มีคำอธิบาย');
            const studentName = this.escapeHtml(video.studentName || 'ไม่ระบุชื่อ');
            
            return `
            <div class="video-item" data-category="${category}">
                <div class="video-container">
                    <iframe 
                        src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&fs=1&cc_load_policy=0&iv_load_policy=3" 
                        frameborder="0" 
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowfullscreen
                        loading="lazy"
                        width="100%"
                        height="315"
                        title="${title}">
                    </iframe>
                </div>
                <div class="video-info">
                    <h4>${title}</h4>
                    <p>${description}</p>
                    <span class="student-name">นักศึกษา: ${studentName}</span>
                </div>
            </div>`;
        }).join('\n');
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    async reinitializeGallery() {
        // Wait for DOM to update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Reinitialize video gallery functionality
        if (typeof initVideoGallery === 'function') {
            console.log('🔄 Reinitializing video gallery filters...');
            try {
                initVideoGallery();
            } catch (error) {
                console.warn('⚠️ Error reinitializing video gallery:', error);
            }
        }
        
        // Other initialization functions
        if (typeof setupWorkingVideoReset === 'function') {
            try {
                setupWorkingVideoReset();
            } catch (error) {
                console.warn('⚠️ Error in setupWorkingVideoReset:', error);
            }
        }
    }
    
    setupStorageListeners() {
        // Cross-tab storage changes
        window.addEventListener('storage', (e) => {
            if (e.key === VIDEO_CONFIG.storageKey || e.key === VIDEO_CONFIG.updateSignalKey) {
                console.log('📢 Storage change detected, reloading videos...');
                setTimeout(() => this.loadVideosWithRetry(), 500);
            }
        });
    }
    
    setupPeriodicCheck() {
        let lastUpdateSignal = localStorage.getItem(VIDEO_CONFIG.updateSignalKey);
        
        setInterval(() => {
            const currentSignal = localStorage.getItem(VIDEO_CONFIG.updateSignalKey);
            if (currentSignal && currentSignal !== lastUpdateSignal) {
                lastUpdateSignal = currentSignal;
                console.log('🔄 Update signal detected, reloading videos...');
                this.loadVideosWithRetry();
            }
        }, 3000);
    }
    
    // Public methods
    forceReload() {
        console.log('🔄 Force reloading videos...');
        this.loadAttempts = 0;
        this.loadVideosWithRetry();
    }
    
    getStatus() {
        const stored = localStorage.getItem(VIDEO_CONFIG.storageKey);
        return {
            hasLocalData: !!stored,
            videoCount: stored ? JSON.parse(stored).length : 0,
            isLoading: this.isLoading,
            loadAttempts: this.loadAttempts,
            gridFound: !!this.videoGrid
        };
    }
}

// Create global instance
window.videoGalleryManager = new VideoGalleryManager();

// Global functions for backward compatibility
window.refreshVideoGallery = () => {
    if (window.videoGalleryManager) {
        window.videoGalleryManager.forceReload();
    }
};

window.getVideoGalleryStatus = () => {
    if (window.videoGalleryManager) {
        return window.videoGalleryManager.getStatus();
    }
    return null;
};

console.log('✅ Video Gallery Fix loaded successfully');
console.log('💡 Use refreshVideoGallery() or getVideoGalleryStatus() in console for debugging');