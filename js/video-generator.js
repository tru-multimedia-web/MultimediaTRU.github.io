// ================================================================
// VIDEO GENERATOR - ADMIN TOOL JAVASCRIPT
// ================================================================

let videos = [];

// Load from localStorage on start
window.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    renderVideoList();
    updateStats();
});

function loadFromStorage() {
    const stored = localStorage.getItem('video_generator_data');
    if (stored) {
        videos = JSON.parse(stored);
        console.log('Loaded', videos.length, 'videos from storage');
    }
}

function saveToStorage() {
    localStorage.setItem('video_generator_data', JSON.stringify(videos));
}

function addVideo(event) {
    event.preventDefault();
    
    const videoUrl = document.getElementById('videoUrl').value.trim();
    let thumbnailUrl = document.getElementById('thumbnailUrl').value.trim();
    const category = document.getElementById('category').value;
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const studentName = document.getElementById('studentName').value.trim();
    
    // แปลง Google Drive thumbnail URL อัตโนมัติ
    if (thumbnailUrl && thumbnailUrl.includes('drive.google.com')) {
        let fileId = null;
        
        // ดึง File ID จาก URL (รองรับหลายรูปแบบ)
        const match1 = thumbnailUrl.match(/\/file\/d\/([^\/\?]+)/);
        const match2 = thumbnailUrl.match(/[?&]id=([^&]+)/);
        const match3 = thumbnailUrl.match(/uc\?.*id=([^&]+)/);
        
        if (match1) {
            fileId = match1[1];
        } else if (match2) {
            fileId = match2[1];
        } else if (match3) {
            fileId = match3[1];
        }
        
        if (fileId) {
            // แปลงเป็น thumbnail URL ที่ใช้งานได้
            thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1280`;
            console.log('✅ แปลง thumbnail URL:', thumbnailUrl);
        }
    }
    
    // Check duplicate
    const isDuplicate = videos.some(v => v.url === videoUrl);
    if (isDuplicate) {
        showNotification('วิดีโอนี้มีในระบบอยู่แล้ว', 'warning');
        return;
    }
    
    // Create video object
    const newVideo = {
        id: Date.now().toString(),
        url: videoUrl,
        thumbnail: thumbnailUrl || '', // ใช้ URL ที่แปลงแล้ว
        category: category,
        title: title,
        description: description,
        studentName: studentName,
        createdAt: new Date().toISOString()
    };
    
    videos.push(newVideo);
    saveToStorage();
    renderVideoList();
    updateStats();
    clearForm();
    
    showNotification('✅ เพิ่มวิดีโอสำเร็จ!', 'success');
}

function deleteVideo(id) {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบวิดีโอนี้?')) {
        return;
    }
    
    videos = videos.filter(v => v.id !== id);
    saveToStorage();
    renderVideoList();
    updateStats();
    
    showNotification('ลบวิดีโอเรียบร้อย', 'success');
}

function editVideo(id) {
    const video = videos.find(v => v.id === id);
    if (!video) return;
    
    document.getElementById('videoUrl').value = video.url;
    document.getElementById('thumbnailUrl').value = video.thumbnail || '';
    document.getElementById('category').value = video.category;
    document.getElementById('title').value = video.title;
    document.getElementById('description').value = video.description;
    document.getElementById('studentName').value = video.studentName;
    
    deleteVideo(id);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotification('แก้ไขข้อมูล แล้วกด "เพิ่มวิดีโอ" เพื่อบันทึก', 'info');
}

function renderVideoList() {
    const list = document.getElementById('videoList');
    
    if (videos.length === 0) {
        list.innerHTML = '<p class="empty-state">ยังไม่มีวิดีโอ เริ่มเพิ่มวิดีโอใหม่ทางซ้ายมือ</p>';
        return;
    }
    
    let html = '';
    videos.forEach(video => {
        html += `
            <div class="video-card">
                <h3>${video.title}</h3>
                <p>${video.description}</p>
                <p class="video-card-meta">👤 ${video.studentName}</p>
                <span class="badge badge-${video.category}">${video.category}</span>
                <div class="actions">
                    <button class="btn-small" onclick="editVideo('${video.id}')">แก้ไข</button>
                    <button class="btn-small danger" onclick="deleteVideo('${video.id}')">ลบ</button>
                </div>
            </div>
        `;
    });
    
    list.innerHTML = html;
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
}

function downloadJSON() {
    if (videos.length === 0) {
        showNotification('ยังไม่มีวิดีโอให้ดาวน์โหลด', 'warning');
        return;
    }
    
    const dataStr = JSON.stringify(videos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'videos.json';
    link.click();
    
    showNotification('ดาวน์โหลด videos.json สำเร็จ! วางไฟล์ในโฟลเดอร์ js/', 'success');
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
    
    showNotification('🗑️ ลบข้อมูลทั้งหมดเรียบร้อย', 'success');
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

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
