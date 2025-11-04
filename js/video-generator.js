// ================================================================
// VIDEO GENERATOR - ADMIN TOOL JAVASCRIPT
// ================================================================

let videos = [];
let currentThumbnailData = null; // เก็บข้อมูลรูปภาพที่อัพโหลด
let editingVideoId = null; // เก็บ ID ของวิดีโอที่กำลังแก้ไข

// Expose functions to global scope for onclick handlers
window.editVideo = editVideo;
window.deleteVideo = deleteVideo;
window.handleThumbnailUpload = handleThumbnailUpload;
window.clearForm = clearForm;
window.downloadJSON = downloadJSON;
window.importJSON = importJSON;
window.previewJSON = previewJSON;
window.closeModal = closeModal;
window.copyJSON = copyJSON;
window.clearAll = clearAll;
window.updateVideosJSON = updateVideosJSON;

// Load from data/videos.json on start
window.addEventListener('DOMContentLoaded', async () => {
    console.log('🎬 Video Generator: DOM Content Loaded');
    await autoLoadVideosJSON();
});

async function autoLoadVideosJSON() {
    console.log('📂 Auto-loading videos from data/videos.json...');
    try {
        const response = await fetch('data/videos.json');
        console.log('🌐 Fetch response status:', response.status);

        if (response.ok) {
            const loadedVideos = await response.json();
            console.log('✅ Loaded', loadedVideos.length, 'videos from data/videos.json');
            console.log('📋 Video data:', JSON.stringify(loadedVideos, null, 2));
            
            // ใช้ตรรกะเดียวกับ importJSON() - แทนที่ข้อมูลเดิมทั้งหมด
            videos = loadedVideos;
            console.log('📦 videos array now has:', videos.length, 'items');
            
            saveToStorage();
            console.log('💾 Saved to localStorage');
            
            // เรียก render และ update stats
            console.log('🎨 Calling renderVideoList()...');
            renderVideoList();
            
            console.log('📊 Calling updateStats()...');
            updateStats();
            
            showNotification(`✅ โหลดข้อมูลอัตโนมัติ: ${videos.length} วิดีโอ`, 'success');
        } else {
            console.log('⚠️ Cannot load data/videos.json, using empty array');
            videos = [];
            renderVideoList();
            updateStats();
            showNotification('ℹ️ ไม่พบไฟล์ videos.json - เริ่มต้นด้วยรายการว่าง', 'info');
        }
    } catch (error) {
        console.error('❌ Error loading videos.json:', error);
        videos = [];
        renderVideoList();
        updateStats();
        showNotification('ℹ️ ไม่สามารถโหลด videos.json - เริ่มต้นด้วยรายการว่าง', 'info');
    }
}

function loadStoredVideos() {
    const stored = localStorage.getItem('video_generator_data');
    if (stored) {
        try {
            const parsedVideos = JSON.parse(stored);
            console.log('📱 Found', parsedVideos.length, 'videos in localStorage');
            return parsedVideos;
        } catch (e) {
            console.error('❌ Error parsing localStorage data:', e);
            return [];
        }
    } else {
        console.log('📱 No data in localStorage');
        return [];
    }
}

function loadFromStorage() {
    videos = loadStoredVideos();
}

function saveToStorage() {
    localStorage.setItem('video_generator_data', JSON.stringify(videos));
}

