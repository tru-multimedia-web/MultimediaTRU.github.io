// 🔒 Private Video Handler - จัดการวิดีโอ Private และไม่สามารถเข้าถึงได้
// รองรับกรณี "This video is private", "Video unavailable", "Deleted video" และอื่นๆ

(function() {
    'use strict';
    
    console.log('🔒 Private Video Handler Loading...');
    
    // ========== การตั้งค่าหลัก ==========
    const PRIVATE_VIDEO_CONFIG = {
        // เวลารอในการตรวจสอบ (milliseconds)
        CHECK_DELAY: 3000,
        
        // จำนวนครั้งที่พยายามตรวจสอบ
        MAX_CHECK_ATTEMPTS: 3,
        
        // เวลารอระหว่างการตรวจสอบแต่ละครั้ง
        RETRY_DELAY: 2000,
        
        // ข้อความที่แสดงว่าวิดีโอมีปัญหา
        ERROR_INDICATORS: [
            'private',
            'unavailable', 
            'deleted',
            'removed',
            'blocked',
            'restricted',
            'not available',
            'does not exist',
            'ไม่สามารถใช้งานได้',
            'วิดีโอส่วนตัว',
            'ถูกลบ',
            'ไม่พบ'
        ],
        
        // URL สำรองสำหรับทดสอบ (วิดีโอสาธารณะที่มั่นใจว่ามีอยู่)
        FALLBACK_VIDEO_IDS: [
            'aqCBD2qg7b8',  // Sample video 1
            'ScMzIvxBSi4',  // Sample video 2  
            'jNQXAC9IVRw'   // Sample video 3
        ]
    };
    
    // ========== ตัวแปรติดตามสถานะ ==========
    let privateVideos = [];
    let checkAttempts = 0;
    let isChecking = false;
    
    // ========== ฟังก์ชันหลัก ==========
    
    /**
     * ตรวจสอบว่า iframe มีปัญหาเกี่ยวกับ private video หรือไม่
     */
    function detectPrivateVideoIssues(iframe) {
        return new Promise((resolve) => {
            const videoId = extractVideoId(iframe.src);
            if (!videoId) {
                resolve({ isPrivate: false, videoId: null, issue: 'No video ID' });
                return;
            }
            
            // ตรวจสอบโดยใช้ iframe content (ไม่สามารถเข้าถึงได้โดยตรงเนื่องจาก CORS)
            // แต่สามารถตรวจสอบจาก error events และ API
            
            let hasError = false;
            let errorType = '';
            
            // เพิ่ม error listener
            const errorHandler = () => {
                hasError = true;
                errorType = 'Load Error';
            };
            
            iframe.addEventListener('error', errorHandler, { once: true });
            
            // ทดสอบผ่าน YouTube API (oEmbed)
            testVideoAvailability(videoId)
                .then(result => {
                    iframe.removeEventListener('error', errorHandler);
                    resolve({
                        isPrivate: result.isPrivate,
                        videoId: videoId,
                        issue: result.issue,
                        apiResponse: result.apiResponse
                    });
                })
                .catch(error => {
                    iframe.removeEventListener('error', errorHandler);
                    resolve({
                        isPrivate: true,
                        videoId: videoId,
                        issue: 'API Error: ' + error.message,
                        apiResponse: null
                    });
                });
        });
    }
    
    /**
     * ทดสอบความพร้อมใช้งานของวิดีโอผ่าน YouTube API
     */
    async function testVideoAvailability(videoId) {
        try {
            // ใช้ oEmbed API เพื่อตรวจสอบ
            const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
            const response = await fetch(oEmbedUrl);
            
            if (response.ok) {
                const data = await response.json();
                return {
                    isPrivate: false,
                    issue: null,
                    apiResponse: data
                };
            } else if (response.status === 401 || response.status === 403) {
                return {
                    isPrivate: true,
                    issue: 'Private or Restricted Video',
                    apiResponse: null
                };
            } else if (response.status === 404) {
                return {
                    isPrivate: true,
                    issue: 'Video Not Found or Deleted',
                    apiResponse: null
                };
            } else {
                return {
                    isPrivate: true,
                    issue: `HTTP ${response.status}`,
                    apiResponse: null
                };
            }
        } catch (error) {
            // ถ้า fetch ไม่สำเร็จ อาจเป็นเพราะ CORS หรือ network issue
            return {
                isPrivate: true,
                issue: 'Network or CORS Error',
                apiResponse: null
            };
        }
    }
    
    /**
     * สร้าง fallback element สำหรับวิดีโอ private
     */
    function createPrivateVideoFallback(videoId, issue, originalTitle) {
        const fallbackDiv = document.createElement('div');
        fallbackDiv.className = 'private-video-fallback';
        fallbackDiv.style.cssText = `
            padding: 40px 20px;
            text-align: center;
            background: linear-gradient(135deg, #6c757d, #495057);
            border: 2px solid #dee2e6;
            border-radius: 12px;
            color: #ffffff;
            font-family: Arial, sans-serif;
            min-height: 315px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
            overflow: hidden;
        `;
        
        // เพิ่ม background pattern
        const pattern = document.createElement('div');
        pattern.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255,255,255,0.1) 10px,
                rgba(255,255,255,0.1) 20px
            );
            pointer-events: none;
        `;
        fallbackDiv.appendChild(pattern);
        
        // เนื้อหาหลัก
        const content = document.createElement('div');
        content.style.cssText = `
            position: relative;
            z-index: 1;
        `;
        
        // ไอคอน
        const icon = document.createElement('div');
        icon.style.cssText = `
            font-size: 64px;
            margin-bottom: 20px;
            opacity: 0.8;
        `;
        
        // เลือกไอคอนตาม issue
        let iconEmoji = '🔒';
        let titleText = 'วิดีโอไม่สามารถเข้าถึงได้';
        let descText = 'วิดีโอนี้อาจเป็นวิดีโอส่วนตัวหรือถูกจำกัดการเข้าถึง';
        
        if (issue && issue.includes('Not Found')) {
            iconEmoji = '❌';
            titleText = 'ไม่พบวิดีโอ';
            descText = 'วิดีโอนี้อาจถูกลบหรือย้ายแล้ว';
        } else if (issue && issue.includes('Deleted')) {
            iconEmoji = '🗑️';
            titleText = 'วิดีโอถูกลบ';
            descText = 'วิดีโอนี้ถูกลบโดยเจ้าของหรือ YouTube';
        } else if (issue && issue.includes('Restricted')) {
            iconEmoji = '⛔';
            titleText = 'วิดีโอถูกจำกัด';
            descText = 'วิดีโอนี้ถูกจำกัดการเข้าถึงในพื้นที่นี้';
        } else if (issue && issue.includes('Private')) {
            iconEmoji = '🔒';
            titleText = 'วิดีโอส่วนตัว';
            descText = 'วิดีโอนี้ถูกตั้งค่าเป็นส่วนตัวโดยเจ้าของ';
        }
        
        icon.textContent = iconEmoji;
        
        const title = document.createElement('h4');
        title.style.cssText = `
            margin: 0 0 15px 0;
            color: #ffffff;
            font-size: 20px;
            font-weight: bold;
        `;
        title.textContent = titleText;
        
        const description = document.createElement('p');
        description.style.cssText = `
            margin: 0 0 20px 0;
            font-size: 14px;
            opacity: 0.9;
            line-height: 1.5;
        `;
        description.textContent = descText;
        
        // ข้อมูลวิดีโอ
        if (originalTitle) {
            const originalTitleEl = document.createElement('p');
            originalTitleEl.style.cssText = `
                margin: 0 0 15px 0;
                font-size: 12px;
                opacity: 0.7;
                font-style: italic;
            `;
            originalTitleEl.textContent = `ชื่อเดิม: ${originalTitle}`;
            content.appendChild(originalTitleEl);
        }
        
        const videoIdEl = document.createElement('p');
        videoIdEl.style.cssText = `
            margin: 0 0 20px 0;
            font-size: 12px;
            opacity: 0.7;
            font-family: monospace;
        `;
        videoIdEl.textContent = `Video ID: ${videoId}`;
        
        // ปุ่มลองดูบน YouTube
        const tryButton = document.createElement('a');
        tryButton.href = `https://www.youtube.com/watch?v=${videoId}`;
        tryButton.target = '_blank';
        tryButton.style.cssText = `
            display: inline-block;
            padding: 10px 20px;
            background: linear-gradient(45deg, #ff0000, #cc0000);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 5px;
            transition: transform 0.2s;
        `;
        tryButton.textContent = '🔗 ลองเปิดบน YouTube';
        
        tryButton.addEventListener('mouseover', () => {
            tryButton.style.transform = 'translateY(-2px)';
        });
        tryButton.addEventListener('mouseout', () => {
            tryButton.style.transform = 'translateY(0)';
        });
        
        // ปุ่มรีเฟรช
        const refreshButton = document.createElement('button');
        refreshButton.style.cssText = `
            padding: 10px 20px;
            background: linear-gradient(45deg, #28a745, #20c997);
            color: white;
            border: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 5px;
            cursor: pointer;
            transition: transform 0.2s;
        `;
        refreshButton.textContent = '🔄 ลองใหม่';
        
        refreshButton.addEventListener('click', () => {
            location.reload();
        });
        
        refreshButton.addEventListener('mouseover', () => {
            refreshButton.style.transform = 'translateY(-2px)';
        });
        refreshButton.addEventListener('mouseout', () => {
            refreshButton.style.transform = 'translateY(0)';
        });
        
        // รวมทุกอย่าง
        content.appendChild(icon);
        content.appendChild(title);
        content.appendChild(description);
        content.appendChild(videoIdEl);
        content.appendChild(tryButton);
        content.appendChild(refreshButton);
        
        fallbackDiv.appendChild(content);
        
        return fallbackDiv;
    }
    
    /**
     * แทนที่ iframe ด้วย fallback element
     */
    function replaceWithFallback(iframe, videoId, issue, originalTitle) {
        const fallback = createPrivateVideoFallback(videoId, issue, originalTitle);
        
        // รักษาขนาดเดิม
        const width = iframe.getAttribute('width') || iframe.style.width || '100%';
        const height = iframe.getAttribute('height') || iframe.style.height || '315px';
        
        fallback.style.width = width;
        fallback.style.height = height;
        
        // แทนที่ iframe
        if (iframe.parentNode) {
            iframe.parentNode.replaceChild(fallback, iframe);
        }
        
        console.log(`🔒 แทนที่วิดีโอ private: ${videoId} (${issue})`);
    }
    
    /**
     * ตรวจสอบวิดีโอ private ทั้งหมด
     */
    async function checkAllPrivateVideos() {
        if (isChecking) {
            console.log('⚠️ กำลังตรวจสอบอยู่แล้ว...');
            return;
        }
        
        isChecking = true;
        checkAttempts++;
        
        console.log(`🔍 ตรวจสอบวิดีโอ private ครั้งที่ ${checkAttempts}...`);
        
        const iframes = document.querySelectorAll('iframe[src*="youtube"]');
        
        if (iframes.length === 0) {
            console.log('ℹ️ ไม่พบ YouTube iframe');
            isChecking = false;
            return { total: 0, private: 0, checked: 0 };
        }
        
        console.log(`📊 พบ YouTube iframe จำนวน: ${iframes.length}`);
        
        let privateCount = 0;
        let checkedCount = 0;
        privateVideos = [];
        
        // ตรวจสอบทีละตัว
        for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i];
            
            try {
                console.log(`   ${i + 1}. กำลังตรวจสอบ iframe ${i + 1}/${iframes.length}...`);
                
                const result = await detectPrivateVideoIssues(iframe);
                checkedCount++;
                
                if (result.isPrivate) {
                    privateCount++;
                    privateVideos.push({
                        videoId: result.videoId,
                        issue: result.issue,
                        iframe: iframe,
                        index: i + 1
                    });
                    
                    console.log(`   ❌ วิดีโอ private: ${result.videoId} (${result.issue})`);
                    
                    // แทนที่ด้วย fallback
                    const originalTitle = iframe.getAttribute('title') || '';
                    replaceWithFallback(iframe, result.videoId, result.issue, originalTitle);
                    
                } else {
                    console.log(`   ✅ วิดีโอปกติ: ${result.videoId}`);
                }
                
            } catch (error) {
                console.error(`   ❌ ข้อผิดพลาดในการตรวจสอบ iframe ${i + 1}:`, error);
                checkedCount++;
            }
            
            // รอสักครู่ก่อนตรวจสอบตัวถัดไป
            if (i < iframes.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
        // สรุปผล
        console.log(`✅ ตรวจสอบเสร็จสิ้น: ${checkedCount}/${iframes.length} วิดีโอ`);
        console.log(`🔒 พบวิดีโอ private: ${privateCount} วิดีโอ`);
        
        if (privateVideos.length > 0) {
            console.warn(`⚠️ วิดีโอที่มีปัญหา:`, privateVideos.map(v => ({
                videoId: v.videoId,
                issue: v.issue
            })));
        }
        
        isChecking = false;
        
        return {
            total: iframes.length,
            private: privateCount,
            checked: checkedCount,
            privateVideos: privateVideos
        };
    }
    
    /**
     * ตรวจสอบและแทนที่วิดีโอใหม่ที่เพิ่มเข้ามา
     */
    function watchForNewPrivateVideos() {
        const observer = new MutationObserver((mutations) => {
            let hasNewVideos = false;
            
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // ตรวจสอบ node เอง
                        if (node.tagName === 'IFRAME' && node.src && node.src.includes('youtube')) {
                            hasNewVideos = true;
                        }
                        
                        // ตรวจสอบ child nodes
                        const newIframes = node.querySelectorAll && node.querySelectorAll('iframe[src*="youtube"]');
                        if (newIframes && newIframes.length > 0) {
                            hasNewVideos = true;
                        }
                    }
                });
            });
            
            if (hasNewVideos && !isChecking) {
                console.log('🔄 ตรวจพบวิดีโอ YouTube ใหม่ กำลังตรวจสอบ private video...');
                setTimeout(checkAllPrivateVideos, 2000);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👁️ เริ่มติดตาม private video ใหม่...');
    }
    
    /**
     * ตรวจสอบวิดีโอที่โหลดจาก Dynamic Video System
     */
    function integrateDynamicVideoSystem() {
        // รอให้ระบบ dynamic video โหลดเสร็จก่อน
        setTimeout(() => {
            // ตรวจสอบว่ามี dynamic video system หรือไม่
            if (window.videoGalleryManager) {
                console.log('🔗 ผสานรวมกับ Dynamic Video System...');
                
                // Hook เข้ากับ video gallery manager
                const originalLoadVideos = window.videoGalleryManager.loadVideos;
                if (originalLoadVideos) {
                    window.videoGalleryManager.loadVideos = function(...args) {
                        const result = originalLoadVideos.apply(this, args);
                        
                        // ตรวจสอบ private video หลังจากโหลดวิดีโอใหม่
                        setTimeout(() => {
                            if (!isChecking) {
                                console.log('🔍 ตรวจสอบ private video หลังโหลด dynamic videos...');
                                checkAllPrivateVideos();
                            }
                        }, 3000);
                        
                        return result;
                    };
                }
            }
            
            // ตรวจสอบ localStorage changes
            const originalSetItem = localStorage.setItem;
            localStorage.setItem = function(key, value) {
                originalSetItem.apply(this, arguments);
                
                // ถ้ามีการเปลี่ยนแปลง video data
                if (key === 'multimedia_videos') {
                    console.log('🔄 ตรวจพบการเปลี่ยนแปลง video data...');
                    setTimeout(() => {
                        if (!isChecking) {
                            checkAllPrivateVideos();
                        }
                    }, 2000);
                }
            };
            
        }, 5000);
    }
    
    /**
     * แยก Video ID จาก YouTube URL
     */
    function extractVideoId(url) {
        const patterns = [
            /(?:embed\/|v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    }
    
    /**
     * ฟังก์ชันสำหรับตรวจสอบสถานะ
     */
    function getPrivateVideoStatus() {
        return {
            isChecking: isChecking,
            checkAttempts: checkAttempts,
            privateVideos: privateVideos,
            totalIframes: document.querySelectorAll('iframe[src*="youtube"]').length,
            fallbackElements: document.querySelectorAll('.private-video-fallback').length
        };
    }
    
    /**
     * ฟังก์ชันสำหรับ manual check
     */
    function manualCheckPrivateVideos() {
        if (isChecking) {
            console.log('⚠️ กำลังตรวจสอบอยู่แล้ว กรุณารอสักครู่...');
            return Promise.resolve(getPrivateVideoStatus());
        }
        
        console.log('🔍 เริ่มตรวจสอบ private video ด้วยตนเอง...');
        return checkAllPrivateVideos();
    }
    
    // ========== การรันอัตโนมัติ ==========
    
    /**
     * เริ่มต้นระบบตรวจสอบ private video
     */
    function initializePrivateVideoHandler() {
        console.log('🚀 เริ่มต้นระบบตรวจสอบ Private Video...');
        
        // ตรวจสอบวิดีโอที่มีอยู่แล้ว
        setTimeout(async () => {
            const result = await checkAllPrivateVideos();
            
            // ตั้งค่าการติดตามวิดีโอใหม่
            watchForNewPrivateVideos();
            
            // ผสานรวมกับระบบ dynamic video
            integrateDynamicVideoSystem();
            
            // แสดงสถานะ
            console.log('📊 สถานะการตรวจสอบ private video:', getPrivateVideoStatus());
            
        }, PRIVATE_VIDEO_CONFIG.CHECK_DELAY);
    }
    
    // ========== Global Functions ==========
    
    // ทำให้ฟังก์ชันสำคัญเข้าถึงได้จากภายนอก
    window.PrivateVideoHandler = {
        check: manualCheckPrivateVideos,
        status: getPrivateVideoStatus,
        config: PRIVATE_VIDEO_CONFIG,
        isChecking: () => isChecking,
        privateVideos: () => privateVideos
    };
    
    // ========== Event Listeners ==========
    
    // รันเมื่อ DOM พร้อม
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePrivateVideoHandler);
    } else {
        initializePrivateVideoHandler();
    }
    
    // รันเมื่อหน้าโหลดเสร็จ
    window.addEventListener('load', () => {
        setTimeout(async () => {
            console.log('🔄 ตรวจสอบ private video หลังโหลดหน้าเสร็จ...');
            const status = getPrivateVideoStatus();
            if (status.privateVideos.length > 0 && !isChecking) {
                console.log('⚠️ พบ private video ที่อาจพลาด กำลังตรวจสอบซ้ำ...');
                await manualCheckPrivateVideos();
            }
        }, 3000);
    });
    
    console.log('✅ Private Video Handler Loaded Successfully!');
    
})();