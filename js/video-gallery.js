document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 Video Gallery Loading...');
    
    const videoGrid = document.querySelector('.video-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.querySelector('.load-more-btn');

    console.log('Elements found:', {
        videoGrid: !!videoGrid,
        filterButtons: filterButtons.length,
        loadMoreBtn: !!loadMoreBtn
    });

    if (!videoGrid || !filterButtons.length || !loadMoreBtn) {
        console.error('Error: Required elements missing');
        if(videoGrid) {
            videoGrid.innerHTML = '<p class="no-videos-message">เกิดข้อผิดพลาดในการโหลด</p>';
        }
        return;
    }

    let visibleItems = 9;
    let allVideos = [];

    function createVideoCard(video, originalIndex) {
        const videoCard = document.createElement('a');
        videoCard.href = 'player.html?videoIndex=' + originalIndex;
        videoCard.className = 'video-item';
        videoCard.dataset.category = video.category.toLowerCase();

        // Google Drive format only
        const thumbnailUrl = video.url.replace("/view", "/preview");
        
        videoCard.innerHTML = `
            <div class="video-container">
                <iframe src="${thumbnailUrl}" frameborder="0" scrolling="no" allowfullscreen></iframe>
            </div>
            <div class="video-info">
                <h4>${video.title}</h4>
                <p>${video.description}</p>
                <span class="student-name">โดย: ${video.studentName}</span>
            </div>
        `;
        
        return videoCard;
    }

    function renderVideos(filter) {
        if (!filter) filter = 'all';
        videoGrid.innerHTML = '';
        
        const filteredVideos = filter === 'all' ? allVideos : allVideos.filter(function(video) {
            return video.category.toLowerCase() === filter;
        });

        if (filteredVideos.length === 0) {
            videoGrid.innerHTML = '<p class="no-videos-message">ยังไม่มีผลงานในหมวดหมู่นี้</p>';
            loadMoreBtn.style.display = 'none';
        } else {
            const videosToRender = filteredVideos.slice(0, visibleItems);
            
            videosToRender.forEach(function(video) {
                const originalIndex = allVideos.findIndex(function(v) {
                    return v.url === video.url && v.title === video.title;
                });
                if (originalIndex !== -1) {
                    const videoCard = createVideoCard(video, originalIndex);
                    videoGrid.appendChild(videoCard);
                }
            });

            if (visibleItems >= filteredVideos.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'block';
            }
        }
    }
    
    function initialize() {
        try {
            allVideos = JSON.parse(localStorage.getItem('multimedia_videos')) || [];
            console.log('📹 Loaded videos:', allVideos.length);
        } catch (e) {
            console.error('Error loading videos:', e);
            allVideos = [];
        }
        
        if (allVideos.length === 0) {
            console.warn('⚠️ No videos found in localStorage');
            videoGrid.innerHTML = '<p class="no-videos-message">ยังไม่มีผลงานที่เพิ่มเข้ามา<br>กรุณาไปที่หน้า <a href="admin/" style="color: #e74c3c;">Admin Panel</a> เพื่อเพิ่มวิดีโอ</p>';
            loadMoreBtn.style.display = 'none';
            return;
        }
        
        renderVideos();

        filterButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                filterButtons.forEach(function(btn) {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                const category = button.dataset.category;
                visibleItems = 9;
                renderVideos(category);
            });
        });

        loadMoreBtn.addEventListener('click', function() {
            visibleItems += 9;
            const currentFilter = document.querySelector('.filter-btn.active').dataset.category;
            renderVideos(currentFilter);
        });

        window.addEventListener('storage', function(event) {
            if (event.key === 'multimedia_videos') {
                initialize();
            }
        });
    }

    initialize();
});
