// ================================================================
// ADMIN VIDEO DEBUG TOOL - ตรวจสอบปัญหาการเพิ่มวิดีโอใน Admin
// ================================================================

console.log('🔍 Admin Video Debug Tool Loading...');

class AdminVideoDebugger {
    constructor() {
        this.storageKey = 'multimedia_videos';
        this.updateSignalKey = 'video_gallery_updated';
    }
    
    // ฟังก์ชันหลักสำหรับ debug ปัญหาการเพิ่มวิดีโอ
    debugVideoAddition() {
        console.log('🔍 === ADMIN VIDEO ADDITION DEBUG ===');
        
        // 1. ตรวจสอบ localStorage
        this.checkLocalStorage();
        
        // 2. ตรวจสอบ form elements
        this.checkFormElements();
        
        // 3. ทดสอบการแยก Video ID
        this.testVideoIdExtraction();
        
        // 4. ตรวจสอบ event listeners
        this.checkEventListeners();
        
        // 5. ทดสอบการบันทึกข้อมูล
        this.testDataSaving();
        
        console.log('🔍 === END DEBUG ===');
    }
    
    checkLocalStorage() {
        console.log('📦 Checking localStorage...');
        
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                const videos = JSON.parse(stored);
                console.log(`✅ localStorage contains ${videos.length} videos`);
                videos.forEach((video, index) => {
                    console.log(`   ${index + 1}. ${video.title} (${video.videoId})`);
                });
            } catch (error) {
                console.error('❌ localStorage data is corrupted:', error);
            }
        } else {
            console.log('⚠️ No videos in localStorage (empty or new system)');
        }
        
        // ตรวจสอบ update signal
        const signal = localStorage.getItem(this.updateSignalKey);
        console.log(`🔄 Update signal: ${signal || 'None'}`);
    }
    
    checkFormElements() {
        console.log('📝 Checking form elements...');
        
        const form = document.getElementById('videoForm');
        const urlInput = document.getElementById('videoUrl');
        const titleInput = document.getElementById('title');
        const studentInput = document.getElementById('studentName');
        const categorySelect = document.getElementById('category');
        const descInput = document.getElementById('description');
        
        console.log('Form elements status:');
        console.log(`   - Form: ${form ? '✅ Found' : '❌ Missing'}`);
        console.log(`   - URL Input: ${urlInput ? '✅ Found' : '❌ Missing'}`);
        console.log(`   - Title Input: ${titleInput ? '✅ Found' : '❌ Missing'}`);
        console.log(`   - Student Input: ${studentInput ? '✅ Found' : '❌ Missing'}`);
        console.log(`   - Category Select: ${categorySelect ? '✅ Found' : '❌ Missing'}`);
        console.log(`   - Description Input: ${descInput ? '✅ Found' : '❌ Missing'}`);
        
        if (urlInput) {
            console.log(`   - Current URL: "${urlInput.value}"`);
        }
    }
    
    testVideoIdExtraction() {
        console.log('🎬 Testing Video ID extraction...');
        
        const testUrls = [
            'https://www.youtube.com/watch?v=aqCBD2qg7b8',
            'https://youtu.be/aqCBD2qg7b8',
            'https://www.youtube.com/embed/aqCBD2qg7b8',
            'aqCBD2qg7b8',
            'https://www.youtube.com/watch?v=aqCBD2qg7b8&t=123',
            'invalid-url'
        ];
        
        testUrls.forEach(url => {
            const videoId = this.extractVideoId(url);
            const status = videoId ? '✅' : '❌';
            console.log(`   ${status} "${url}" → "${videoId || 'INVALID'}"`);
        });
        
        // ทดสอบกับ URL ที่ผู้ใช้ใส่ (ถ้ามี)
        const urlInput = document.getElementById('videoUrl');
        if (urlInput && urlInput.value.trim()) {
            const userUrl = urlInput.value.trim();
            const userVideoId = this.extractVideoId(userUrl);
            console.log(`🎯 User URL: "${userUrl}" → "${userVideoId || 'INVALID'}"`);
        }
    }
    
    extractVideoId(url) {
        if (!url) return null;
        
        // ถ้าเป็น Video ID อยู่แล้ว
        if (url.length === 11 && /^[a-zA-Z0-9_-]+$/.test(url)) {
            return url;
        }
        
        // แยกจาก URL รูปแบบต่างๆ
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
            /^([a-zA-Z0-9_-]{11})$/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        return null;
    }
    
    checkEventListeners() {
        console.log('👂 Checking event listeners...');
        
        const form = document.getElementById('videoForm');
        if (form) {
            // ลองเพิ่ม event listener ชั่วคราวเพื่อทดสอบ
            const testListener = (e) => {
                console.log('📝 Form submission detected!');
                console.log('Form data:', new FormData(e.target));
            };
            
            form.addEventListener('submit', testListener);
            console.log('✅ Test event listener added to form');
            
            // ลบหลังจาก 10 วินาที
            setTimeout(() => {
                form.removeEventListener('submit', testListener);
                console.log('🗑️ Test event listener removed');
            }, 10000);
        } else {
            console.log('❌ Cannot add event listener - form not found');
        }
    }
    
    testDataSaving() {
        console.log('💾 Testing data saving mechanism...');
        
        const testVideo = {
            id: 'test_' + Date.now(),
            title: 'Video Test Debug',
            description: 'Test video for debugging',
            studentName: 'Debug System',
            category: 'animation',
            videoId: 'aqCBD2qg7b8',
            url: 'https://www.youtube.com/watch?v=aqCBD2qg7b8',
            createdAt: new Date().toISOString()
        };
        
        try {
            // อ่านข้อมูลเดิม
            const existingData = localStorage.getItem(this.storageKey);
            const videos = existingData ? JSON.parse(existingData) : [];
            
            // เพิ่มวิดีโอทดสอบ
            videos.push(testVideo);
            
            // บันทึกข้อมูล
            localStorage.setItem(this.storageKey, JSON.stringify(videos));
            localStorage.setItem(this.updateSignalKey, Date.now().toString());
            
            console.log('✅ Test video saved successfully');
            console.log('🎬 Test video details:', testVideo);
            
            // ลบวิดีโอทดสอบหลังจาก 5 วินาที
            setTimeout(() => {
                this.removeTestVideo(testVideo.id);
            }, 5000);
            
        } catch (error) {
            console.error('❌ Error saving test video:', error);
        }
    }
    
    removeTestVideo(testId) {
        try {
            const existingData = localStorage.getItem(this.storageKey);
            const videos = existingData ? JSON.parse(existingData) : [];
            
            const filteredVideos = videos.filter(v => v.id !== testId);
            localStorage.setItem(this.storageKey, JSON.stringify(filteredVideos));
            localStorage.setItem(this.updateSignalKey, Date.now().toString());
            
            console.log('🗑️ Test video removed successfully');
        } catch (error) {
            console.error('❌ Error removing test video:', error);
        }
    }
    
    // ฟังก์ชันช่วยผู้ใช้เพิ่มวิดีโอด้วยตนเอง
    addVideoManually(url, title, studentName, description = '', category = 'animation') {
        console.log('➕ Adding video manually...');
        
        const videoId = this.extractVideoId(url);
        if (!videoId) {
            console.error('❌ Invalid YouTube URL:', url);
            return false;
        }
        
        const newVideo = {
            id: Date.now().toString(),
            title: title,
            description: description,
            studentName: studentName,
            category: category,
            videoId: videoId,
            url: url,
            createdAt: new Date().toISOString()
        };
        
        try {
            const existingData = localStorage.getItem(this.storageKey);
            const videos = existingData ? JSON.parse(existingData) : [];
            
            // ตรวจสอบ duplicate
            if (videos.find(v => v.videoId === videoId)) {
                console.error('❌ Video already exists:', videoId);
                return false;
            }
            
            videos.push(newVideo);
            localStorage.setItem(this.storageKey, JSON.stringify(videos));
            localStorage.setItem(this.updateSignalKey, Date.now().toString());
            
            console.log('✅ Video added successfully:', newVideo);
            return true;
            
        } catch (error) {
            console.error('❌ Error adding video:', error);
            return false;
        }
    }
    
    // ลบวิดีโอทั้งหมด (สำหรับ reset)
    clearAllVideos() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.updateSignalKey);
        console.log('🗑️ All videos cleared from localStorage');
    }
    
    // ดูสถานะปัจจุบัน
    getCurrentStatus() {
        const status = {
            hasLocalStorage: !!localStorage.getItem(this.storageKey),
            videoCount: 0,
            lastUpdate: localStorage.getItem(this.updateSignalKey),
            formExists: !!document.getElementById('videoForm')
        };
        
        if (status.hasLocalStorage) {
            try {
                const videos = JSON.parse(localStorage.getItem(this.storageKey));
                status.videoCount = videos.length;
            } catch (e) {
                status.videoCount = 'ERROR';
            }
        }
        
        return status;
    }
}

// สร้าง instance และ expose functions
const adminDebugger = new AdminVideoDebugger();

// ทำให้ functions สามารถเรียกใช้ได้จาก console
window.debugAdminVideo = () => adminDebugger.debugVideoAddition();
window.addVideoManually = (url, title, student, desc, cat) => 
    adminDebugger.addVideoManually(url, title, student, desc, cat);
window.clearAllVideos = () => adminDebugger.clearAllVideos();
window.getAdminStatus = () => adminDebugger.getCurrentStatus();

// Auto-run debug ถ้าอยู่ในหน้า admin
if (window.location.pathname.includes('admin.html')) {
    setTimeout(() => {
        console.log('🚀 Auto-running admin debug...');
        adminDebugger.debugVideoAddition();
    }, 2000);
}

console.log('🛠️ Admin Video Debug Tool loaded');
console.log('💡 Available commands:');
console.log('   - debugAdminVideo() - Run full debug check');
console.log('   - addVideoManually(url, title, student, desc, category) - Add video manually');
console.log('   - clearAllVideos() - Clear all videos');
console.log('   - getAdminStatus() - Get current status');