// ฟังก์ชันจัดการการอัพโหลดรูปภาพ
function handleThumbnailUpload(event) {
    const file = event.target.files[0];
    
    if (!file) {
        currentThumbnailData = null;
        document.getElementById('thumbnailPreview').innerHTML = '';
        return;
    }
    
    // ตรวจสอบขนาดไฟล์ (ไม่เกิน 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showNotification('⚠️ ไฟล์ใหญ่เกินไป! กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 2MB', 'error');
        event.target.value = '';
        return;
    }
    
    // อ่านไฟล์และแสดงตัวอย่าง
    const reader = new FileReader();
    
    reader.onload = function(e) {
        currentThumbnailData = {
            filename: file.name,
            data: e.target.result,
            size: file.size
        };
        
        // แสดงตัวอย่างรูปภาพ
        const preview = document.getElementById('thumbnailPreview');
        preview.innerHTML = `
            <div style="border: 2px solid #4CAF50; border-radius: 8px; padding: 10px; background: #f0f9f4;">
                <img src="${e.target.result}" 
                     style="max-width: 100%; max-height: 200px; border-radius: 4px; display: block; margin: 0 auto;">
                <p style="margin: 10px 0 0 0; text-align: center; color: #4CAF50; font-size: 14px;">
                    ✅ รูปภาพพร้อมใช้งาน (${(file.size / 1024).toFixed(1)} KB)
                </p>
            </div>
        `;
        
        showNotification('✅ อัพโหลดรูปภาพสำเร็จ!', 'success');
    };
    
    reader.readAsDataURL(file);
}

function addVideo(event) {
    event.preventDefault();
    
    const videoUrl = document.getElementById('videoUrl').value.trim();
    const category = document.getElementById('category').value;
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const studentName = document.getElementById('studentName').value.trim();
    
    // สร้างชื่อไฟล์รูปภาพจาก title + timestamp
    let thumbnailPath = '';
    let thumbnailFilename = '';
    if (currentThumbnailData) {
        const timestamp = Date.now();
        const fileExt = currentThumbnailData.filename.split('.').pop();
        const safeName = title.replace(/[^a-zA-Z0-9ก-๙]/g, '_').substring(0, 50);
        thumbnailFilename = `${safeName}_${timestamp}.${fileExt}`;
        thumbnailPath = `images/cover/${thumbnailFilename}`;
        
        // ส่งรูปภาพไปยัง API เพื่อบันทึกไฟล์จริง (เพิ่ม await)
        (async () => {
            await saveImageToServer(thumbnailFilename, currentThumbnailData.data);
        })();
    }
    
    // ถ้าเป็นการแก้ไข (มี editingVideoId)
    if (editingVideoId) {
        const videoIndex = videos.findIndex(v => v.id === editingVideoId || v.id === String(editingVideoId));
        
        if (videoIndex !== -1) {
            // อัปเดตข้อมูลเดิม
            videos[videoIndex] = {
                ...videos[videoIndex], // เก็บข้อมูลเดิมไว้
                url: videoUrl,
                thumbnail: thumbnailPath || videos[videoIndex].thumbnail, // ใช้รูปเดิมถ้าไม่มีรูปใหม่
                thumbnailData: currentThumbnailData ? currentThumbnailData.data : videos[videoIndex].thumbnailData,
                category: category,
                title: title,
                description: description,
                studentName: studentName
            };
            
            saveToStorage();
            saveVideosToServer(); // บันทึก JSON ไปที่ server
            renderVideoList();
            updateStats();
            clearForm();
            
            showNotification('✅ แก้ไขวิดีโอสำเร็จ!', 'success');
            return;
        }
    }
    
    // Check duplicate (เฉพาะตอนเพิ่มใหม่)
    const isDuplicate = videos.some(v => v.url === videoUrl);
    if (isDuplicate) {
        showNotification('วิดีโอนี้มีในระบบอยู่แล้ว', 'warning');
        return;
    }
    
    // Create video object (กรณีเพิ่มใหม่)
    const newVideo = {
        id: Date.now().toString(),
        url: videoUrl,
        thumbnail: thumbnailPath, // เก็บเป็น path ของรูปภาพ
        thumbnailData: currentThumbnailData ? currentThumbnailData.data : null, // เก็บ base64 data
        category: category,
        title: title,
        description: description,
        studentName: studentName,
        createdAt: new Date().toISOString()
    };
    
    videos.push(newVideo);
    saveToStorage();
    saveVideosToServer(); // บันทึก JSON ไปที่ server
    renderVideoList();
    updateStats();
    clearForm();
    
    showNotification('✅ เพิ่มวิดีโอสำเร็จ!', 'success');
}

