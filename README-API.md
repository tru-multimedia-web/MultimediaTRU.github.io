# 📚 Multimedia TRU - Video Gallery API System

## 🎯 ภาพรวม

ระบบจัดการวิดีโอแกลเลอรี่สำหรับสาขาวิชาเทคโนโลยีมัลติมีเดีย มหาวิทยาลัยราชภัฏเทพสตรี

ระบบนี้ใช้ **Node.js + Express** เป็น Backend API และบันทึกข้อมูลในไฟล์ JSON

---

## 🚀 การติดตั้งและใช้งาน

### 1. ติดตั้ง Dependencies

```bash
npm install
```

หรือถ้ายังไม่มี Node.js ให้ดาวน์โหลดจาก: https://nodejs.org/

### 2. เริ่มต้น Server

```bash
npm start
```

Server จะทำงานที่: **http://localhost:3000**

### 3. เริ่มต้น Web Server (อีกหนึ่ง Terminal)

เปิด Terminal ใหม่และรันคำสั่ง:

```bash
python3 -m http.server 8080
```

หรือใช้ Live Server extension ใน VS Code

### 4. เข้าใช้งาน

- **หน้าหลัก**: http://localhost:8080/index.html
- **Admin Panel**: http://localhost:8080/admin/
- **API Endpoint**: http://localhost:3000/api/videos

---

## 📡 API Endpoints

### GET `/api/videos`
ดึงข้อมูลวิดีโอทั้งหมด

**Response:**
```json
[
  {
    "id": "1234567890",
    "url": "https://drive.google.com/file/d/xxx/view",
    "category": "animation",
    "title": "ชื่อวิดีโอ",
    "description": "รายละเอียด",
    "studentName": "ชื่อนักศึกษา",
    "createdAt": "2025-11-02T10:30:00.000Z"
  }
]
```

### POST `/api/videos`
บันทึกวิดีโอทั้งหมด (แทนที่ข้อมูลเดิม)

**Request Body:**
```json
[
  { /* video object */ },
  { /* video object */ }
]
```

**Response:**
```json
{
  "success": true,
  "message": "Videos saved successfully",
  "count": 10
}
```

### POST `/api/videos/add`
เพิ่มวิดีโอใหม่ทีละ 1 รายการ

**Request Body:**
```json
{
  "id": "1234567890",
  "url": "https://drive.google.com/file/d/xxx/view",
  "category": "animation",
  "title": "ชื่อวิดีโอ",
  "description": "รายละเอียด",
  "studentName": "ชื่อนักศึกษา",
  "createdAt": "2025-11-02T10:30:00.000Z"
}
```

### PUT `/api/videos/:id`
แก้ไขวิดีโอตาม ID

**Request Body:**
```json
{
  "title": "ชื่อใหม่",
  "description": "รายละเอียดใหม่"
}
```

### DELETE `/api/videos/:id`
ลบวิดีโอตาม ID

**Response:**
```json
{
  "success": true,
  "message": "Video deleted successfully"
}
```

### GET `/api/health`
ตรวจสอบสถานะ Server

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

## 📁 โครงสร้างไฟล์

```
MultimediaTRU.github.io/
├── server.js                 # Node.js Express Server
├── package.json              # Node.js dependencies
├── data/
│   └── videos.json          # ไฟล์เก็บข้อมูลวิดีโอ (สร้างอัตโนมัติ)
├── admin/
│   ├── index.html           # หน้า Admin Panel
│   ├── admin-panel-api.js   # JavaScript สำหรับ Admin (API version)
│   └── styles.css           # CSS สำหรับ Admin
├── js/
│   ├── video-gallery.js     # JavaScript โหลดวิดีโอ (API version)
│   └── player.js            # JavaScript สำหรับหน้าเล่นวิดีโอ
├── index.html               # หน้าหลัก
├── player.html              # หน้าเล่นวิดีโอ
└── README-API.md            # ไฟล์นี้
```

---

## 🔄 การเปลี่ยนจาก localStorage เป็น API

### ไฟล์ที่ถูกอัปเดต:

1. **js/video-gallery.js**
   - เปลี่ยนจาก `localStorage.getItem()` เป็น `fetch(API_URL)`
   - โหลดข้อมูลจาก API แทน localStorage

2. **admin/admin-panel-api.js** (ไฟล์ใหม่)
   - เปลี่ยนจาก `localStorage.setItem()` เป็น `fetch(API_URL, {method: 'POST'})`
   - บันทึกข้อมูลผ่าน API แทน localStorage

### ข้อดีของการใช้ API:

✅ **ข้อมูลถาวร** - บันทึกในไฟล์ JSON ไม่สูญหายเมื่อล้าง browser
✅ **แชร์ได้** - ผู้ใช้หลายเครื่องเห็นข้อมูลเดียวกัน
✅ **สำรองง่าย** - Copy ไฟล์ `data/videos.json` ได้เลย
✅ **Scale ได้** - เปลี่ยนเป็น database ในอนาคตได้ง่าย

---

## 🛠️ การใช้งาน Admin Panel

### เพิ่มวิดีโอใหม่:

1. เปิด http://localhost:8080/admin/
2. กรอกข้อมูล:
   - **Google Drive URL**: ลิงค์วิดีโอจาก Google Drive
   - **หมวดหมู่**: animation, game, web, video, graphic
   - **ชื่อวิดีโอ**: ชื่อผลงาน
   - **รายละเอียด**: คำอธิบายผลงาน
   - **ชื่อนักศึกษา**: ชื่อผู้สร้างผลงาน
3. กดปุ่ม "เพิ่มวิดีโอ"
4. ข้อมูลจะถูกบันทึกใน `data/videos.json` ทันที

### แก้ไขวิดีโอ:

1. คลิกปุ่ม "แก้ไข" ที่วิดีโอที่ต้องการ
2. ข้อมูลจะแสดงในฟอร์ม
3. แก้ไขข้อมูลแล้วกด "เพิ่มวิดีโอ" เพื่อบันทึก

### ลบวิดีโอ:

1. คลิกปุ่ม "ลบ" ที่วิดีโอที่ต้องการ
2. ยืนยันการลบ

### Export/Import ข้อมูล:

- **Export**: สำรองข้อมูลเป็นไฟล์ JSON
- **Import**: นำข้อมูลจากไฟล์ JSON เข้าระบบ

---

## 🔧 Troubleshooting

### ❌ ปัญหา: "เกิดข้อผิดพลาดในการโหลดข้อมูล"

**สาเหตุ**: Server ไม่ได้เปิด

**แก้ไข**:
```bash
# เปิด Terminal และรันคำสั่ง
npm start
```

### ❌ ปัญหา: "CORS Error"

**สาเหตุ**: เปิดไฟล์ HTML แบบ `file://` แทน `http://`

**แก้ไข**: ใช้ Web Server เช่น:
```bash
python3 -m http.server 8080
```

### ❌ ปัญหา: ข้อมูลไม่บันทึก

**แก้ไข**:
1. ตรวจสอบว่า Server ทำงาน: http://localhost:3000/api/health
2. ดู Console ใน Browser (F12) เพื่อดู Error
3. ตรวจสอบว่าโฟลเดอร์ `data/` มีสิทธิ์เขียนไฟล์

---

## 📦 การ Deploy

### Deploy บน VPS/Server:

1. Upload โปรเจคทั้งหมดขึ้น Server
2. ติดตั้ง Node.js
3. รันคำสั่ง:
```bash
npm install
npm start
```

4. ใช้ PM2 เพื่อให้ Server ทำงานตลอด:
```bash
npm install -g pm2
pm2 start server.js --name multimedia-api
pm2 save
pm2 startup
```

### ใช้งานบน GitHub Pages:

**หมายเหตุ**: GitHub Pages รองรับแค่ Static Files ไม่สามารถรัน Node.js ได้

**ทางเลือก**:
1. Deploy API บน Vercel, Heroku, หรือ Railway
2. แก้ไข `API_URL` ใน code ให้ชี้ไปที่ Server จริง

---

## 🔐 Security Notes

- ⚠️ ระบบนี้ยังไม่มีการ Authentication
- ⚠️ ใครก็สามารถเข้า Admin Panel ได้
- ⚠️ เหมาะสำหรับใช้ใน Local Network หรือ Intranet

**คำแนะนำสำหรับ Production:**
- เพิ่ม Login System
- ใช้ HTTPS
- ตั้งค่า Rate Limiting
- เพิ่ม Input Validation

---

## 📝 การอัปเดตในอนาคต

- [ ] เพิ่ม Authentication
- [ ] เปลี่ยนจาก JSON File เป็น MongoDB/PostgreSQL
- [ ] เพิ่มระบบ Upload วิดีโอ
- [ ] เพิ่มระบบ Tags และ Search
- [ ] สร้าง Dashboard สำหรับดู Analytics

---

## 📞 ติดต่อ

สาขาวิชาเทคโนโลยีมัลติมีเดีย  
คณะเทคโนโลยีสารสนเทศ  
มหาวิทยาลัยราชภัฏเทพสตรี

- 📧 Email: tru.multimedia666@gmail.com
- 📘 Facebook: https://www.facebook.com/multimedia.tru
- 📞 Tel: 036-427494
