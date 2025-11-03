# 🚀 วิธีใช้งาน - Video Gallery API System

## ขั้นตอนการเริ่มต้น (ครั้งแรก)

### 1. ติดตั้ง Node.js Packages

เปิด Terminal และรันคำสั่ง:

```bash
npm install
```

## การใช้งานทุกครั้ง

### 1. เปิด Node.js API Server (Terminal 1)

```bash
npm start
```

ผลลัพธ์ที่ควรเห็น:
```
🚀 Server is running on http://localhost:3000
📁 Data file: /path/to/data/videos.json
```

### 2. เปิด Web Server (Terminal 2)

เปิด Terminal ใหม่ และรันคำสั่ง:

```bash
python3 -m http.server 8080
```

หรือใช้ Live Server ใน VS Code

### 3. เข้าใช้งาน

- **หน้าหลัก**: http://localhost:8080/index.html
- **Admin Panel**: http://localhost:8080/admin/

---

## ⚙️ การตั้งค่า Admin Panel (สำคัญ!)

ก่อนใช้งาน Admin Panel ต้องแก้ไขไฟล์ `admin/index.html`:

เปลี่ยนบรรทัดนี้:
```html
<script src="admin-panel.js"></script>
```

เป็น:
```html
<script src="admin-panel-api.js"></script>
```

---

## 📝 ข้อมูลสำคัญ

### ไฟล์เก็บข้อมูล
- ข้อมูลวิดีโอทั้งหมดเก็บใน: `data/videos.json`
- สำรองข้อมูลได้ง่ายโดย copy ไฟล์นี้

### API Endpoint
- API Server: http://localhost:3000
- API Videos: http://localhost:3000/api/videos

---

## ❌ แก้ปัญหาที่พบบ่อย

### ปัญหา: หน้าแสดงข้อความ "เกิดข้อผิดพลาดในการโหลดข้อมูล"

**แก้ไข**: เปิด Node.js Server
```bash
npm start
```

### ปัญหา: Admin Panel บันทึกไม่ได้

**แก้ไข**: 
1. ตรวจสอบว่าใช้ `admin-panel-api.js` แล้วหรือยัง
2. เปิด Node.js Server ก่อน

---

## 🎯 สรุปเร็ว

1. `npm install` (ครั้งแรกอย่างเดียว)
2. `npm start` (Terminal 1)
3. `python3 -m http.server 8080` (Terminal 2)
4. เปิด http://localhost:8080/admin/
5. เพิ่มวิดีโอได้เลย!