function deleteVideo(id) {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบวิดีโอนี้?')) {
        return;
    }
    
    videos = videos.filter(v => v.id !== id && v.id !== String(id));
    
    saveToStorage();
    renderVideoList();
    updateStats();
    
    showNotification('ลบวิดีโอเรียบร้อย', 'success');
}

function editVideo(id) {
    console.log('📝 editVideo called with ID:', id);
    console.log('📊 Total videos:', videos.length);
    console.log('📋 All video IDs:', videos.map(v => v.id));
    
    const video = videos.find(v => v.id === id || v.id === String(id));
    
    if (!video) {
        console.error('❌ Video not found with ID:', id);
        showNotification('ไม่พบวิดีโอที่ต้องการแก้ไข', 'error');
        return;
    }
    
    console.log('✅ Found video:', video.title);
    
    // เก็บ ID สำหรับการแก้ไข
    editingVideoId = String(id); // แปลงเป็น string เสมอ
    
    // กรอกข้อมูลลงในฟอร์ม
    document.getElementById('videoUrl').value = video.url;
    document.getElementById('category').value = video.category;
    document.getElementById('title').value = video.title;
    document.getElementById('description').value = video.description;
    document.getElementById('studentName').value = video.studentName;
    
    // แสดงตัวอย่างรูปภาพถ้ามี
    if (video.thumbnailData) {
        currentThumbnailData = {
            filename: video.thumbnail,
            data: video.thumbnailData
        };
        
        const preview = document.getElementById('thumbnailPreview');
        preview.innerHTML = `
            <div style="border: 2px solid #4CAF50; border-radius: 8px; padding: 10px; background: #f0f9f4;">
                <img src="${video.thumbnailData}" 
                     style="max-width: 100%; max-height: 200px; border-radius: 4px; display: block; margin: 0 auto;">
                <p style="margin: 10px 0 0 0; text-align: center; color: #4CAF50; font-size: 14px;">
                    ✅ รูปภาพเดิม (อัพโหลดใหม่ถ้าต้องการเปลี่ยน)
                </p>
            </div>
        `;
    }
    
    // เปลี่ยนป้ายปุ่ม
    const submitBtn = document.getElementById('submitBtn');
    if (!submitBtn) {
        console.error('❌ submitBtn not found!');
        return;
    }
    
    submitBtn.textContent = '💾 บันทึกการแก้ไข';
    submitBtn.style.background = 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)';
    
    console.log('✅ Button text changed to:', submitBtn.textContent);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotification('📝 แก้ไขข้อมูลแล้วกด "บันทึกการแก้ไข"', 'info');
}

