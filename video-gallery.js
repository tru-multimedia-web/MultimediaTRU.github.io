// ================================================================
// VIDEO GALLERY - SIMPLE & WORKING VERSION
// ================================================================

console.log('🎬 Video Gallery Script Loading...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Ready - Initializing Video Gallery');
    initVideoGallery();
});

function initVideoGallery() {
    // Get all elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const videoItems = document.querySelectorAll('.video-item');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    console.log('📊 Elements Found:');
    console.log('   - Filter Buttons:', filterButtons.length);
    console.log('   - Video Items:', videoItems.length);
    console.log('   - Load More Button:', loadMoreBtn ? 'Yes' : 'No');
    
    // Check if elements exist
    if (filterButtons.length === 0) {
        console.error('❌ No filter buttons found!');
        return;
    }
    
    if (videoItems.length === 0) {
        console.error('❌ No video items found!');
        return;
    }
    
    // Add click events to each filter button
    filterButtons.forEach((button, index) => {
        const category = button.getAttribute('data-category');
        const buttonText = button.textContent.trim();
        
        console.log(`🔘 Button ${index + 1}: "${buttonText}" (${category})`);
        
        // Add click event
        button.addEventListener('click', function(event) {
            event.preventDefault();
            
            console.log(`🎯 CLICKED: "${buttonText}" (${category})`);
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            console.log('✅ Button state updated');
            
            // Filter the videos
            filterVideos(category);
        });
    });
    
    // Setup load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            console.log('📺 Load More clicked');
            showAllVideos();
        });
    }
    
    // Show initial videos (first 6)
    showInitialVideos();
    
    // Setup working video reset
    setupWorkingVideoReset();
    
    console.log('🎉 Video Gallery Successfully Initialized!');
}

function filterVideos(category) {
    console.log(`🎬 Filtering videos for: "${category}"`);
    
    const videoItems = document.querySelectorAll('.video-item');
    let shownCount = 0;
    let hiddenCount = 0;
    
    // Show/hide videos based on category
    videoItems.forEach((item, index) => {
        const itemCategory = item.getAttribute('data-category');
        const videoTitle = item.querySelector('h4')?.textContent || 'Untitled';
        
        if (category === 'all' || itemCategory === category) {
            // Show this video
            item.style.display = 'block';
            item.style.opacity = '1';
            shownCount++;
            console.log(`   ✅ Show: ${videoTitle} (${itemCategory})`);
        } else {
            // Hide this video
            item.style.display = 'none';
            hiddenCount++;
            console.log(`   ❌ Hide: ${videoTitle} (${itemCategory})`);
        }
    });
    
    console.log(`📊 Filter Results: ${shownCount} shown, ${hiddenCount} hidden`);
    
    // Update load more button
    updateLoadMoreButton(category);
}

function showInitialVideos() {
    console.log('🎬 Setting up initial video display...');
    
    const videoItems = document.querySelectorAll('.video-item');
    
    videoItems.forEach((item, index) => {
        if (index < 6) {
            item.style.display = 'block';
            console.log(`   ✅ Initially showing video ${index + 1}`);
        } else {
            item.style.display = 'none';
            console.log(`   ⏸️ Initially hiding video ${index + 1}`);
        }
    });
    
    updateLoadMoreButton('all');
}

function showAllVideos() {
    console.log('📺 Showing all filtered videos...');
    
    const videoItems = document.querySelectorAll('.video-item');
    const activeButton = document.querySelector('.filter-btn.active');
    const category = activeButton ? activeButton.getAttribute('data-category') : 'all';
    
    let revealedCount = 0;
    
    videoItems.forEach((item, index) => {
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
            revealedCount++;
            console.log(`   📹 Revealed video ${index + 1}`);
        }
    });
    
    console.log(`📊 Total revealed: ${revealedCount}`);
    
    // Hide the load more button
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
        console.log('🔘 Load More button hidden');
    }
}

function updateLoadMoreButton(category) {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (!loadMoreBtn) return;
    
    const videoItems = document.querySelectorAll('.video-item');
    let totalInCategory = 0;
    let currentlyVisible = 0;
    
    videoItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || itemCategory === category) {
            totalInCategory++;
            if (item.style.display !== 'none') {
                currentlyVisible++;
            }
        }
    });
    
    console.log(`🔘 Load More: ${currentlyVisible}/${totalInCategory} visible`);
    
    if (totalInCategory > 6 && currentlyVisible < totalInCategory) {
        loadMoreBtn.style.display = 'block';
        console.log('   ✅ Load More button shown');
    } else {
        loadMoreBtn.style.display = 'none';
        console.log('   ❌ Load More button hidden');
    }
}

