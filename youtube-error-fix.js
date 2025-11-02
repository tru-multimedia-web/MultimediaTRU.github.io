// ================================================================
// YOUTUBE ERROR 153 FIX - แก้ไขปัญหาการกำหนดค่าวิดีโอเพลเยอร์
// ================================================================

console.log('🛠️ YouTube Error 153 Fix Loading...');

// YouTube Error 153 เกิดจากการกำหนดค่า iframe ที่ไม่ถูกต้อง
// ปัญหาที่พบบ่อย:
// 1. enablejsapi=1 อาจทำให้เกิดปัญหาใน iframe บางกรณี  
// 2. การใช้ parameters เยอะเกินไปใน URL
// 3. ขนาด iframe ที่ไม่เหมาะสม
// 4. การโหลด iframe ก่อนที่ DOM พร้อม

class YouTubeEmbedFixer {
    constructor() {
        this.fixedEmbedParams = {
            // Basic parameters only to avoid conflicts
            rel: 0,              // Don't show related videos
            modestbranding: 1,   // Remove YouTube logo
            showinfo: 0,         // Don't show video info
            controls: 1,         // Show player controls
            autoplay: 0,         // Don't auto play
            fs: 1,              // Allow fullscreen
            cc_load_policy: 0,  // Don't show captions
            iv_load_policy: 3   // Don't show annotations
        };
        
        this.initialize();
    }
    
    initialize() {
        console.log('🔧 Initializing YouTube Error 153 Fix...');
        
        // Fix existing iframes
        this.fixExistingIframes();
        
        // Set up mutation observer for new iframes
        this.setupMutationObserver();
        
        // Override iframe creation functions
        this.overrideEmbedFunctions();
    }
    
    fixExistingIframes() {
        const iframes = document.querySelectorAll('iframe[src*="youtube.com/embed"]');
        console.log(`🔍 Found ${iframes.length} YouTube iframes to fix`);
        
        iframes.forEach((iframe, index) => {
            try {
                const fixedSrc = this.createFixedEmbedUrl(iframe.src);
                if (fixedSrc !== iframe.src) {
                    console.log(`🔧 Fixing iframe ${index + 1}: ${iframe.src} → ${fixedSrc}`);
                    iframe.src = fixedSrc;
                    
                    // Add proper attributes
                    this.addProperAttributes(iframe);
                }
            } catch (error) {
                console.warn(`⚠️ Error fixing iframe ${index + 1}:`, error);
            }
        });
    }
    
    createFixedEmbedUrl(originalUrl) {
        try {
            // Extract video ID from original URL
            const videoId = this.extractVideoId(originalUrl);
            if (!videoId) {
                console.warn('⚠️ Could not extract video ID from:', originalUrl);
                return originalUrl;
            }
            
            // Create clean embed URL with minimal parameters
            const params = new URLSearchParams(this.fixedEmbedParams);
            const fixedUrl = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
            
            return fixedUrl;
        } catch (error) {
            console.error('❌ Error creating fixed embed URL:', error);
            return originalUrl;
        }
    }
    