function renderVideoList() {
    console.log('🎨 renderVideoList() called');
    console.log('📊 videos.length:', videos.length);
    console.log('📋 videos array:', videos);
    
    const list = document.getElementById('videoList');
    console.log('🔍 videoList element:', list);

    if (!list) {
        console.error('❌ videoList element not found!');
        alert('ERROR: videoList element not found in HTML!');
        return;
    }

    if (videos.length === 0) {
        console.log('📭 No videos to display');
        list.innerHTML = '<p class="empty-state">ยังไม่มีวิดีโอ เริ่มเพิ่มวิดีโอใหม่ทางซ้ายมือ</p>';
        return;
    }

    console.log('✅ Rendering', videos.length, 'videos');
    
    // เรียงลำดับวิดีโอจากใหม่ไปเก่า (ตาม createdAt)
    const sortedVideos = [...videos].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA; // ใหม่ก่อน
    });
    
    let html = '';
    
    sortedVideos.forEach((video, index) => {
        console.log(`  Rendering video ${index + 1}:`, video.title, '| Thumbnail:', video.thumbnail);
        
        // แปลง URL Google Drive เป็น embed URL
        const embedUrl = video.url.replace('/view?usp=sharing', '/preview').replace('/view?usp=drive_link', '/preview');

        // แสดง thumbnail ถ้ามี - ใช้ path สัมพัทธ์จาก root
        let thumbnailHtml;
        if (video.thumbnail && video.thumbnail.trim() !== '') {
            const thumbnailPath = video.thumbnail.startsWith('/') ? video.thumbnail : '/' + video.thumbnail;
            console.log(`  📸 Thumbnail path: ${thumbnailPath}`);
            thumbnailHtml = `<img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail" 
                onerror="console.error('❌ Failed to load:', this.src); this.parentElement.innerHTML='<div class=\\'no-thumbnail\\'>🎬</div>';">`;
        } else {
            console.log(`  ⚠️ No thumbnail for: ${video.title}`);
            thumbnailHtml = '<div class="no-thumbnail">🎬</div>';
        }

        html += `
            <div class="video-card">
                <div class="video-header">
                    ${thumbnailHtml}
                    <div class="video-info">
                        <h3>${video.title}</h3>
                        <p class="video-description">${video.description}</p>
                        <p class="video-meta">
                            <span class="student"><span class="material-symbols-outlined" style="font-size: 16px; vertical-align: middle;">person</span> ${video.studentName}</span>
                            <span class="category-badge badge-${video.category}">${getCategoryName(video.category)}</span>
                        </p>
                    </div>
                </div>
                <div class="video-details">
                    <div class="video-url">
                        <strong>URL:</strong>
                        <a href="${video.url}" target="_blank" title="${video.url}">
                            <span class="material-symbols-outlined" style="font-size: 16px; vertical-align: middle;">link</span> เปิดวิดีโอ
                        </a>
                    </div>
                    <div class="video-date">
                        <strong>วันที่สร้าง:</strong> ${new Date(video.createdAt).toLocaleDateString('th-TH')}
                    </div>
                </div>
                <div class="actions">
                    <button class="btn-small" onclick="editVideo('${video.id}')">
                        <span class="material-symbols-outlined" style="font-size: 16px;">edit</span> แก้ไข
                    </button>
                    <button class="btn-small danger" onclick="deleteVideo('${video.id}')">
                        <span class="material-symbols-outlined" style="font-size: 16px;">delete</span> ลบ
                    </button>
                </div>
            </div>
        `;
    });

    console.log('📝 Generated HTML length:', html.length, 'characters');
    list.innerHTML = html;
    console.log('✅ Rendered HTML updated in DOM');
    console.log('🔍 videoList.innerHTML length after update:', list.innerHTML.length);
}

// ฟังก์ชันช่วยแปลงชื่อหมวดหมู่เป็นภาษาไทย
function getCategoryName(category) {
    const categoryNames = {
        'animation': 'แอนิเมชัน',
        'game': 'เกม',
        'web': 'เว็บไซต์',
        'video': 'วิดีโอ',
        'graphic': 'กราฟิก'
    };
    return categoryNames[category] || category;
}

function updateStats() {
    document.getElementById('totalVideos').textContent = videos.length;
    document.getElementById('animationCount').textContent = videos.filter(v => v.category === 'animation').length;
    document.getElementById('gameCount').textContent = videos.filter(v => v.category === 'game').length;
    document.getElementById('webCount').textContent = videos.filter(v => v.category === 'web').length;
    document.getElementById('videoCount').textContent = videos.filter(v => v.category === 'video').length;
    document.getElementById('graphicCount').textContent = videos.filter(v => v.category === 'graphic').length;
}

function clearForm() {
    document.getElementById('videoForm').reset();
    currentThumbnailData = null;
    editingVideoId = null; // รีเซ็ต editing mode
    document.getElementById('thumbnailPreview').innerHTML = '';
    
    // รีเซ็ตปุ่มกลับเป็นปกติ
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.textContent = '➕ เพิ่มวิดีโอ';
    submitBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
}

