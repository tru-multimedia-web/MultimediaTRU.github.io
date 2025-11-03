// ================================================================
// ADMIN PANEL - VIDEO GALLERY MANAGEMENT SYSTEM (API Version)
// ================================================================

console.log('🔧 Admin Panel Loading...');

const API_URL = 'http://localhost:3000/api/videos';

// Video data structure
let videos = [];

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Admin Panel Ready');
    loadVideos();
    setupEventListeners();
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

// Load videos from API
async function loadVideos() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Failed to fetch videos');
        }
        
        videos = await response.json();
        console.log(`📚 Loaded ${videos.length} videos from API`);
        renderVideoList();
    } catch (error) {
        console.error('Error loading videos:', error);
        showNotification('เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาตรวจสอบว่า Server กำลังทำงาน', 'error');
        videos = [];
        renderVideoList();
    }
}

// Save videos to API
async function saveVideos() {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(videos)
        });

        if (!response.ok) {
            throw new Error('Failed to save videos');
        }

        const result = await response.json();
        console.log('💾 Videos saved successfully:', result);
        return true;
    } catch (error) {
        console.error('Error saving videos:', error);
        showNotification('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
        return false;
    }
}

// Validate Google Drive URL
function validateGoogleDriveURL() {
    const urlInput = document.getElementById('videoUrl');
    const url = urlInput.value.trim();

    if (!url) return;

    if (!url.includes('drive.google.com')) {
        showNotification('กรุณาใส่ URL จาก Google Drive', 'error');
        urlInput.focus();
        return false;
    }

    if (!url.includes('/view') && !url.includes('/preview')) {
        showNotification('URL ต้องเป็นลิงค์แบบ "Anyone with the link can view"', 'warning');
    }

    return true;
}

// Handle add video form submission
async function handleAddVideo(e) {
    e.preventDefault();

    const videoUrl = document.getElementById('videoUrl').value.trim();
    const category = document.getElementById('category').value;
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const studentName = document.getElementById('studentName').value.trim();

    // Validate Google Drive URL
    if (!validateGoogleDriveURL()) {
        return;
    }

    // Check for duplicates
    const isDuplicate = videos.some(v => v.url === videoUrl);
    if (isDuplicate) {
        showNotification('วิดีโอนี้มีในระบบอยู่แล้ว', 'warning');
        return;
    }

    // Create new video object
    const newVideo = {
        id: Date.now().toString(),
        url: videoUrl,
        category: category,
        title: title,
        description: description,
        studentName: studentName,
        createdAt: new Date().toISOString()
    };

    // Add to videos array
    videos.push(newVideo);

    // Save to API
    const saved = await saveVideos();
    
    if (saved) {
        showNotification('✅ เพิ่มวิดีโอสำเร็จ!', 'success');
        renderVideoList();
        document.getElementById('videoForm').reset();
    }
}

// Delete video
async function deleteVideo(id) {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบวิดีโอนี้?')) {
        return;
    }

    const index = videos.findIndex(v => v.id === id);
    if (index === -1) return;

    videos.splice(index, 1);
    
    const saved = await saveVideos();
    
    if (saved) {
        showNotification('ลบวิดีโอเรียบร้อย', 'success');
        renderVideoList();
    }
}

// Edit video
function editVideo(id) {
    const video = videos.find(v => v.id === id);
    if (!video) return;

    // Fill form with video data
    document.getElementById('videoUrl').value = video.url;
    document.getElementById('category').value = video.category;
    document.getElementById('title').value = video.title;
    document.getElementById('description').value = video.description;
    document.getElementById('studentName').value = video.studentName;

    // Delete the old video
    deleteVideo(id);

    // Scroll to form
    document.getElementById('videoForm').scrollIntoView({ behavior: 'smooth' });
    showNotification('แก้ไขข้อมูล แล้วกด "เพิ่มวิดีโอ" เพื่อบันทึก', 'info');
}

