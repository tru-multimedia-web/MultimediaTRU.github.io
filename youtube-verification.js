// ================================================================
// YOUTUBE ERROR 153 VERIFICATION - ตรวจสอบการแก้ไขทั้งหมด
// ================================================================

console.log('🔍 YouTube Error 153 Full Verification Starting...');

class YouTubeErrorChecker {
    constructor() {
        this.problemsFound = [];
        this.fixedCount = 0;
        this.totalIframes = 0;
    }
    
    async runFullCheck() {
        console.log('🚀 Starting comprehensive YouTube Error 153 check...');
        
        // 1. Check all current iframes
        this.checkCurrentIframes();
        
        // 2. Check localStorage data
        this.checkStorageData();
        
        // 3. Test dynamic loading
        await this.testDynamicLoading();
        
        // 4. Generate report
        this.generateReport();
        
        return this.problemsFound.length === 0;
    }
    
    checkCurrentIframes() {
        console.log('📺 Checking current iframes...');
        
        const iframes = document.querySelectorAll('iframe[src*="youtube.com/embed"]');
        this.totalIframes = iframes.length;
        
        console.log(`Found ${this.totalIframes} YouTube iframes to check`);
        
        iframes.forEach((iframe, index) => {
            const problems = this.analyzeIframe(iframe, index + 1);
            if (problems.length === 0) {
                this.fixedCount++;
                console.log(`✅ Iframe ${index + 1}: No Error 153 issues`);
            } else {
                console.log(`❌ Iframe ${index + 1}: Found issues:`, problems);
                this.problemsFound.push(...problems.map(p => `Iframe ${index + 1}: ${p}`));
            }
        });
    }
    
    analyzeIframe(iframe, number) {
        const problems = [];
        const src = iframe.src;
        
        // Check for problematic parameters
        if (src.includes('enablejsapi=1')) {
            problems.push('Contains enablejsapi=1 (main cause of Error 153)');
        }
        
        if (src.includes('showinfo=0')) {
            problems.push('Contains deprecated showinfo=0 parameter');
        }
        
        if (src.includes('autoplay=1')) {
            problems.push('Contains autoplay=1 in URL (can cause issues)');
        }
        
        // Check for too many parameters
        const paramCount = (src.match(/[?&]/g) || []).length;
        if (paramCount > 10) {
            problems.push(`Too many URL parameters (${paramCount})`);
        }
        
        // Check for missing attributes
        if (!iframe.hasAttribute('title')) {
            problems.push('Missing title attribute');
        }
        
        if (!iframe.hasAttribute('width') && !iframe.style.width) {
            problems.push('Missing width specification');
        }
        
        if (!iframe.hasAttribute('height') && !iframe.style.height) {
            problems.push('Missing height specification');
        }
        
        // Check allow policy
        const allow = iframe.getAttribute('allow') || '';
        if (allow.includes('autoplay')) {
            problems.push('Allow policy includes autoplay (can cause conflicts)');
        }
        
        return problems;
    }
    
    checkStorageData() {
        console.log('💾 Checking localStorage video data...');
        
        const stored = localStorage.getItem('multimedia_videos');
        if (!stored) {
            console.log('ℹ️ No videos in localStorage (will use default videos)');
            return;
        }
        
        try {
            const videos = JSON.parse(stored);
            console.log(`📊 Found ${videos.length} videos in localStorage`);
            
            videos.forEach((video, index) => {
                if (video.url && (video.url.includes('enablejsapi=1') || video.url.includes('showinfo=0'))) {
                    this.problemsFound.push(`Storage video ${index + 1}: Contains problematic URL parameters`);
                }
            });
        } catch (error) {
            this.problemsFound.push('Storage data is corrupted');
            console.error('❌ Error parsing localStorage:', error);
        }
    }
    
    async testDynamicLoading() {
        console.log('🔄 Testing dynamic video loading...');
        
        return new Promise((resolve) => {
            // Simulate dynamic loading
            setTimeout(() => {
                const newIframes = document.querySelectorAll('iframe[src*="youtube.com/embed"]');
                if (newIframes.length > this.totalIframes) {
                    console.log(`📈 New iframes detected: ${newIframes.length - this.totalIframes}`);
                    
                    // Check new iframes
                    for (let i = this.totalIframes; i < newIframes.length; i++) {
                        const problems = this.analyzeIframe(newIframes[i], i + 1);
                        if (problems.length > 0) {
                            this.problemsFound.push(...problems.map(p => `New iframe ${i + 1}: ${p}`));
                        }
                    }
                }
                resolve();
            }, 1000);
        });
    }
    