    extractVideoId(url) {
        // Extract video ID from various YouTube URL formats
        const patterns = [
            /\/embed\/([a-zA-Z0-9_-]{11})/,
            /[?&]v=([a-zA-Z0-9_-]{11})/,
            /\/([a-zA-Z0-9_-]{11})\?/,
            /\/([a-zA-Z0-9_-]{11})$/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        return null;
    }
    
    addProperAttributes(iframe) {
        // Set proper iframe attributes to prevent Error 153
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('allow', 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        
        // Remove problematic attributes
        iframe.removeAttribute('enablejsapi');
        
        // Set proper loading strategy
        iframe.setAttribute('loading', 'lazy');
        
        // Ensure proper dimensions
        if (!iframe.style.width) {
            iframe.style.width = '100%';
        }
        if (!iframe.style.height && !iframe.getAttribute('height')) {
            iframe.style.height = '315px';
        }
    }
    
    setupMutationObserver() {
        // Watch for new iframes being added to the DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const newIframes = node.querySelectorAll ? 
                            node.querySelectorAll('iframe[src*="youtube.com/embed"]') : 
                            (node.tagName === 'IFRAME' && node.src.includes('youtube.com/embed') ? [node] : []);
                        
                        newIframes.forEach((iframe) => {
                            console.log('🆕 New YouTube iframe detected, applying fix...');
                            const fixedSrc = this.createFixedEmbedUrl(iframe.src);
                            iframe.src = fixedSrc;
                            this.addProperAttributes(iframe);
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👀 Mutation observer set up for new iframes');
    }
    
    overrideEmbedFunctions() {
        // Override global functions that create YouTube embeds
        const originalFunctions = {};
        
        // Store original functions
        if (window.generateVideoHTML) {
            originalFunctions.generateVideoHTML = window.generateVideoHTML;
        }
        
        // Override with fixed versions
        window.generateVideoHTML = (videos) => {
            if (originalFunctions.generateVideoHTML) {
                let html = originalFunctions.generateVideoHTML(videos);
                // Fix the generated HTML
                html = this.fixEmbedHTML(html);
                return html;
            }
            
            // Fallback: generate our own HTML
            return this.generateFixedVideoHTML(videos);
        };
        
        console.log('🔄 Embed functions overridden with Error 153 fixes');
    }
    
    fixEmbedHTML(html) {
        // Fix existing HTML with YouTube embeds
        return html.replace(/src="https:\/\/www\.youtube\.com\/embed\/([^"]+)"/g, (match, embedPath) => {
            const videoId = this.extractVideoId(embedPath);
            if (videoId) {
                const params = new URLSearchParams(this.fixedEmbedParams);
                return `src="https://www.youtube.com/embed/${videoId}?${params.toString()}"`;
            }
            return match;
        });
    }
    
    generateFixedVideoHTML(videos) {
        return videos.map(video => {
            const videoId = video.videoId || this.extractVideoId(video.url);
            const params = new URLSearchParams(this.fixedEmbedParams);
            
            return `
            <div class="video-item" data-category="${video.category || 'animation'}">
                <div class="video-container">
                    <iframe 
                        src="https://www.youtube.com/embed/${videoId}?${params.toString()}" 
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
    
    // Method to manually fix all YouTube iframes
    fixAllIframes() {
        console.log('🔧 Manually fixing all YouTube iframes...');
        this.fixExistingIframes();
    }
    
    // Method to test if Error 153 is fixed
    testErrorFix() {
        const iframes = document.querySelectorAll('iframe[src*="youtube.com/embed"]');
        console.log('🧪 Testing Error 153 fix...');
        console.log(`📊 Found ${iframes.length} YouTube iframes`);
        
        iframes.forEach((iframe, index) => {
            const hasProblematicParams = iframe.src.includes('enablejsapi=1');
            const hasTooManyParams = (iframe.src.match(/[?&]/g) || []).length > 10;
            
            console.log(`📺 Iframe ${index + 1}:`);
            console.log(`   URL: ${iframe.src}`);
            console.log(`   Problematic enablejsapi: ${hasProblematicParams ? '❌' : '✅'}`);
            console.log(`   Too many parameters: ${hasTooManyParams ? '❌' : '✅'}`);
            console.log(`   Dimensions: ${iframe.offsetWidth}x${iframe.offsetHeight}`);
        });
    }
}

// Initialize the fix
const youtubeErrorFixer = new YouTubeEmbedFixer();

// Make functions available globally
window.youtubeErrorFixer = youtubeErrorFixer;
window.fixYouTubeError153 = () => youtubeErrorFixer.fixAllIframes();
window.testYouTubeErrorFix = () => youtubeErrorFixer.testErrorFix();

// Auto-fix on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded, applying YouTube Error 153 fixes...');
    setTimeout(() => {
        youtubeErrorFixer.fixAllIframes();
    }, 1000);
});

// Auto-fix after 3 seconds (for dynamically loaded content)
setTimeout(() => {
    console.log('⏰ Auto-fixing YouTube iframes after delay...');
    youtubeErrorFixer.fixAllIframes();
}, 3000);

console.log('✅ YouTube Error 153 Fix loaded successfully');
console.log('💡 Use fixYouTubeError153() or testYouTubeErrorFix() in console for manual testing');