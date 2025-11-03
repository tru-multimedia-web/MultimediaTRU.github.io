# 🚀 วิธีเริ่มต้นใช้งานโปรเจค

คู่มือฉบับย่อสำหรับการเริ่มต้นใช้งานระบบ

---

## ⚡ เริ่มต้นแบบเร็ว (Quick Start)

### วิธีที่ 1: ใช้ Script อัตโนมัติ (แนะนำ) ⭐

```bash
cd "/Users/wanchatpookhuntod/web multimedia projgram/MultimediaTRU.github.io"
./scripts/start-servers.sh
```

**ข้อดี:** เริ่มเซิร์ฟเวอร์ทั้งสองพร้อมกัน + ตรวจสอบสถานะอัตโนมัติ

### วิธีที่ 2: เปิด Manual (สำหรับ Debug)

#### Terminal 1 - Web Server:
```bash
cd "/Users/wanchatpookhuntod/web multimedia projgram/MultimediaTRU.github.io"
python3 -m http.server 8080
```

#### Terminal 2 - API Server:
```bash
cd "/Users/wanchatpookhuntod/web multimedia projgram/MultimediaTRU.github.io"
node api-server.js
```

### หยุดเซิร์ฟเวอร์

```bash
./scripts/stop-servers.sh
```

### สร้างไฟล์สำหรับ Deploy

```bash
./build-web.sh
```

โฟลเดอร์ `dist/` จะมีไฟล์สำหรับ Deploy ไป GitHub Pages (ไม่มี video-generator)

### 2. เปิดเว็บไซต์

- **หน้าหลัก**: http://localhost:8080/
- **จัดการวิดีโอ**: http://localhost:8080/video-generator.html
- **เล่นวิดีโอ**: http://localhost:8080/player.html

---

## 📝 วิธีเพิ่มวิดีโอใหม่

1. เปิด **video-generator.html**
2. กรอกข้อมูล:
   - Google Drive URL
   - อัพโหลดรูปปก
   - เลือกหมวดหมู่
   - ชื่อ + รายละเอียด
3. กด **"➕ เพิ่มวิดีโอ"**
4. กด **"🔄 Update"** เพื่อบันทึก
5. Refresh หน้า index.html เพื่อดูผล

---

## 🔧 แก้ไขปัญหา

### API Server ไม่ทำงาน
```bash
# ตรวจสอบ port 5001
lsof -ti:5001

# หยุด process เก่า
pkill -f "node api-server.js"

# เริ่มใหม่
node api-server.js
```

### Web Server ไม่ทำงาน
```bash
# ตรวจสอบ port 8080
lsof -ti:8080

# หยุด process เก่า
pkill -f "http.server 8080"

# เริ่มใหม่
python3 -m http.server 8080
```

### ข้อมูลไม่อัพเดต
1. กด F12 เปิด Console
2. ตรวจสอบ error
3. Hard refresh: `Cmd + Shift + R` (Mac) หรือ `Ctrl + Shift + R` (Windows)

---

## 📂 ไฟล์สำคัญ

| ไฟล์ | หน้าที่ |
|------|---------|
| `index.html` | หน้าแรก - แสดงวิดีโอทั้งหมด |
| `video-generator.html` | เครื่องมือจัดการวิดีโอ |
| `player.html` | หน้าเล่นวิดีโอ |
| `api-server.js` | API Server สำหรับบันทึกข้อมูล |
| `data/videos.json` | ฐานข้อมูลวิดีโอ |

---

## 🌐 Deploy ไป GitHub Pages

```bash
# เพิ่มไฟล์ใหม่
git add .

# Commit
git commit -m "เพิ่มวิดีโอใหม่"

# Push
git push origin main
```

รอ 1-2 นาที แล้วเปิด: https://tru-multimedia-web.github.io/MultimediaTRU.github.io/

---

## ❓ คำถามที่พบบ่อย

**Q: API Server ต้องเปิดทุกครั้งหรือไม่?**  
A: เปิดเฉพาะตอนที่จะเพิ่ม/แก้ไขวิดีโอใน video-generator.html เท่านั้น การดูวิดีโอไม่ต้องใช้ API

**Q: รูปปกวิดีโอเก็บไว้ที่ไหน?**  
A: อยู่ในโฟลเดอร์ `images/cover/` ระบบจะบันทึกอัตโนมัติ

**Q: ถ้าต้องการลบวิดีโอ?**  
A: ใช้ปุ่มลบใน video-generator.html จากนั้นกด "🔄 Update"

---

## 📞 ติดต่อ

สาขาเทคโนโลยีมัลติมีเดีย  
มหาวิทยาลัยราชภัฏเทพสตรี