    generateReport() {
        console.log('📋 Generating verification report...');
        
        const report = {
            totalIframes: this.totalIframes,
            fixedIframes: this.fixedCount,
            problemsFound: this.problemsFound.length,
            problems: this.problemsFound,
            isError153Free: this.problemsFound.length === 0,
            successRate: Math.round((this.fixedCount / Math.max(this.totalIframes, 1)) * 100)
        };
        
        console.log('📊 YOUTUBE ERROR 153 VERIFICATION REPORT:');
        console.log('═══════════════════════════════════════════');
        console.log(`🎬 Total YouTube iframes: ${report.totalIframes}`);
        console.log(`✅ Error 153 free iframes: ${report.fixedIframes}`);
        console.log(`❌ Iframes with issues: ${report.problemsFound}`);
        console.log(`📈 Success rate: ${report.successRate}%`);
        console.log('═══════════════════════════════════════════');
        
        if (report.isError153Free) {
            console.log('🎉 SUCCESS: All YouTube iframes are Error 153 free!');
            console.log('✅ No YouTube Error 153 issues detected');
        } else {
            console.log('⚠️ ISSUES FOUND: Some iframes still have Error 153 risks');
            console.log('📋 Problems detected:');
            report.problems.forEach((problem, index) => {
                console.log(`   ${index + 1}. ${problem}`);
            });
        }
        
        // Store report for external access
        window.youtubeError153Report = report;
        
        return report;
    }
    
    // Quick fix method for any remaining issues
    fixRemainingIssues() {
        console.log('🔧 Attempting to fix remaining Error 153 issues...');
        
        const iframes = document.querySelectorAll('iframe[src*="youtube.com/embed"]');
        let fixedNow = 0;
        
        iframes.forEach((iframe, index) => {
            const originalSrc = iframe.src;
            
            // Check if needs fixing
            if (originalSrc.includes('enablejsapi=1') || originalSrc.includes('showinfo=0')) {
                const videoId = this.extractVideoId(originalSrc);
                if (videoId) {
                    const fixedSrc = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&fs=1&cc_load_policy=0&iv_load_policy=3`;
                    iframe.src = fixedSrc;
                    
                    // Add proper attributes
                    iframe.setAttribute('frameborder', '0');
                    iframe.setAttribute('allowfullscreen', '');
                    iframe.setAttribute('allow', 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                    iframe.setAttribute('loading', 'lazy');
                    iframe.setAttribute('width', '100%');
                    iframe.setAttribute('height', '315');
                    
                    if (!iframe.hasAttribute('title')) {
                        iframe.setAttribute('title', `YouTube Video ${index + 1}`);
                    }
                    
                    fixedNow++;
                    console.log(`🔧 Fixed iframe ${index + 1}: ${originalSrc} → ${fixedSrc}`);
                }
            }
        });
        
        if (fixedNow > 0) {
            console.log(`✅ Fixed ${fixedNow} additional iframes`);
        } else {
            console.log('ℹ️ No additional fixes needed');
        }
        
        return fixedNow;
    }
    
    extractVideoId(url) {
        const patterns = [
            /\/embed\/([a-zA-Z0-9_-]{11})/,
            /[?&]v=([a-zA-Z0-9_-]{11})/,
            /\/([a-zA-Z0-9_-]{11})\?/,
            /\/([a-zA-Z0-9_-]{11})$/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        return null;
    }
}

// Create global checker instance
const youtubeChecker = new YouTubeErrorChecker();

// Auto-run verification on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(async () => {
        console.log('🔍 Auto-running YouTube Error 153 verification...');
        const isFixed = await youtubeChecker.runFullCheck();
        
        if (isFixed) {
            console.log('🎉 All YouTube Error 153 issues have been resolved!');
        } else {
            console.log('⚠️ Some Error 153 issues remain. Run fixRemainingIssues() to auto-fix.');
        }
    }, 2000);
});

// Make functions available globally
window.verifyYouTubeError153Fix = () => youtubeChecker.runFullCheck();
window.fixRemainingYouTubeIssues = () => youtubeChecker.fixRemainingIssues();
window.getYouTubeError153Report = () => window.youtubeError153Report;

console.log('🛠️ YouTube Error 153 Verification System loaded');
console.log('💡 Available commands:');
console.log('   - verifyYouTubeError153Fix() - Run full verification');
console.log('   - fixRemainingYouTubeIssues() - Fix any remaining issues');
console.log('   - getYouTubeError153Report() - Get latest report');