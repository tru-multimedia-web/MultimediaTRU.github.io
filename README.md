# Multimedia Technology Website

เว็บไซต์แนะนำสาขาเทคโนโลยีมัลติมีเดีย มหาวิทยาลัยราชภัฏเทพสตรี

## 📖 รายละเอียดโปรเจค

เว็บไซต์นี้เป็นหน้าแนะนำสาขาเทคโนโลยีมัลติมีเดีย ที่ออกแบบมาเพื่อแสดงข้อมูลเกี่ยวกับหลักสูตร ผลงานนักศึกษา และความน่าสนใจของสาขา พร้อมด้วยการออกแบบที่ทันสมัยและ responsive design

## 🌟 คุณสมบัติหลัก

- **Responsive Design** - รองรับทุกขนาดหน้าจอ (Desktop, Tablet, Mobile)
- **Smooth Scrolling Navigation** - การเลื่อนหน้าที่นุ่มนวลเมื่อคลิกเมนู
- **Mobile Navigation** - Hamburger menu สำหรับ mobile พร้อม Google Font Icons
- **Modern Layout** - การจัดวางแบบ banner alternating (ซ้าย-ขวา-ซ้าย)
- **Clean File Structure** - โครงสร้างไฟล์ที่เป็นระเบียบ

## 🗂️ โครงสร้างไฟล์

```
demo/
├── index.html                 # หน้าหลัก
├── styles.css                 # Stylesheet หลัก
├── README.md                  # เอกสารนี้
└── images/                    # โฟลเดอร์รูปภาพ
    ├── 01_hero_banner.jpg     # Banner หลักของเว็บไซต์
    ├── 02_creative_digital_art.png    # ภาพส่วน Creative & Digital Art
    ├── 03_graphic_design.png          # ภาพส่วน Graphic Design
    ├── 04_2d_animation.png            # ภาพส่วน 2D Animation
    ├── 05_3d_animation.png            # ภาพส่วน 3D Animation
    ├── 06_video_production.png        # ภาพส่วน Video Production
    ├── 07_game_development.png        # ภาพส่วน Game Development
    ├── 08_virtual_reality.png         # ภาพส่วน Virtual Reality
    ├── logo_multimedia.png            # โลโก้สาขา
    └── mobile_tab_background.png      # พื้นหลัง Mobile Tab
```

## 📱 หน้าที่แสดง

### Desktop Navigation
- **เกี่ยวกับ** - ข้อมูลเกี่ยวกับสาขาเทคโนโลยีมัลติมีเดีย
- **หลักสูตร** - รายละเอียดหลักสูตรที่เปิดสอน
- **ผลงาน** - ผลงานของนักศึกษา
- **ติดต่อเรา** - ข้อมูลการติดต่อ

### เนื้อหาหลัก
1. **Creative & Digital Art** - ความคิดสร้างสรรค์และศิลปะดิจิทัล
2. **Graphic Design** - การออกแบบกราฟิก
3. **2D Animation** - แอนิเมชัน 2 มิติ
4. **3D Animation & Modeling** - แอนิเมชันและโมเดล 3 มิติ
5. **Video Production & Editing** - ผลิตวิดีโอและภาพยนตร์
6. **Game Design & Development** - การออกแบบและพัฒนาเกม
7. **Virtual & Extended Reality** - เทคโนโลยีเสมือนและโลกใหม่

## 🎨 เทคโนโลยีที่ใช้

- **HTML5** - โครงสร้างหน้าเว็บ
- **CSS3** - การออกแบบและ styling
  - Flexbox layout
  - CSS Grid
  - Media Queries (Responsive)
  - CSS Animations & Transitions
- **JavaScript** - การทำงานแบบ interactive
- **Google Fonts** - Material Symbols สำหรับ icons

## 📋 คุณสมบัติพิเศษ

### Responsive Design
- **Desktop** (> 768px): แสดง navigation bar แบบเต็ม
- **Mobile/Tablet** (≤ 768px): แสดง hamburger menu และ mobile layout

### Navigation Features
- **Smooth Scrolling** - การเลื่อนที่นุ่มนวล
- **Scroll Offset** - ปรับตำแหน่งให้ไม่ถูกบังโดย fixed header
- **Active States** - สถานะเมื่อ hover และ active

### Mobile Features
- **Hamburger Menu** - เมนูแบบ slide-in จากซ้าย
- **Touch Friendly** - ปุ่มและลิงก์ที่เหมาะสำหรับการสัมผัส
- **Auto-close Menu** - ปิดเมนูอัตโนมัติเมื่อคลิกลิงก์

## 🚀 การใช้งาน

### เปิดเว็บไซต์
1. เปิดไฟล์ `index.html` ในเบราว์เซอร์
2. หรือใช้ local server เช่น Live Server extension ใน VS Code

### การแก้ไข
1. **เปลี่ยนรูปภาพ**: แทนที่ไฟล์ในโฟลเดอร์ `images/`
2. **แก้ไขเนื้อหา**: แก้ไขใน `index.html`
3. **ปรับแต่งสไตล์**: แก้ไขใน `styles.css`

## 🎯 Browser Support

- ✅ Chrome (แนะนำ)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📐 Responsive Breakpoints

- **Mobile First Design**
- **Tablet/Mobile**: ≤ 768px
- **Desktop**: > 768px

## 🎨 Color Scheme

- **Background**: `#000000` (Black)
- **Content Background**: `#0f0f0f` (Dark Gray)
- **Text**: `#ffffff` (White)
- **Accent**: Various gradients and transparencies

## 📝 หมายเหตุ

- เว็บไซต์นี้ใช้ Google Fonts Material Symbols สำหรับ icons
- รูปภาพทั้งหมดได้รับการจัดระเบียบและตั้งชื่อใหม่ให้สอดคล้อง
- โค้ดได้รับการปรับปรุงให้ clean และ maintainable

## 👨‍💻 ผู้พัฒนา

สร้างสรรค์โดย GitHub Copilot สำหรับสาขาเทคโนโลยีมัลติมีเดีย มหาวิทยาลัยราชภัฏเทพสตรี

---

**อัพเดทล่าสุด**: October 2025