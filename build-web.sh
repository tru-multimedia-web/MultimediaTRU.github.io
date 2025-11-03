#!/bin/bash

echo "🏗️  สร้างไฟล์สำหรับ Deploy เว็บไซต์..."
echo "═══════════════════════════════════════════════════════════"

# สร้างโฟลเดอร์สำหรับ production
PROD_DIR="dist"
echo "📁 สร้างโฟลเดอร์ $PROD_DIR..."
rm -rf $PROD_DIR
mkdir -p $PROD_DIR

# คัดลอกไฟล์ที่จำเป็นสำหรับเว็บไซต์
echo "📋 คัดลอกไฟล์ที่จำเป็น..."

# HTML files (ยกเว้น video-generator)
cp index.html $PROD_DIR/
cp player.html $PROD_DIR/

# CSS files (ยกเว้น video-generator.css)
cp css/styles.css $PROD_DIR/

# JS files (ยกเว้น video-generator.js)
cp js/video-gallery.js $PROD_DIR/
cp js/player.js $PROD_DIR/

# Data files
cp -r data $PROD_DIR/

# Images
cp -r images $PROD_DIR/

# สร้างโฟลเดอร์สำหรับ CSS และ JS
mkdir -p $PROD_DIR/css
mkdir -p $PROD_DIR/js

# ย้ายไฟล์ไปยังโฟลเดอร์ที่ถูกต้อง
mv $PROD_DIR/styles.css $PROD_DIR/css/
mv $PROD_DIR/video-gallery.js $PROD_DIR/js/
mv $PROD_DIR/player.js $PROD_DIR/js/

# สร้างไฟล์ README สำหรับ production
cat > $PROD_DIR/README.md << 'EOF'
# 🎬 TRU Multimedia Website

เว็บไซต์แสดงผลงานนักศึกษา สาขาเทคโนโลยีมัลติมีเดีย
มหาวิทยาลัยราชภัฏเทพสตรี

## 🌐 ใช้งาน

เปิด `index.html` ในเบราว์เซอร์เพื่อเข้าชมเว็บไซต์

## 📁 โครงสร้าง

- `index.html` - หน้าแรก แสดงผลงานทั้งหมด
- `player.html` - หน้าเล่นวิดีโอ
- `css/styles.css` - สไตล์ของเว็บไซต์
- `js/` - JavaScript สำหรับการทำงาน
- `data/videos.json` - ข้อมูลวิดีโอ
- `images/` - รูปภาพและไฟล์สื่อ

---
*ไฟล์นี้สร้างโดย build script อัตโนมัติ*
EOF

# แสดงสรุป
echo ""
echo "✅ สร้างไฟล์สำเร็จ!"
echo "📂 โฟลเดอร์: $PROD_DIR/"
echo ""
echo "📋 ไฟล์ที่รวม:"
echo "├── 🌐 index.html"
echo "├── 🎬 player.html"
echo "├── 🎨 css/styles.css"
echo "├── 💻 js/video-gallery.js"
echo "├── 💻 js/player.js"
echo "├── 💾 data/videos.json"
echo "├── 🖼️  images/ (ทั้งหมด)"
echo "└── 📖 README.md"
echo ""
echo "❌ ไม่รวมไฟล์:"
echo "├── 🔧 video-generator.html"
echo "├── 🔧 video-generator.css"
echo "├── 🔧 video-generator.js"
echo "├── 🚀 api-server.js"
echo "└── 📜 scripts/"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "🎉 พร้อม Deploy ไป GitHub Pages!"
echo "💡 อัพโหลดโฟลเดอร์ $PROD_DIR ไปยัง GitHub Pages"
echo "═══════════════════════════════════════════════════════════"