// Add smooth transitions with CSS
const style = document.createElement('style');
style.textContent = `
    .video-item {
        transition: all 0.3s ease;
        opacity: 1;
        transform: scale(1);
    }
    
    .video-item[style*="display: none"] {
        opacity: 0;
        transform: scale(0.95);
    }
    
    .filter-btn {
        transition: all 0.2s ease;
        cursor: pointer;
        position: relative;
        user-select: none;
    }
    
    .filter-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .filter-btn.active {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.25);
    }
    
    .filter-btn:active {
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

console.log('🎨 CSS transitions added');

// ================================================================
// WORKING VIDEO RESET SYSTEM
// ================================================================

function setupWorkingVideoReset() {
    console.log('🔄 Setting up WORKING video reset system...');
    
    // Load YouTube IFrame API
    if (!window.YT) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.head.appendChild(script);
        
        window.onYouTubeIframeAPIReady = initAllVideoResets;
    } else {
        initAllVideoResets();
    }
    
    // Also setup message-based fallback
    setupMessageFallback();
}

function initAllVideoResets() {
    console.log('📺 YouTube API ready - setting up video resets...');
    
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach((container, index) => {
        const iframe = container.querySelector('iframe');
        if (iframe) {
            // Get video ID from URL
            const videoId = extractVideoId(iframe.src);
            const playerId = `player-${index}-${Date.now()}`;
            
            console.log(`🎬 Setting up video ${index + 1}: ${videoId}`);
            
            // Replace iframe with div for YouTube player
            const playerDiv = document.createElement('div');
            playerDiv.id = playerId;
            playerDiv.style.width = '100%';
            playerDiv.style.height = '100%';
            
            // Store original iframe attributes
            const originalSrc = iframe.src;
            
            // Replace iframe with player div
            iframe.parentNode.replaceChild(playerDiv, iframe);
            
            // Create YouTube player
            setTimeout(() => {
                createYouTubePlayer(playerId, videoId, originalSrc, index, container);
            }, 100 * index); // Stagger creation to avoid conflicts
        }
    });
}

function extractVideoId(url) {
    const match = url.match(/embed\/([^?&\/]+)/);
    return match ? match[1] : null;
}

function createYouTubePlayer(playerId, videoId, originalSrc, index, container) {
    try {
        const player = new YT.Player(playerId, {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
                rel: 0,
                modestbranding: 1,
                controls: 1,
                fs: 1,
                cc_load_policy: 0,
                iv_load_policy: 3,
                autoplay: 0
            },
            events: {
                onReady: function(event) {
                    console.log(`✅ Player ${index + 1} ready - Shows thumbnail, click to play! 🎬`);
                    // Ensure video is cued (shows thumbnail) not auto-playing
                    player.cueVideoById(videoId);
                    addResetIndicator(container, index);
                },
                onStateChange: function(event) {
                    handleStateChange(event, player, videoId, index, container);
                }
            }
        });
        
        // Store player reference
        container._player = player;
        container._videoId = videoId;
        container._index = index;
        
    } catch (error) {
        console.error(`❌ Failed to create player ${index + 1}:`, error);
    }
}

function handleStateChange(event, player, videoId, index, container) {
    const state = event.data;
    console.log(`📹 Video ${index + 1} state:`, getStateName(state));
    
    // When video starts playing, monitor for end
    if (state === YT.PlayerState.PLAYING) {
        monitorVideoEnd(player, videoId, index, container);
    }
    
    // If video ends (backup)
    if (state === YT.PlayerState.ENDED) {
        console.log(`🔄 Video ${index + 1} ended - resetting...`);
        resetVideo(player, videoId, index);
    }
}

function monitorVideoEnd(player, videoId, index, container) {
    const monitor = setInterval(() => {
        try {
            const duration = player.getDuration();
            const currentTime = player.getCurrentTime();
            
            if (duration > 0 && currentTime > 0) {
                const timeLeft = duration - currentTime;
                
                // Reset 0.5 seconds before end
                if (timeLeft <= 0.5 && timeLeft > 0) {
                    clearInterval(monitor);
                    console.log(`🔄 Video ${index + 1} resetting before end (${timeLeft.toFixed(2)}s left)`);
                    resetVideo(player, videoId, index);
                }
            }
        } catch (error) {
            // Player might not be ready
        }
    }, 200); // Check every 200ms
    
    // Clear monitor after 10 minutes
    setTimeout(() => clearInterval(monitor), 600000);
}

function resetVideo(player, videoId, index) {
    try {
        // Stop the video
        player.stopVideo();
        
        // Reset to thumbnail without auto-play
        setTimeout(() => {
            // Use cueVideoById instead of loadVideoById to prevent auto-play
            player.cueVideoById(videoId);
            console.log(`✅ Video ${index + 1} reset to thumbnail - Click to play again! 🎬`);
        }, 100);
        
    } catch (error) {
        console.error(`❌ Reset failed for video ${index + 1}:`, error);
    }
}

function addResetIndicator(container, index) {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
        position: absolute;
        top: 8px;
        left: 8px;
        width: 8px;
        height: 8px;
        background: #00ff00;
        border-radius: 50%;
        z-index: 100;
        box-shadow: 0 0 4px rgba(0, 255, 0, 0.8);
    `;
    indicator.title = `Auto-reset active (Video ${index + 1})`;
    
    container.style.position = 'relative';
    container.appendChild(indicator);
}

