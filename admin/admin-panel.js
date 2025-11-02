// ================================================================
// ADMIN PANEL - VIDEO GALLERY MANAGEMENT SYSTEM
// ================================================================

console.log('🔧 Admin Panel Loading...');

// Storage key for localStorage
const STORAGE_KEY = 'multimedia_videos';

// Video data structure
let videos = [];

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Admin Panel Ready');
    loadVideos();
    setupEventListeners();
    renderVideoList();
});

// Setup event listeners
function setupEventListeners() {
    const form = document.getElementById('videoForm');
    const generateBtn = document.getElementById('generateCode');
    const copyBtn = document.getElementById('copyCode');

    form.addEventListener('submit', handleAddVideo);
    generateBtn.addEventListener('click', generateHTML);
    copyBtn.addEventListener('click', copyToClipboard);

    // Google Drive URL validation
    document.getElementById('videoUrl').addEventListener('blur', validateGoogleDriveURL);
}

// Load videos from localStorage
function loadVideos() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        videos = JSON.parse(stored);
        console.log(`📚 Loaded ${videos.length} videos from storage`);
    } else {
        // Start with empty array - no demo data
        videos = [];
        console.log('📚 No videos found - starting fresh');
    }
}

// Save videos to localStorage
function saveVideos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
    console.log('💾 Videos saved to storage');
}

