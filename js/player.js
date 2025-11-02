document.addEventListener('DOMContentLoaded', () => {
    const videos = JSON.parse(localStorage.getItem('multimedia_videos')) || [];
    const urlParams = new URLSearchParams(window.location.search);
    const videoIndex = parseInt(urlParams.get('videoIndex'), 10);

    const playerFrame = document.getElementById('player-frame');
    const videoTitle = document.getElementById('video-title');
    const videoDescription = document.getElementById('video-description');

    if (videoIndex >= 0 && videoIndex < videos.length) {
        const video = videos[videoIndex];
        
        // Update page title
        document.title = `${video.title} - Multimedia TRU`;

        // Create iframe for the video (Google Drive only)
        const iframe = document.createElement('iframe');
        iframe.src = video.url.replace("/view", "/preview");
        iframe.width = "100%";
        iframe.height = "100%";
        iframe.allow = "autoplay";
        iframe.frameBorder = "0";
        iframe.allowFullscreen = true;

        playerFrame.appendChild(iframe);

        // Set video details
        videoTitle.textContent = video.title;
        videoDescription.textContent = video.description;
    } else {
        // Handle case where video is not found
        videoTitle.textContent = 'ไม่พบวิดีโอ';
        videoDescription.textContent = 'ไม่พบวิดีโอที่คุณต้องการ โปรดกลับไปที่หน้าหลักและลองอีกครั้ง';
    }
});