function setupMessageFallback() {
    // Simple message-based fallback for browsers that don't support YouTube API
    window.addEventListener('message', function(event) {
        if (typeof event.data === 'string' && event.data.includes('ended')) {
            console.log('🔄 Message-based reset triggered');
            // Find and reset all players
            document.querySelectorAll('.video-container').forEach((container, index) => {
                if (container._player) {
                    resetVideo(container._player, container._videoId, index);
                }
            });
        }
    });
}

function getStateName(state) {
    const states = {
        [-1]: 'unstarted',
        [0]: 'ended',
        [1]: 'playing',
        [2]: 'paused',
        [3]: 'buffering',
        [5]: 'cued'
    };
    return states[state] || 'unknown';
}

// Test function to verify everything works
function testVideoGallery() {
    console.log('🧪 Testing Video Gallery...');
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const videoItems = document.querySelectorAll('.video-item');
    
    console.log('Available categories:');
    filterButtons.forEach(btn => {
        console.log(`   - ${btn.textContent.trim()} (${btn.getAttribute('data-category')})`);
    });
    
    console.log('Videos by category:');
    const categories = {};
    videoItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (!categories[cat]) categories[cat] = 0;
        categories[cat]++;
    });
    
    Object.keys(categories).forEach(cat => {
        console.log(`   - ${cat}: ${categories[cat]} videos`);
    });
    
    console.log('✅ Test completed');
}

// Auto-run test after initialization
setTimeout(() => {
    testVideoGallery();
}, 1000);

// Global test functions
window.testVideoResetSystem = function() {
    console.log('🧪 Testing video reset system...');
    const containers = document.querySelectorAll('.video-container');
    const indicators = document.querySelectorAll('div[style*="background: #00ff00"]');
    
    console.log(`📊 System Status:`);
    console.log(`   - Video containers: ${containers.length}`);
    console.log(`   - Reset indicators: ${indicators.length}`);
    console.log(`   - YouTube API loaded: ${!!window.YT}`);
    console.log(`   - Reset behavior: Manual play after reset 🎬`);
    
    containers.forEach((container, index) => {
        const hasPlayer = !!container._player;
        const videoId = container._videoId;
        const state = hasPlayer ? getPlayerState(container._player) : 'N/A';
        console.log(`   Video ${index + 1}: ${hasPlayer ? '✅' : '❌'} Player ready, ID: ${videoId || 'N/A'}, State: ${state}`);
    });
};

function getPlayerState(player) {
    try {
        const state = player.getPlayerState();
        const states = {
            [-1]: 'unstarted',
            [0]: 'ended',
            [1]: 'playing', 
            [2]: 'paused',
            [3]: 'buffering',
            [5]: 'cued (ready to play)'
        };
        return states[state] || `unknown(${state})`;
    } catch (e) {
        return 'error';
    }
}

window.resetAllVideosNow = function() {
    console.log('🔄 Resetting all videos to thumbnails (manual play required)...');
    document.querySelectorAll('.video-container').forEach((container, index) => {
        if (container._player && container._videoId) {
            resetVideo(container._player, container._videoId, index);
        }
    });
    console.log('✅ All videos reset - Click on any video to start playing! 🎬');
};