// Render video list
function renderVideoList() {
    const videoList = document.getElementById('videoList');
    const videoCount = document.getElementById('videoCount');

    if (videos.length === 0) {
        videoList.innerHTML = '<div class="empty-state">ยังไม่มีวิดีโอในระบบ เพิ่มวิดีโอใหม่ด้านบน</div>';
        videoCount.textContent = '0';
        return;
    }

    videoCount.textContent = videos.length;

    let html = '<div class="video-cards">';
    videos.forEach(video => {
        const thumbnailUrl = video.url.replace("/view", "/preview");
        const isGoogleDrive = video.url.includes('drive.google.com');
        
        html += `
            <div class="video-card">
                <div class="video-thumbnail">
                    <iframe src="${thumbnailUrl}" frameborder="0" allowfullscreen></iframe>
                </div>
                <div class="video-details">
                    <h3>${video.title}</h3>
                    <p class="video-description">${video.description}</p>
                    <div class="video-meta">
                        <span class="badge badge-${video.category.toLowerCase()}">${video.category}</span>
                        <span class="student">${video.studentName}</span>
                        ${isGoogleDrive ? '<span class="badge badge-drive">Google Drive</span>' : ''}
                    </div>
                    <div class="video-actions">
                        <button class="btn-edit" onclick="editVideo('${video.id}')">
                            <span class="material-symbols-outlined">edit</span> แก้ไข
                        </button>
                        <button class="btn-delete" onclick="deleteVideo('${video.id}')">
                            <span class="material-symbols-outlined">delete</span> ลบ
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';

    videoList.innerHTML = html;
}

// Generate HTML code for embedding
function generateHTML() {
    const videoUrl = document.getElementById('videoUrl').value.trim();

    if (!videoUrl) {
        showNotification('กรุณาใส่ URL ของวิดีโอก่อน', 'warning');
        return;
    }

    const embedUrl = videoUrl.replace("/view", "/preview");

    const htmlCode = `<div class="video-container">
    <iframe src="${embedUrl}" 
            frameborder="0" 
            allowfullscreen>
    </iframe>
</div>`;

    document.getElementById('generatedCode').value = htmlCode;
    showNotification('สร้างโค้ด HTML สำเร็จ!', 'success');
}

// Copy generated code to clipboard
function copyToClipboard() {
    const codeArea = document.getElementById('generatedCode');

    if (!codeArea.value) {
        showNotification('ไม่มีโค้ดให้ Copy', 'warning');
        return;
    }

    codeArea.select();
    document.execCommand('copy');
    showNotification('📋 Copy โค้ดสำเร็จ!', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }

    // Create notification element
    const notif = document.createElement('div');
    notif.className = `notification notification-${type}`;
    notif.textContent = message;

    // Add to body
    document.body.appendChild(notif);

    // Trigger animation
    setTimeout(() => {
        notif.classList.add('show');
    }, 10);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => {
            notif.remove();
        }, 300);
    }, 3000);
}

// Export/Import data functions
function exportData() {
    const dataStr = JSON.stringify(videos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `videos-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('📥 Export ข้อมูลสำเร็จ!', 'success');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = async function(event) {
            try {
                const importedVideos = JSON.parse(event.target.result);
                
                if (!Array.isArray(importedVideos)) {
                    throw new Error('Invalid data format');
                }
                
                if (confirm(`Import ${importedVideos.length} วิดีโอ? ข้อมูลเดิมจะถูกแทนที่`)) {
                    videos = importedVideos;
                    const saved = await saveVideos();
                    
                    if (saved) {
                        renderVideoList();
                        showNotification('📤 Import ข้อมูลสำเร็จ!', 'success');
                    }
                }
            } catch (error) {
                showNotification('ไฟล์ไม่ถูกต้อง', 'error');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Clear all data
async function clearAllData() {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
        return;
    }
    
    if (!confirm('ยืนยันอีกครั้ง: ลบข้อมูลทั้งหมด?')) {
        return;
    }
    
    videos = [];
    const saved = await saveVideos();
    
    if (saved) {
        renderVideoList();
        showNotification('🗑️ ลบข้อมูลทั้งหมดเรียบร้อย', 'success');
    }
}

// Check API health
async function checkAPIHealth() {
    try {
        const response = await fetch('http://localhost:3000/api/health');
        if (response.ok) {
            showNotification('✅ Server กำลังทำงานปกติ', 'success');
        } else {
            showNotification('⚠️ Server ตอบกลับผิดปกติ', 'warning');
        }
    } catch (error) {
        showNotification('❌ ไม่สามารถเชื่อมต่อกับ Server ได้', 'error');
    }
}