// Get Google Drive file ID from URL
function getGoogleDriveFileId(url) {
    const regExp = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

// Get Google Drive thumbnail (placeholder)
function getGoogleDriveThumbnail(fileId) {
    // Google Drive doesn't provide a direct public thumbnail link easily.
    // We'll use a placeholder image. You can replace this with a real thumbnail if you have a system for it.
    return 'https://i.imgur.com/W8DBabe.png'; // A generic video icon
}

// Validate Google Drive URL
function validateGoogleDriveURL() {
    const input = document.getElementById('videoUrl');
    const url = input.value.trim();
    
    if (url && !getGoogleDriveFileId(url)) {
        showAlert('กรุณาใส่ Google Drive URL ที่ถูกต้อง', 'error');
        input.focus();
        return false;
    }
    return true;
}

// Handle add video form submission
function handleAddVideo(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const videoUrl = formData.get('videoUrl').trim();
    const fileId = getGoogleDriveFileId(videoUrl);
    
    if (!fileId) {
        showAlert('Google Drive URL ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง', 'error');
        return;
    }
    
    // Check for duplicate URLs
    if (videos.find(v => v.url === videoUrl || v.videoUrl === videoUrl)) {
        showAlert('วิดีโอนี้มีอยู่ในระบบแล้ว', 'error');
        return;
    }
    
    const newVideo = {
        id: Date.now().toString(),
        url: videoUrl, // Google Drive URL for video-gallery.js
        category: formData.get('category'),
        title: formData.get('title').trim(),
        description: formData.get('description').trim(),
        studentName: formData.get('studentName').trim(),
        createdAt: new Date().toISOString()
    };
    
    videos.push(newVideo);
    saveVideos();
    renderVideoList();
    event.target.reset();
    showAlert('เพิ่มวิดีโอสำเร็จแล้ว! หน้าหลักจะอัพเดทอัตโนมัติ 🎉', 'success');
    
    // Try to refresh main website if opened in another tab
    refreshMainWebsite();
    
    console.log('✅ Added new video:', newVideo.title);
}

// Delete video
function deleteVideo(videoId) {
    if (!confirm('คุณแน่ใจว่าต้องการลบวิดีโอนี้?')) {
        return;
    }
    
    videos = videos.filter(video => video.id !== videoId);
    saveVideos();
    renderVideoList();
    showAlert('ลบวิดีโอเรียบร้อยแล้ว หน้าหลักจะอัพเดทอัตโนมัติ', 'success');
    
    // Try to refresh main website if opened in another tab
    refreshMainWebsite();
    
    console.log('🗑️ Deleted video:', videoId);
}

// Edit video (simplified - just delete and re-add)
function editVideo(videoId) {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;
    
    // Populate form with existing data
    document.getElementById('videoUrl').value = video.url || video.videoUrl; // Support both formats
    document.getElementById('category').value = video.category;
    document.getElementById('title').value = video.title;
    document.getElementById('description').value = video.description;
    document.getElementById('studentName').value = video.studentName;
    
    // Delete the old entry
    videos = videos.filter(v => v.id !== videoId);
    saveVideos();
    renderVideoList();
    
    // Scroll to form
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    showAlert('ข้อมูลถูกโหลดในฟอร์มแล้ว กรุณาแก้ไขและบันทึกใหม่', 'success');
}

// Render video list
function renderVideoList() {
    const container = document.getElementById('videoListContainer');
    
    if (videos.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <span class="material-symbols-outlined" style="font-size: 48px; opacity: 0.5;">video_library</span>
                <p style="margin-top: 15px; font-size: 1.1rem;">ยังไม่มีวิดีโอในระบบ</p>
                <p style="opacity: 0.7;">เพิ่มวิดีโอแรกเพื่อเริ่มต้นใช้งาน</p>
            </div>
        `;
        return;
    }
    
    const html = videos.map(video => {
        const categoryColors = {
            'animation': '#e74c3c',
            'game': '#f39c12',
            'web': '#2ecc71',
            'video': '#9b59b6',
            'graphic': '#3498db'
        };
        
        const categoryNames = {
            'animation': 'แอนิเมชัน',
            'game': 'เกม',
            'web': 'เว็บไซต์',
            'video': 'วิดีโอ',
            'graphic': 'กราฟิก'
        };
        
        return `
            <div class="video-item">
                <div class="video-item-header">
                    <div class="youtube-preview">
                        <img src="${getGoogleDriveThumbnail(video.videoId || 'placeholder')}" alt="Video thumbnail">
                    </div>
                    <div class="video-info">
                        <div class="video-title">${video.title}</div>
                        <div class="video-category" style="background-color: ${categoryColors[video.category] || '#666'}">
                            ${categoryNames[video.category] || video.category}
                        </div>
                        <div class="video-description">${video.description}</div>
                        <div class="video-student">นักศึกษา: ${video.studentName}</div>
                        <div style="font-size: 0.85em; color: #666; margin-top: 8px;">
                            ${video.url ? '📁 Google Drive' : '🎬 YouTube'}
                        </div>
                    </div>
                    <div class="video-actions">
                        <button class="btn btn-primary" onclick="editVideo('${video.id}')" style="padding: 8px 15px;">
                            <span class="material-symbols-outlined">edit</span>
                            แก้ไข
                        </button>
                        <button class="btn btn-danger" onclick="deleteVideo('${video.id}')" style="padding: 8px 15px;">
                            <span class="material-symbols-outlined">delete</span>
                            ลบ
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// Generate HTML code for the website
function generateHTML() {
    if (videos.length === 0) {
        showAlert('ไม่มีวิดีโอในระบบ กรุณาเพิ่มวิดีโอก่อน', 'error');
        return;
    }

    const categoryColors = {
        'animation': '#e74c3c',
        'game': '#f39c12',
        'web': '#2ecc71',
        'video': '#9b59b6',
        'graphic': '#3498db'
    };

    const categoryNames = {
        'animation': 'แอนิเมชัน',
        'game': 'เกม',
        'web': 'เว็บไซต์',
        'video': 'วิดีโอ',
        'graphic': 'กราฟิก'
    };

    const videoItems = videos.map(video => {
        const categoryName = categoryNames[video.category] || video.category;
        return `
            <div class="video-card" data-category="${video.category}">
                <div class="video-placeholder">
                    <iframe src="https://drive.google
                </div>
                <div class="video-card-content">
                    <h3 class="video-title">${video.title}</h3>
                    <p class="video-description">${video.description}</p>
                    <div class="video-meta">
                        <span class="video-category-badge" style="background-color: ${categoryColors[video.category] || '#6c757d'}">${categoryName}</span>
                        <span class="video-student-name">โดย: ${video.studentName}</span>
                    </div>
                </div>
            </div>`;
    }).join('\n');

    const fullHTML = `<!-- Video Gallery Section -->
<div class="video-gallery-section">
    <div class="head_section" id="workings" style="height: 150px; background-color: #0f0f0f;">
        <div>ผลงานนักศึกษาสาขาเทคโนโลยีมัลติมีเดีย</div>
    </div>
    <div class="container">
        <div class="section-header">
            <h4>รวมผลงานสร้างสรรค์และโครงการจบการศึกษาของ นักศึกษาสาขาเทคโนโลยีมัลติมีเดีย</h4>
        </div>

        <!-- Category Filters -->
        <div class="video-filters">
            <button class="filter-btn active" data-category="all">ทั้งหมด</button>
            <button class="filter-btn" data-category="animation">แอนิเมชัน</button>
            <button class="filter-btn" data-category="game">เกม</button>
            <button class="filter-btn" data-category="web">เว็บไซต์</button>
            <button class="filter-btn" data-category="video">วิดีโอ</button>
            <button class="filter-btn" data-category="graphic">กราฟิก</button>
        </div>

        <!-- Video Grid -->
        <div class="video-grid">
${videoItems}
        </div>

        <!-- Load More Button -->
        <div class="load-more-container">
            <button class="load-more-btn">โหลดผลงานเพิ่มเติม</button>
        </div>
    </div>
</div>`;

    document.getElementById('codeOutput').value = fullHTML;
    document.getElementById('generatedCode').classList.remove('hidden');
    showAlert('สร้างโค้ด HTML เรียบร้อยแล้ว! คัดลอกไปแทนที่ในไฟล์ index.html', 'success');

    // Scroll to generated code
    document.getElementById('generatedCode').scrollIntoView({ behavior: 'smooth' });
}

// Copy generated code to clipboard
function copyToClipboard() {
    const textarea = document.getElementById('codeOutput');
    textarea.select();
    document.execCommand('copy');
    showAlert('คัดลอกโค้ดเรียบร้อยแล้ว! 📋', 'success');
}

// Show alert message
function showAlert(message, type = 'success') {
    const container = document.getElementById('alertContainer');
    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
    
    const alert = document.createElement('div');
    alert.className = `alert ${alertClass}`;
    alert.textContent = message;
    
    container.appendChild(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Get initial demo videos (from current website)
function getInitialVideos() {
    return [
        {
            id: '1',
            videoId: 'aqCBD2qg7b8',
            videoUrl: 'https://www.youtube.com/watch?v=aqCBD2qg7b8',
            category: 'animation',
            title: 'แอนิเมชัน 2D "เรื่องเล่าจากอดีต"',
            description: 'ผลงานการสร้างแอนิเมชัน 2D ที่เล่าเรื่องราวของประวัติศาสตร์ไทย',
            studentName: 'น.ส. สมใจ ใจดี',
            createdAt: new Date().toISOString()
        },
        {
            id: '2',
            videoId: 'wKJ9KzGQq0w',
            videoUrl: 'https://www.youtube.com/watch?v=wKJ9KzGQq0w',
            category: 'animation',
            title: 'แอนิเมชัน 3D "โลกแห่งจินตนาการ"',
            description: 'ผลงานแอนิเมชัน 3D ที่สร้างขึ้นด้วยโปรแกรม Blender',
            studentName: 'นายสมชาย ใจกล้า',
            createdAt: new Date().toISOString()
        },
        {
            id: '3',
            videoId: 'loA756y-nLo',
            videoUrl: 'https://www.youtube.com/watch?v=loA756y-nLo',
            category: 'game',
            title: 'เกมผจญภัย "มหัศจรรย์ป่าไผ่"',
            description: 'เกมผจญภัยแนว RPG ที่พัฒนาด้วย Unity Engine',
            studentName: 'น.ส. สุดา เก่งเกม',
            createdAt: new Date().toISOString()
        },
        {
            id: '4',
            videoId: 'F2JCjVBcNVs',
            videoUrl: 'https://www.youtube.com/watch?v=F2JCjVBcNVs',
            category: 'game',
            title: 'เกมปริศนา "ไขรหัสลับ"',
            description: 'เกมแนวปริศนาที่ผสมผสานความสนุกกับการเรียนรู้',
            studentName: 'นายพิทักษ์ ฉลาดเกม',
            createdAt: new Date().toISOString()
        },
        {
            id: '5',
            videoId: 'P233BJm6sIg',
            videoUrl: 'https://www.youtube.com/watch?v=P233BJm6sIg',
            category: 'web',
            title: 'เว็บไซต์ "ท่องเที่ยวไทย"',
            description: 'เว็บไซต์แนะนำสถานที่ท่องเที่ยวพร้อม Interactive Map',
            studentName: 'น.ส. มาลี เก่งเว็บ',
            createdAt: new Date().toISOString()
        },
        {
            id: '6',
            videoId: 'HcOc7P5BMi4',
            videoUrl: 'https://www.youtube.com/watch?v=HcOc7P5BMi4',
            category: 'web',
            title: 'เว็บแอปพลิเคชัน "บริหารจัดการร้านค้า"',
            description: 'ระบบจัดการร้านค้าออนไลน์แบบครบวงจร',
            studentName: 'นายวิชัย เก่งโค้ด',
            createdAt: new Date().toISOString()
        },
        {
            id: '7',
            videoId: 'BQ0mxQXmLsk',
            videoUrl: 'https://www.youtube.com/watch?v=BQ0mxQXmLsk',
            category: 'video',
            title: 'สารคดีสั้น "วิถีชาวบ้าน"',
            description: 'สารคดีสั้นที่นำเสนอวิถีชีวิตของคนในท้องถิ่น',
            studentName: 'น.ส. สุพิน ใจศิลป์',
            createdAt: new Date().toISOString()
        },
        {
            id: '8',
            videoId: '9LfmrkyP81M',
            videoUrl: 'https://www.youtube.com/watch?v=9LfmrkyP81M',
            category: 'video',
            title: 'มิวสิกวิดีโอ "ฝันสีเงิน"',
            description: 'มิวสิกวิดีโอที่ผลิตขึ้นเองทั้งเพลงและภาพ',
            studentName: 'นายสมศักดิ์ เสียงใส',
            createdAt: new Date().toISOString()
        },
        {
            id: '9',
            videoId: 'rJaYQ7Qx2kE',
            videoUrl: 'https://www.youtube.com/watch?v=rJaYQ7Qx2kE',
            category: 'graphic',
            title: 'Motion Graphics "อนาคตเทคโนโลยี"',
            description: 'ผลงาน Motion Graphics ที่นำเสนอเทคโนโลยีในอนาคต',
            studentName: 'น.ส. กนิษฐา ใจสร้าง',
            createdAt: new Date().toISOString()
        },
        {
            id: '10',
            videoId: 'lOBu2S8qOv0',
            videoUrl: 'https://www.youtube.com/watch?v=lOBu2S8qOv0',
            category: 'graphic',
            title: 'Infographic Animation "ข้อมูลสิ่งแวดล้อม"',
            description: 'อินโฟกราฟิกแอนิเมชันที่นำเสนอข้อมูลสิ่งแวดล้อม',
            studentName: 'นายธนา เก่งกราฟิก',
            createdAt: new Date().toISOString()
        }
    ];
}

// Refresh main website function
function refreshMainWebsite() {
    // Send message to localStorage watchers
    localStorage.setItem('video_gallery_updated', Date.now().toString());
    
    // Try to communicate with parent/opener window (if admin is opened from main site)
    if (window.opener && !window.opener.closed) {
        try {
            if (typeof window.opener.refreshVideoGallery === 'function') {
                window.opener.refreshVideoGallery();
                console.log('✅ Refreshed main website video gallery');
            }
        } catch (e) {
            console.log('ℹ️ Could not communicate with parent window (different origin)');
        }
    }
}

// Listen for storage changes (when admin updates in another tab)
window.addEventListener('storage', function(e) {
    if (e.key === 'video_gallery_updated') {
        console.log('📢 Video gallery updated signal received');
        // Admin panel doesn't need to do anything special here
    }
});

// Global functions for onclick events
window.deleteVideo = deleteVideo;
window.editVideo = editVideo;