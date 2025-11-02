// ================================================================
// AUTO-FIX ALL YOUTUBE EMBEDS - แก้ไข iframe YouTube ทั้งหมดอัตโนมัติ
// ================================================================

console.log('🔧 Auto-fixing all YouTube embeds...');

// Function to fix YouTube embed URLs
function fixYouTubeEmbedUrl(originalUrl) {
    // Extract video ID
    const videoIdMatch = originalUrl.match(/embed\/([a-zA-Z0-9_-]{11})/);
    if (!videoIdMatch) {
        console.warn('Could not extract video ID from:', originalUrl);
        return originalUrl;
    }
    
    const videoId = videoIdMatch[1];
    
    // Create fixed URL with safe parameters
    const safeParams = [
        'rel=0',                    // Don't show related videos
        'modestbranding=1',         // Remove YouTube logo
        'controls=1',               // Show player controls
        'fs=1',                     // Allow fullscreen
        'cc_load_policy=0',         // Don't show captions by default
        'iv_load_policy=3'          // Don't show annotations
    ];
    
    return `https://www.youtube.com/embed/${videoId}?${safeParams.join('&')}`;
}

// Function to fix individual iframe
function fixIframe(iframe, index) {
    const originalSrc = iframe.src;
    
    if (!originalSrc.includes('youtube.com/embed')) {
        return false;
    }
    
    // Check if already has safe parameters
    if (originalSrc.includes('controls=1') && !originalSrc.includes('enablejsapi=1')) {
        console.log(`✅ Iframe ${index + 1} already fixed`);
        return false;
    }
    
    const fixedSrc = fixYouTubeEmbedUrl(originalSrc);
    
    if (fixedSrc !== originalSrc) {
        console.log(`🔧 Fixing iframe ${index + 1}:`);
        console.log(`   From: ${originalSrc}`);
        console.log(`   To: ${fixedSrc}`);
        
        iframe.src = fixedSrc;
        
        // Add proper attributes
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('allow', 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('loading', 'lazy');
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('height', '315');
        
        // Remove problematic attributes
        iframe.removeAttribute('enablejsapi');
        
        return true;
    }
    
    return false;
}

// Main function to fix all iframes
function fixAllYouTubeIframes() {
    const iframes = document.querySelectorAll('iframe[src*="youtube.com/embed"]');
    let fixedCount = 0;
    
    console.log(`🔍 Found ${iframes.length} YouTube iframes`);
    
    iframes.forEach((iframe, index) => {
        if (fixIframe(iframe, index)) {
            fixedCount++;
        }
    });
    
    console.log(`✅ Fixed ${fixedCount} out of ${iframes.length} iframes`);
    
    return {
        total: iframes.length,
        fixed: fixedCount
    };
}

// Function to check for Error 153 issues
function checkForError153Issues() {
    const iframes = document.querySelectorAll('iframe[src*="youtube.com/embed"]');
    const issues = [];
    
    iframes.forEach((iframe, index) => {
        const src = iframe.src;
        const problems = [];
        
        if (src.includes('enablejsapi=1')) {
            problems.push('enablejsapi=1 parameter (can cause Error 153)');
        }
        
        if (src.includes('autoplay=1')) {
            problems.push('autoplay=1 parameter (can cause playback issues)');
        }
        
        if ((src.match(/[?&]/g) || []).length > 8) {
            problems.push('Too many URL parameters');
        }
        
        if (!iframe.hasAttribute('title')) {
            problems.push('Missing title attribute');
        }
        
        if (problems.length > 0) {
            issues.push({
                index: index + 1,
                src: src,
                problems: problems
            });
        }
    });
    
    return issues;
}

// Auto-run when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            console.log('📄 DOM loaded, checking for YouTube Error 153 issues...');
            const issues = checkForError153Issues();
            
            if (issues.length > 0) {
                console.log(`⚠️ Found ${issues.length} potential Error 153 issues:`);
                issues.forEach(issue => {
                    console.log(`   Iframe ${issue.index}: ${issue.problems.join(', ')}`);
                });
                
                console.log('🔧 Applying automatic fixes...');
                const result = fixAllYouTubeIframes();
                
                if (result.fixed > 0) {
                    console.log(`✅ Successfully fixed ${result.fixed} iframes!`);
                    console.log('🎬 YouTube Error 153 should now be resolved');
                } else {
                    console.log('ℹ️ No fixes were needed or possible');
                }
            } else {
                console.log('✅ No YouTube Error 153 issues detected');
            }
        }, 1000);
    });
} else {
    // DOM already loaded
    setTimeout(() => {
        console.log('📄 Checking for YouTube Error 153 issues...');
        const issues = checkForError153Issues();
        
        if (issues.length > 0) {
            console.log(`⚠️ Found ${issues.length} potential Error 153 issues, applying fixes...`);
            const result = fixAllYouTubeIframes();
            
            if (result.fixed > 0) {
                console.log(`✅ Successfully fixed ${result.fixed} iframes!`);
            }
        } else {
            console.log('✅ No YouTube Error 153 issues detected');
        }
    }, 500);
}

// Make functions available globally for manual use
window.fixAllYouTubeIframes = fixAllYouTubeIframes;
window.checkForError153Issues = checkForError153Issues;

console.log('🛠️ YouTube Error 153 Auto-Fix loaded');
console.log('💡 Use fixAllYouTubeIframes() in console to manually fix all iframes');