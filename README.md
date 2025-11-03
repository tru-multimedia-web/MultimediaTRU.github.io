# MultimediaTRU.github.io

เว็บไซต์สาขาเทคโนโลยีมัลติมีเดีย มหาวิทยาลัยราชภัฏเทพสตรี

## Live Website

- **หน้าเว็บหลัก**: https://tru-multimedia-web.github.io/MultimediaTRU.github.io/

## คุณสมบัติหลัก

- **Responsive Design** - รองรับทุกขนาดหน้าจอ
- **Video Gallery** - แสดงผลงานวิดีโอของนักศึกษา
- **Interactive Player** - ตัวเล่นวิดีโอพร้อมควบคุม
- **Mobile Navigation** - เมนูนำทางสำหรับมือถือ
- **Fast Loading** - โหลดเร็วและมีประสิทธิภาพ

## โครงสร้างโปรเจค

# MultimediaTRU.github.io

เว็บไซต์สาขาเทคโนโลยีมัลติมีเดีย มหาวิทยาลัยราชภัฏเทพสตรี

## Live Website

**Production**: https://tru-multimedia-web.github.io/MultimediaTRU.github.io/

---

## สารบัญ

- [คุณสมบัติหลัก](#-คุณสมบัติหลัก)
- [โครงสร้างโปรเจค](#-โครงสร้างโปรเจค)
- [เริ่มต้นใช้งาน](#-เริ่มต้นใช้งาน)
- [การพัฒนา](#-การพัฒนา)
- [การ Deploy](#-การ-deploy)
- [แก้ไขปัญหา](#-แก้ไขปัญหา)
- [FAQ](#-คำถามที่พบบ่อย)

---

## คุณสมบัติหลัก

- **Responsive Design** - รองรับทุกขนาดหน้าจอ
- **Video Gallery** - แสดงผลงานวิดีโอของนักศึกษา
- **Interactive Player** - ตัวเล่นวิดีโอพร้อมควบคุม
- **Video Generator** - เครื่องมือจัดการวิดีโอ (Development only)
- **Mobile Navigation** - เมนูนำทางสำหรับมือถือ
- **Fast Loading** - โหลดเร็วและมีประสิทธิภาพ

---

## โครงสร้างโปรเจค

```
MultimediaTRU.github.io/
├── index.html                    # หน้าแรกของเว็บไซต์
├── player.html                   # หน้าเล่นวิดีโอ
├── video-generator.html          # เครื่องมือจัดการวิดีโอ (Dev only)
├── css/                          # ไฟล์สไตล์ชีต
│   ├── styles.css                # สไตล์หลักของเว็บไซต์
│   └── video-generator.css       # สไตล์สำหรับ video-generator
├── js/                           # ไฟล์ JavaScript
│   ├── video-gallery.js          # จัดการแกลเลอรี่วิดีโอ
│   ├── player.js                 # ควบคุมการเล่นวิดีโอ
│   └── video-generator.js        # เครื่องมือจัดการวิดีโอ
├── images/                       # รูปภาพและไฟล์สื่อ
│   ├── cover/                    # รูปภาพปกวิดีโอที่อัพโหลด
│   └── *.jpg, *.png              # รูปภาพทั่วไป
├── data/                         # ฐานข้อมูล
│   └── videos.json               # ข้อมูลวิดีโอทั้งหมด
├── server/                       # Backend API
│   └── api-server.js             # Node.js Express API Server
├── scripts/                      # สคริปต์จัดการ
│   ├── start-servers.sh          # เริ่มเซิร์ฟเวอร์ทั้งสอง
│   ├── stop-servers.sh           # ปิดเซิร์ฟเวอร์
│   └── build-web.sh              # Build สำหรับ production
├── dist/                         # Build output (ignored by git)
├── 📄 package.json               # Dependencies และ scripts
├── 📄 README.md                  # เอกสารหลัก (ไฟล์นี้)
└── 📄 START.md                   # คู่มือเริ่มต้นแบบย่อ
```

### หน้าที่ของแต่ละส่วน

| โฟลเดอร์/ไฟล์ | หน้าที่ |
|---------------|---------|
| `index.html` | หน้าแรก - แสดงวิดีโอทั้งหมด |
| `player.html` | หน้าเล่นวิดีโอ |
| `video-generator.html` | เครื่องมือจัดการวิดีโอ (Development) |
| `server/api-server.js` | API Server สำหรับบันทึกข้อมูล |
| `data/videos.json` | ฐานข้อมูลวิดีโอ |
| `images/cover/` | รูปภาพปกวิดีโอที่อัพโหลด |
| `scripts/` | สคริปต์จัดการเซิร์ฟเวอร์และ build |

---

## เริ่มต้นใช้งาน

### วิธีที่ 1: ใช้ Script อัตโนมัติ (แนะนำ) ⭐

```bash
# เริ่มเซิร์ฟเวอร์ทั้งสอง
./scripts/start-servers.sh

# เปิดในเบราว์เซอร์
# http://localhost:8080
```

### วิธีที่ 2: เริ่มแบบ Manual

#### Terminal 1 - Web Server:
```bash
python3 -m http.server 8080
```

#### Terminal 2 - API Server (สำหรับจัดการวิดีโอ):
```bash
node server/api-server.js
```

### เปิดหน้าเว็บ

- **หน้าหลัก**: http://localhost:8080/
- **จัดการวิดีโอ**: http://localhost:8080/video-generator.html
- **เล่นวิดีโอ**: http://localhost:8080/player.html

### หยุดเซิร์ฟเวอร์

```bash
./scripts/stop-servers.sh
```

---

## การพัฒนา

### วิธีเพิ่มวิดีโอใหม่

1. เปิด **http://localhost:8080/video-generator.html**
2. กรอกข้อมูล:
   - Google Drive URL
   - อัพโหลดรูปปก
   - เลือกหมวดหมู่
   - ชื่อ + รายละเอียด
3. กด **"➕ เพิ่มวิดีโอ"**
4. กด **"🔄 Update"** เพื่อบันทึก
5. Refresh หน้า index.html เพื่อดูผล

### เทคโนโลยีที่ใช้

#### Frontend
- **HTML5** - โครงสร้างหน้าเว็บ
- **CSS3** - การออกแบบและ styling
- **Vanilla JavaScript** - การทำงานแบบไดนามิก

#### Backend (Development)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Python** - HTTP Server สำหรับ development

#### Tools
- **Git** - Version control
- **GitHub Pages** - Static hosting

---

## การ Deploy

### สร้างไฟล์สำหรับ Production

```bash
./scripts/build-web.sh
```

สคริปต์จะสร้างโฟลเดอร์ `dist/` ที่มี:
- ✅ HTML, CSS, JS, Images, Data files
- ❌ ไม่รวม video-generator, server files, scripts

### Deploy ไป GitHub Pages

```bash
# เพิ่มไฟล์ใหม่
git add .

# Commit
git commit -m "Update content"

# Push
git push origin main
```

รอ 1-2 นาที แล้วเปิด: https://tru-multimedia-web.github.io/MultimediaTRU.github.io/

### การตั้งค่า GitHub Pages

1. เข้า **Settings** → **Pages**
2. เลือก **Source**: `Deploy from a branch`
3. เลือก **Branch**: `main` และโฟลเดอร์ `/root`
4. คลิก **Save**

---

## แก้ไขปัญหา

### API Server ไม่ทำงาน

```bash
# ตรวจสอบ port 5001
lsof -ti:5001

# หยุด process เก่า
pkill -f "node.*api-server.js"

# เริ่มใหม่
node server/api-server.js
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

## ❓ คำถามที่พบบ่อย

**Q: API Server ต้องเปิดทุกครั้งหรือไม่?**  
A: เปิดเฉพาะตอนที่จะเพิ่ม/แก้ไขวิดีโอใน video-generator.html เท่านั้น การดูวิดีโอไม่ต้องใช้ API

**Q: รูปปกวิดีโอเก็บไว้ที่ไหน?**  
A: อยู่ในโฟลเดอร์ `images/cover/` ระบบจะบันทึกอัตโนมัติ

**Q: ถ้าต้องการลบวิดีโอ?**  
A: ใช้ปุ่มลบใน video-generator.html จากนั้นกด "🔄 Update"

**Q: ทำไม video-generator.html ไม่มีใน production?**  
A: เป็นเครื่องมือสำหรับ development เท่านั้น ไม่ควรเปิดให้ผู้ใช้ทั่วไปเข้าถึง

---

## เนื้อหาหลัก

1. **Creative & Digital Art** - ความคิดสร้างสรรค์และศิลปะดิจิทัล
2. **Graphic Design** - การออกแบบกราฟิก
3. **2D Animation** - แอนิเมชัน 2 มิติ
4. **3D Animation & Modeling** - แอนิเมชันและโมเดล 3 มิติ
5. **Video Production & Editing** - ผลิตวิดีโอและภาพยนตร์
6. **Game Design & Development** - การออกแบบและพัฒนาเกม
7. **Virtual & Extended Reality** - เทคโนโลยีเสมือนและโลกใหม่

---

## วิธีใช้งาน

### สำหรับพัฒนา (Development)

```bash
# เริ่มเซิร์ฟเวอร์
./scripts/start-servers.sh

# เปิดหน้าเว็บ
# http://localhost:8080 (Web)
# http://localhost:5001 (API)
```

### สำหรับ Deploy (Production)

```bash
# สร้างไฟล์สำหรับ Deploy
./scripts/build-web.sh

# อัพโหลดโฟลเดอร์ dist/ ไปยัง GitHub Pages
```

## GitHub Pages Structure

### Project Site Structure
```
tru-multimedia-web.github.io/
└── MultimediaTRU.github.io/          # Project repository
    ├── index.html                     # หน้าแรก (root)
    ├── player.html                    # หน้าเล่นวิดีโอ
    ├── css/                          # สไตล์ชีต
    ├── js/                           # JavaScript files
    ├── images/                       # รูปภาพและสื่อ
    └── data/                         # ข้อมูล JSON
```

### URL Structure
- **Base URL**: `https://tru-multimedia-web.github.io/MultimediaTRU.github.io/`
- **หน้าแรก**: `https://tru-multimedia-web.github.io/MultimediaTRU.github.io/`
- **หน้าเล่น**: `https://tru-multimedia-web.github.io/MultimediaTRU.github.io/player.html`

### การตั้งค่า GitHub Pages
1. เข้า **Settings** → **Pages**
2. เลือก **Source**: `Deploy from a branch`
3. เลือก **Branch**: `main` และโฟลเดอร์ `/docs` หรือ `/root`
4. คลิก **Save**

### ไฟล์ที่ Deploy
- ✅ รวม: HTML, CSS, JS, Images, Data files
- ❌ ไม่รวม: Server files, Scripts, Development tools

##  เทคโนโลยีที่ใช้

### Frontend
- **HTML5** - โครงสร้างหน้าเว็บ
- **CSS3** - การออกแบบและ styling
- **Vanilla JavaScript** - การทำงานแบบไดนามิก

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework

### Tools
- **Git** - Version control
- **GitHub Pages** - Hosting

## เนื้อหาหลัก

1. **Creative & Digital Art** - ความคิดสร้างสรรค์และศิลปะดิจิทัล
2. **Graphic Design** - การออกแบบกราฟิก
3. **2D Animation** - แอนิเมชัน 2 มิติ
4. **3D Animation & Modeling** - แอนิเมชันและโมเดล 3 มิติ
5. **Video Production & Editing** - ผลิตวิดีโอและภาพยนตร์
6. **Game Design & Development** - การออกแบบและพัฒนาเกม
7. **Virtual & Extended Reality** - เทคโนโลยีเสมือนและโลกใหม่

## ผู้พัฒนา

**สาขาเทคโนโลยีมัลติมีเดีย**  
**มหาวิทยาลัยราชภัฏเทพสตรี**

---

*อัพเดทล่าสุด: November 2025*
