// 🚨 YouTube Video Fix Script - แก้ปัญหา "ดูวิดีโอไม่ได้ ดูบน YouTube"
// สำหรับแก้ไขปัญหาการแสดงวิดีโอ YouTube ในเว็บไซต์

(function() {
    'use strict';
    
    console.log('🚨 YouTube Video Fix Script Loading...');
    
    // ========== การตั้งค่าหลัก ==========
    const FIX_CONFIG = {
        // Domain ที่ปลอดภัย
        SAFE_DOMAIN: 'www.youtube-nocookie.com',
        
        // Parameters ที่ปลอดภัย
        SAFE_PARAMETERS: [
            'rel=0',                    // ไม่แสดงวิดีโอที่เกี่ยวข้อง
            'modestbranding=1',         // ลด YouTube branding
            'controls=1',               // แสดงปุ่มควบคุม
            'fs=1',                     // อนุญาต fullscreen
            'cc_load_policy=0',         // ไม่เปิด subtitle อัตโนมัติ
            'iv_load_policy=3'          // ปิด annotations
        ],
        
        // Parameters ที่ต้องลบ (ทำให้เกิดปัญหา)
        PROBLEMATIC_PARAMETERS: [
            'enablejsapi=1',            // ทำให้เกิด Error 153
            'showinfo=0',               // Deprecated
            'autoplay=1',               // อาจถูกบล็อก
            'start=0'                   // ไม่จำเป็น
        ],
        
        // เวลารอในการแก้ไข (milliseconds)
        FIX_DELAY: 1000,
        
        // จำนวนครั้งที่พยายามแก้ไข
        MAX_RETRY: 3
    };
    
    // ========== ตัวแปรติดตามสถานะ ==========
    let fixAttempts = 0;
    let fixedVideos = 0;
    let problematicVideos = [];
    
    // ========== ฟังก์ชันหลัก ==========
    
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
     * สร้าง YouTube URL ที่ปลอดภัย
     */
    function createSafeYouTubeUrl(videoId, additionalParams = {}) {
        if (!videoId) return null;
        
        const baseUrl = `https://${FIX_CONFIG.SAFE_DOMAIN}/embed/${videoId}`;
        const allParams = [...FIX_CONFIG.SAFE_PARAMETERS];
        
        // เพิ่ม parameters เพิ่มเติม
        Object.entries(additionalParams).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                allParams.push(`${key}=${value}`);
            }
        });
        
        // เพิ่ม origin สำหรับความปลอดภัย
        allParams.push(`origin=${encodeURIComponent(window.location.origin)}`);
        
        return `${baseUrl}?${allParams.join('&')}`;
    }
    
    /**
     * ตรวจสอบว่า iframe มีปัญหาหรือไม่
     */
    function hasProblematicParameters(url) {
        return FIX_CONFIG.PROBLEMATIC_PARAMETERS.some(param => url.includes(param));
    }
    
    /**
     * แก้ไข iframe ตัวเดียว
     */
    function fixSingleIframe(iframe, index) {
        const originalSrc = iframe.src;
        const videoId = extractVideoId(originalSrc);
        
        if (!videoId) {
            console.warn(`⚠️ ไม่สามารถแยก Video ID จาก: ${originalSrc}`);
            return false;
        }
        
        // สร้าง URL ใหม่ที่ปลอดภัย
        const newSrc = createSafeYouTubeUrl(videoId);
        
        if (newSrc && newSrc !== originalSrc) {
            iframe.src = newSrc;
            
            // เพิ่ม attributes สำคัญ
            iframe.setAttribute('loading', 'lazy');
            iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
            
            // เพิ่ม allow attributes ที่จำเป็น
            iframe.setAttribute('allow', 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
            
            console.log(`✅ แก้ไขวิดีโอ ${index + 1}: ${videoId}`);
            console.log(`   เดิม: ${originalSrc}`);
            console.log(`   ใหม่: ${newSrc}`);
            
            // เพิ่ม error handling
            addIframeErrorHandling(iframe, videoId, index);
            
            return true;
        }
        
        return false;
    }
    
    /**
     * เพิ่ม error handling ให้ iframe
     */
    function addIframeErrorHandling(iframe, videoId, index) {
        // ลบ event listeners เดิมก่อน (ถ้ามี)
        iframe.removeEventListener('error', iframe._errorHandler);
        iframe.removeEventListener('load', iframe._loadHandler);
        
        // Error handler
        iframe._errorHandler = function() {
            console.error(`❌ วิดีโอ ${index + 1} (${videoId}) โหลดไม่ได้`);
            problematicVideos.push({ videoId, index, error: 'Load failed' });
            
            // สร้าง fallback
            createFallbackElement(this, videoId);
        };
        
        // Load handler
        iframe._loadHandler = function() {
            console.log(`✅ วิดีโอ ${index + 1} (${videoId}) โหลดสำเร็จ`);
        };
        
        iframe.addEventListener('error', iframe._errorHandler);
        iframe.addEventListener('load', iframe._loadHandler);
    }
    
    /**
     * สร้าง fallback element เมื่อวิดีโอโหลดไม่ได้
     */
    function createFallbackElement(iframe, videoId) {
        const fallbackDiv = document.createElement('div');
        fallbackDiv.className = 'youtube-fallback';
        fallbackDiv.style.cssText = `
            padding: 40px 20px;
            text-align: center;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border: 2px dashed #6c757d;
            border-radius: 8px;
            color: #495057;
            font-family: Arial, sans-serif;
        `;
        
        fallbackDiv.innerHTML = `
            <div style="margin-bottom: 15px;">
                <span style="font-size: 48px;">📺</span>
            </div>
            <h4 style="margin: 0 0 10px 0; color: #dc3545;">วิดีโอไม่สามารถแสดงได้</h4>
            <p style="margin: 0 0 15px 0; font-size: 14px;">วิดีโอนี้อาจถูกจำกัดการแสดงผลใน iframe</p>
            <a href="https://www.youtube.com/watch?v=${videoId}" 
               target="_blank" 
               style="
                   display: inline-block;
                   padding: 8px 16px;
                   background: #ff0000;
                   color: white;
                   text-decoration: none;
                   border-radius: 4px;
                   font-weight: bold;
               "
               onmouseover="this.style.background='#cc0000'"
               onmouseout="this.style.background='#ff0000'">
                🎬 ดูบน YouTube
            </a>
        `;
        
        // แทนที่ iframe ด้วย fallback
        if (iframe.parentNode) {
            iframe.parentNode.replaceChild(fallbackDiv, iframe);
        }
    }
    
    /**
     * แก้ไขวิดีโอทั้งหมด
     */
    function fixAllYouTubeVideos() {
        console.log('🔧 เริ่มแก้ไขวิดีโอ YouTube ทั้งหมด...');
        
        const iframes = document.querySelectorAll('iframe[src*="youtube"]');
        
        if (iframes.length === 0) {
            console.log('ℹ️ ไม่พบ YouTube iframe ในหน้านี้');
            return { fixed: 0, total: 0 };
        }
        
        console.log(`📊 พบ YouTube iframe จำนวน: ${iframes.length}`);
        
        fixedVideos = 0;
        problematicVideos = [];
        
        iframes.forEach((iframe, index) => {
            try {
                const fixed = fixSingleIframe(iframe, index);
                if (fixed) fixedVideos++;
            } catch (error) {
                console.error(`❌ ข้อผิดพลาดในการแก้ไขวิดีโอ ${index + 1}:`, error);
                problematicVideos.push({ 
                    index, 
                    error: error.message,
                    videoId: extractVideoId(iframe.src)
                });
            }
        });
        
        // สรุปผล
        console.log(`✅ แก้ไขเสร็จสิ้น: ${fixedVideos}/${iframes.length} วิดีโอ`);
        
        if (problematicVideos.length > 0) {
            console.warn(`⚠️ วิดีโอที่มีปัญหา:`, problematicVideos);
        }
        
        return { 
            fixed: fixedVideos, 
            total: iframes.length, 
            problems: problematicVideos 
        };
    }
    
    /**
     * ตรวจสอบและแก้ไขวิดีโอใหม่ที่เพิ่มเข้ามา
     */
    function watchForNewVideos() {
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
            
            if (hasNewVideos) {
                console.log('🔄 ตรวจพบวิดีโอ YouTube ใหม่ กำลังแก้ไข...');
                setTimeout(fixAllYouTubeVideos, 500);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👁️ เริ่มติดตามวิดีโอใหม่...');
    }
    
    /**
     * ฟังก์ชันสำหรับตรวจสอบสถานะ
     */
    function getFixStatus() {
        const iframes = document.querySelectorAll('iframe[src*="youtube"]');
        const problematic = Array.from(iframes).filter(iframe => 
            hasProblematicParameters(iframe.src) || 
            !iframe.src.includes(FIX_CONFIG.SAFE_DOMAIN)
        );
        
        return {
            total: iframes.length,
            fixed: iframes.length - problematic.length,
            problematic: problematic.length,
            problems: problematicVideos
        };
    }
    
    /**
     * ฟังก์ชันสำหรับ manual fix
     */
    function manualFix() {
        fixAttempts++;
        console.log(`🔧 Manual Fix ครั้งที่ ${fixAttempts}...`);
        return fixAllYouTubeVideos();
    }
    
    // ========== การรันอัตโนมัติ ==========
    
    /**
     * เริ่มต้นระบบแก้ไข
     */
    function initializeYouTubeFix() {
        console.log('🚀 เริ่มต้นระบบแก้ไข YouTube Video...');
        
        // แก้ไขวิดีโอที่มีอยู่แล้ว
        setTimeout(() => {
            const result = fixAllYouTubeVideos();
            
            // ตั้งค่าการติดตามวิดีโอใหม่
            watchForNewVideos();
            
            // แสดงสถานะ
            console.log('📊 สถานะการแก้ไข:', getFixStatus());
            
        }, FIX_CONFIG.FIX_DELAY);
    }
    
    // ========== Global Functions ==========
    
    // ทำให้ฟังก์ชันสำคัญเข้าถึงได้จากภายนอก
    window.YouTubeVideoFix = {
        fix: manualFix,
        status: getFixStatus,
        config: FIX_CONFIG,
        createSafeUrl: createSafeYouTubeUrl,
        extractVideoId: extractVideoId
    };
    
    // ========== Event Listeners ==========
    
    // รันเมื่อ DOM พร้อม
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeYouTubeFix);
    } else {
        initializeYouTubeFix();
    }
    
    // รันเมื่อหน้าโหลดเสร็จ
    window.addEventListener('load', () => {
        setTimeout(() => {
            console.log('🔄 ตรวจสอบหลังโหลดหน้าเสร็จ...');
            const status = getFixStatus();
            if (status.problematic > 0) {
                console.log('⚠️ ยังมีวิดีโอที่มีปัญหา กำลังแก้ไขซ้ำ...');
                manualFix();
            }
        }, 2000);
    });
    
    console.log('✅ YouTube Video Fix Script Loaded Successfully!');
    
})();