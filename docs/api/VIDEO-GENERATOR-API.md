# Video Generator with Python API

## 🚀 วิธีการใช้งาน

### 1. ติดตั้ง Python Dependencies

```bash
pip3 install -r requirements.txt
```

### 2. เริ่มต้น Python API Server

```bash
python3 api-server.py
```

คุณจะเห็นข้อความ:
```
🚀 Video Generator API Server
📁 Cover folder: images/cover
📄 Videos JSON: js/videos.json
🌐 Server: http://localhost:5000
```

### 3. เริ่มต้น Web Server (Terminal ใหม่)

```bash
python3 -m http.server 8080
```

### 4. เปิด Video Generator

เปิด browser ไปที่:
```
http://localhost:8080/video-generator.html
```

## ✨ Features

- ✅ อัพโหลดรูปภาพและบันทึกไฟล์จริงใน `images/cover/`
- ✅ บันทึกข้อมูลวิดีโอใน `js/videos.json`
- ✅ ทำงาน standalone (ไม่ต้องพึ่ง browser storage)
- ✅ รองรับการทำงานแบบ offline (fallback to localStorage)

## 🔧 API Endpoints

### 1. Upload Image
```
POST /api/upload-image
Body: {
  "filename": "example.png",
  "data": "data:image/png;base64,..."
}
```

### 2. Save Videos
```
POST /api/save-videos
Body: [array of video objects]
```

### 3. Health Check
```
GET /api/health
```

## 📁 File Structure

```
├── api-server.py          # Python Flask API
├── requirements.txt       # Python dependencies
├── video-generator.html   # Admin interface
├── js/
│   ├── video-generator.js # Frontend logic
│   └── videos.json        # Video data (auto-generated)
└── images/
    └── cover/             # Uploaded thumbnails (auto-generated)
```

## ⚙️ การทำงาน

1. เมื่ออัพโหลดรูปภาพ → ส่งไปยัง Python API → บันทึกลงไฟล์จริง
2. เมื่อบันทึกวิดีโอ → ส่งข้อมูลไปยัง Python API → บันทึกใน `js/videos.json`
3. หากไม่เชื่อมต่อ API ได้ → ยังทำงานได้ปกติด้วย localStorage

## 🎯 ข้อดี

- **Persistent Storage**: ข้อมูลถาวร ไม่หายเมื่อปิด browser
- **Real Files**: มีไฟล์รูปภาพจริงในโฟลเดอร์
- **Shareable**: ส่ง JSON และรูปภาพให้คนอื่นได้
- **Version Control**: สามารถ commit เข้า Git ได้

## 🛠️ Troubleshooting

### ไม่สามารถบันทึกไฟล์ได้
- ตรวจสอบว่า Python API Server รันอยู่หรือไม่
- ดูที่ Console (F12) จะมีข้อความแจ้งเตือน
- ถ้า API ไม่ทำงาน ระบบจะใช้ localStorage แทน

### รูปภาพไม่แสดงในหน้าหลัก
- ตรวจสอบว่าไฟล์อยู่ใน `images/cover/` หรือไม่
- ตรวจสอบชื่อไฟล์ใน `js/videos.json` ตรงกับไฟล์จริงหรือไม่