function downloadJSON() {
    if (videos.length === 0) {
        showNotification('ยังไม่มีวิดีโอให้ดาวน์โหลด', 'warning');
        return;
    }
    
    // สร้าง JSON โดยไม่รวม thumbnailData (เพื่อลดขนาดไฟล์)
    const exportVideos = videos.map(v => ({
        id: v.id,
        url: v.url,
        thumbnail: v.thumbnail,
        category: v.category,
        title: v.title,
        description: v.description,
        studentName: v.studentName,
        createdAt: v.createdAt
    }));
    
    const dataStr = JSON.stringify(exportVideos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data/videos.json';
    link.click();
    
    showNotification('✅ ดาวน์โหลด videos.json สำเร็จ!', 'success');
    
    // ดาวน์โหลดรูปภาพทั้งหมดเป็น ZIP
    if (videos.some(v => v.thumbnailData)) {
        setTimeout(() => {
            if (confirm('ต้องการดาวน์โหลดรูปภาพปกทั้งหมดด้วยหรือไม่?\n\n⚠️ คุณต้องวางรูปภาพในโฟลเดอร์ images/cover/ ด้วยตัวเอง')) {
                downloadAllThumbnails();
            }
        }, 500);
    }
}

function importJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const importedVideos = JSON.parse(event.target.result);
                
                if (!Array.isArray(importedVideos)) {
                    throw new Error('Invalid format');
                }
                
                if (confirm(`นำเข้า ${importedVideos.length} วิดีโอ? ข้อมูลเดิมจะถูกแทนที่`)) {
                    videos = importedVideos;
                    saveToStorage();
                    renderVideoList();
                    updateStats();
                    showNotification('นำเข้าข้อมูลสำเร็จ!', 'success');
                }
            } catch (error) {
                showNotification('ไฟล์ไม่ถูกต้อง', 'error');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

function previewJSON() {
    const jsonStr = JSON.stringify(videos, null, 2);
    document.getElementById('jsonPreview').textContent = jsonStr;
    document.getElementById('jsonModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('jsonModal').style.display = 'none';
}

function copyJSON() {
    const jsonStr = JSON.stringify(videos, null, 2);
    navigator.clipboard.writeText(jsonStr);
    showNotification('📋 Copy JSON สำเร็จ!', 'success');
}

function clearAll() {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลทั้งหมด?')) {
        return;
    }
    
    if (!confirm('ยืนยันอีกครั้ง: ลบข้อมูลทั้งหมด?')) {
        return;
    }
    
    videos = [];
    saveToStorage();
    renderVideoList();
    updateStats();
    
    showNotification('ลบข้อมูลทั้งหมดเรียบร้อย', 'success');
}

function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notif = document.createElement('div');
    notif.className = `notification notification-${type}`;
    notif.textContent = message;
    
    document.body.appendChild(notif);
    
    setTimeout(() => notif.classList.add('show'), 10);
    
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// ================================================================
// PYTHON API INTEGRATION
// ================================================================

const API_BASE_URL = 'http://localhost:5001/api';

/**
 * บันทึกรูปภาพไปยัง Python API Server
 */
async function saveImageToServer(filename, base64Data) {
    try {
        const response = await fetch(`${API_BASE_URL}/upload-image`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filename: filename,
                data: base64Data
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('✅ Image saved to server:', result.path);
        return result;
        
    } catch (error) {
        console.warn('⚠️ Cannot connect to Python API:', error.message);
        console.log('💡 Make sure to run: python3 api-server.py');
        // ไม่ให้ error หยุดการทำงาน - ยังคงบันทึกใน localStorage ได้
    }
}

/**
 * บันทึกข้อมูลวิดีโอไปยัง js/videos.json ผ่าน Python API
 */
async function saveVideosToServer() {
    try {
        // ลบ thumbnailData ออกเพื่อลดขนาดไฟล์
        const cleanVideos = videos.map(v => {
            const {thumbnailData, ...videoWithoutData} = v;
            return videoWithoutData;
        });
        
        const response = await fetch(`${API_BASE_URL}/save-videos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cleanVideos)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('✅ Videos saved to server:', result.message);
        return result;
        
    } catch (error) {
        console.warn('⚠️ Cannot save to server:', error.message);
        console.log('💡 Videos are still saved in localStorage');
        throw error; // ส่ง error ต่อเพื่อให้ฟังก์ชันที่เรียกรู้ว่าเกิดข้อผิดพลาด
    }
}

/**
 * ฟังก์ชัน Update - อัพเดตข้อมูลไปยัง data/videos.json โดยอัตโนมัติ
 * เรียกใช้เมื่อกดปุ่ม "Update" ใน UI
 */
async function updateVideosJSON() {
    // แสดงข้อความกำลังโหลด
    const videoCount = videos.length;
    const message = videoCount === 0 
        ? '🔄 กำลังอัพเดตข้อมูล (ล้างรายการวิดีโอทั้งหมด)...'
        : `🔄 กำลังอัพเดตข้อมูล ${videoCount} วิดีโอไปยัง data/videos.json...`;
    
    showNotification(message, 'info');
    
    try {
        // เรียก API เพื่อบันทึกข้อมูล (รองรับการบันทึก array ว่างด้วย)
        await saveVideosToServer();
        
        // แสดงข้อความสำเร็จ
        const successMessage = videoCount === 0
            ? `✅ ล้างข้อมูลสำเร็จ!\n📝 ไฟล์ data/videos.json ถูกล้างเรียบร้อย\n\n🔄 Refresh หน้า video-gallery เพื่อดูการเปลี่ยนแปลง`
            : `✅ อัพเดตข้อมูลสำเร็จ!\n📝 บันทึก ${videoCount} วิดีโอไปยัง data/videos.json\n\n🔄 Refresh หน้า video-gallery เพื่อดูข้อมูลใหม่`;
        
        showNotification(successMessage, 'success');
        
        console.log('✅ Update complete:', {
            totalVideos: videoCount,
            file: 'data/videos.json',
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        // แสดงข้อความ error พร้อมคำแนะนำ
        showNotification(
            `❌ ไม่สามารถอัพเดตข้อมูลได้!\n\n⚠️ กรุณาตรวจสอบ:\n1. API Server กำลังทำงานหรือไม่\n2. เปิด Terminal และรัน: node server/api-server.js\n3. ตรวจสอบ Console (F12) เพื่อดูรายละเอียด`, 
            'error'
        );
        
        console.error('❌ Update failed:', error);
    }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ฟังก์ชันดาวน์โหลดรูปภาพทั้งหมด
function downloadAllThumbnails() {
    const videosWithThumbnails = videos.filter(v => v.thumbnailData);
    
    if (videosWithThumbnails.length === 0) {
        showNotification('ไม่มีรูปภาพให้ดาวน์โหลด', 'warning');
        return;
    }
    
    showNotification(`กำลังดาวน์โหลดรูปภาพ ${videosWithThumbnails.length} ภาพ...`, 'info');
    
    // ดาวน์โหลดรูปภาพทีละภาพ
    videosWithThumbnails.forEach((video, index) => {
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = video.thumbnailData;
            link.download = video.thumbnail.split('/').pop(); // ใช้ชื่อไฟล์จาก path
            link.click();
        }, index * 300); // ดาวน์โหลดห่างกัน 300ms
    });
    
    setTimeout(() => {
        showNotification(`✅ ดาวน์โหลดรูปภาพ ${videosWithThumbnails.length} ภาพเรียบร้อย!\n\n📁 วางรูปภาพในโฟลเดอร์: images/cover/`, 'success');
    }, videosWithThumbnails.length * 300 + 500);
}
