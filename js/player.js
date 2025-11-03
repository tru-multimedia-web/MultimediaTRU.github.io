document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoIndex = parseInt(urlParams.get('videoIndex'), 10);

    const playerFrame = document.getElementById('player-frame');
    const videoTitle = document.getElementById('video-title');
    const videoDescription = document.getElementById('video-description');

    try {
        // โหลดวิดีโอจากไฟล์ JSON (ใช้วิธีเดียวกับ video-gallery.js)
        const response = await fetch('./data/videos.json');
        if (!response.ok) {
            throw new Error('Failed to load videos');
        }
        
        const videos = await response.json();

        if (videoIndex >= 0 && videoIndex < videos.length) {
            const video = videos[videoIndex];
            
            // Update page title
            document.title = `${video.title} - Multimedia TRU`;

            // Create iframe for the video (Google Drive) with autoplay and hidden controls
            const iframe = document.createElement('iframe');
            const videoUrl = video.url.replace("/view", "/preview");
            // เพิ่ม rm=minimal เพื่อซ่อนปุ่มเปิดหน้าต่างใหม่
            iframe.src = videoUrl + "?autoplay=1&rm=minimal";
            iframe.width = "100%";
            iframe.height = "100%";
            iframe.allow = "autoplay";
            iframe.frameBorder = "0";
            iframe.allowFullscreen = true;
            iframe.sandbox = "allow-same-origin allow-scripts allow-popups allow-forms";

            playerFrame.appendChild(iframe);

            // Set video details
            videoTitle.textContent = video.title;
            videoDescription.textContent = video.description;
            
            // แสดงชื่อนักศึกษาถ้ามี
            if (video.studentName) {
                const studentInfo = document.createElement('p');
                studentInfo.className = 'video-student';
                studentInfo.textContent = `โดย: ${video.studentName}`;
                studentInfo.style.color = '#ff0404';
                studentInfo.style.fontWeight = '500';
                studentInfo.style.marginTop = '10px';
                videoDescription.parentElement.appendChild(studentInfo);
            }
        } else {
            // Handle case where video is not found
            videoTitle.textContent = 'ไม่พบวิดีโอ';
            videoDescription.textContent = 'ไม่พบวิดีโอที่คุณต้องการ โปรดกลับไปที่หน้าหลักและลองอีกครั้ง';
        }
    } catch (error) {
        console.error('Error loading video:', error);
        videoTitle.textContent = 'เกิดข้อผิดพลาด';
        videoDescription.textContent = 'ไม่สามารถโหลดวิดีโอได้ในขณะนี้ โปรดลองใหม่อีกครั้ง';
    }
});
