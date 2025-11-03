# 🎬 MultimediaTRU.github.io

เว็บไซต์สาขาเทคโนโลยีมัลติมีเดีย มหาวิทยาลัยราชภัฏเทพสตรี

## 🌐 Live Website

- **หน้าเว็บหลัก**: https://tru-multimedia-web.github.io/MultimediaTRU.github.io/

## 🌟 คุณสมบัติหลัก

- **🎨 Responsive Design** - รองรับทุกขนาดหน้าจอ
- **🎬 Video Gallery** - แสดงผลงานวิดีโอของนักศึกษา
- **🎮 Interactive Player** - ตัวเล่นวิดีโอพร้อมควบคุม
- **📱 Mobile Navigation** - เมนูนำทางสำหรับมือถือ
- **⚡ Fast Loading** - โหลดเร็วและมีประสิทธิภาพ

## 📁 โครงสร้างโปรเจค

```
MultimediaTRU.github.io/
├── index.html                 # หน้าแรกของเว็บไซต์
├── player.html                # หน้าเล่นวิดีโอ
├── video-generator.html       # เครื่องมือจัดการวิดีโอ
├── css/                       # ไฟล์สไตล์ชีต
│   ├── styles.css
│   └── video-generator.css
├── js/                        # ไฟล์ JavaScript
│   ├── video-gallery.js
│   ├── video-generator.js
│   └── player.js
├── images/                    # รูปภาพและไฟล์สื่อ
├── data/
│   └── videos.json            # ข้อมูลวิดีโอทั้งหมด
├── server/
│   └── api-server.js          # Node.js Express API Server
├── scripts/                   # สคริปต์จัดการเซิร์ฟเวอร์
├── build-web.sh               # Build script สำหรับ production
├── package.json
└── README.md
```

## 🚀 วิธีใช้งาน

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
./build-web.sh

# อัพโหลดโฟลเดอร์ dist/ ไปยัง GitHub Pages
```

## 🌐 GitHub Pages Structure

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

## 📖 เนื้อหาหลัก

1. **Creative & Digital Art** - ความคิดสร้างสรรค์และศิลปะดิจิทัล
2. **Graphic Design** - การออกแบบกราฟิก
3. **2D Animation** - แอนิเมชัน 2 มิติ
4. **3D Animation & Modeling** - แอนิเมชันและโมเดล 3 มิติ
5. **Video Production & Editing** - ผลิตวิดีโอและภาพยนตร์
6. **Game Design & Development** - การออกแบบและพัฒนาเกม
7. **Virtual & Extended Reality** - เทคโนโลยีเสมือนและโลกใหม่

## 👨‍💻 ผู้พัฒนา

**สาขาเทคโนโลยีมัลติมีเดีย**  
**มหาวิทยาลัยราชภัฏเทพสตรี**

---

*อัพเดทล่าสุด: November 2025*
