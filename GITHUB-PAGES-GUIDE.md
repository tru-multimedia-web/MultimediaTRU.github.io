# 🚀 คู่มือการใช้งาน - Video Gallery สำหรับ GitHub Pages

## 📋 ภาพรวมระบบ

ระบบนี้แบ่งเป็น 2 ส่วน:

1. **Video Generator (บนเครื่องคอม)** - เครื่องมือสร้างไฟล์ `videos.json`
2. **Website (GitHub Pages)** - เว็บไซต์อ่านข้อมูลจากไฟล์ `videos.json`

---

## 🎯 ขั้นตอนการใช้งาน

### 1. จัดการวิดีโอบนเครื่องคอม

1. **เปิดไฟล์ `video-generator.html`** ในเบราว์เซอร์
   - ไม่ต้องเปิด Server
   - เปิดไฟล์ได้เลย (File > Open)

2. **เพิ่มวิดีโอ**
   - กรอกข้อมูล: URL, หมวดหมู่, ชื่อ, รายละเอียด, ชื่อนักศึกษา
   - กด "เพิ่มวิดีโอ"
   - วิดีโอจะถูกเก็บใน browser (localStorage)

3. **จัดการวิดีโอ**
   - แก้ไข: คลิก "แก้ไข" แล้วกด "เพิ่มวิดีโอ"
   - ลบ: คลิก "ลบ"

4. **ดาวน์โหลด `videos.json`**
   - กดปุ่ม "💾 ดาวน์โหลด videos.json"
   - ไฟล์จะถูกดาวน์โหลดมา

### 2. อัปโหลดขึ้น GitHub

1. **วาง `videos.json` ในโฟลเดอร์หลัก** ของโปรเจค
   ```
   MultimediaTRU.github.io/
   ├── videos.json          ← วางไฟล์ตรงนี้
   ├── index.html
   ├── player.html
   └── ...
   ```

2. **Commit และ Push ขึ้น GitHub**
   ```bash
   git add videos.json
   git commit -m "Update videos data"
   git push
   ```

3. **เว็บไซต์จะอัปเดตอัตโนมัติ** (รอ 1-2 นาที)

---

## 📁 โครงสร้างไฟล์

```
MultimediaTRU.github.io/
├── videos.json              # ไฟล์ข้อมูลวิดีโอ (สร้างจาก Generator)
├── video-generator.html     # เครื่องมือสร้าง JSON (ใช้บนเครื่องคอม)
├── index.html               # หน้าหลัก (แสดงวิดีโอจาก videos.json)
├── player.html              # หน้าเล่นวิดีโอ
├── js/
│   ├── video-gallery.js    # โหลดข้อมูลจาก videos.json
│   └── player.js
└── ...
```

---

## 🔄 Workflow การทำงาน

```
[1] เปิด video-generator.html
     ↓
[2] เพิ่ม/แก้ไข/ลบวิดีโอ
     ↓
[3] ดาวน์โหลด videos.json
     ↓
[4] วางไฟล์ videos.json ในโปรเจค
     ↓
[5] Git push ขึ้น GitHub
     ↓
[6] เว็บไซต์อัปเดตอัตโนมัติ ✅
```

---

## ✅ ข้อดีของระบบนี้

| ฟีเจอร์ | รายละเอียด |
|---------|-----------|
| ✅ ไม่ต้องใช้ Server | ทำงานบน GitHub Pages ได้เลย |
| ✅ ไม่มีค่าใช้จ่าย | ใช้ GitHub Pages ฟรี |
| ✅ จัดการง่าย | เพียงแค่ดาวน์โหลดไฟล์ JSON แล้ว push |
| ✅ สำรองง่าย | เก็บไฟล์ videos.json ไว้ที่ไหนก็ได้ |
| ✅ ทำงานทุกที่ | เปิด video-generator.html บนเครื่องไหนก็ได้ |
| ✅ ข้อมูลไม่หาย | เก็บใน localStorage ของ browser |

---

## 📝 ตัวอย่างไฟล์ videos.json

```json
[
  {
    "id": "1730543210000",
    "url": "https://drive.google.com/file/d/1abc123/view",
    "category": "animation",
    "title": "แอนิเมชัน 2D",
    "description": "ผลงานแอนิเมชันของนักศึกษาชั้นปีที่ 3",
    "studentName": "สมชาย ใจดี",
    "createdAt": "2025-11-02T10:30:00.000Z"
  },
  {
    "id": "1730543220000",
    "url": "https://drive.google.com/file/d/2def456/view",
    "category": "game",
    "title": "เกม Unity 3D",
    "description": "โปรเจคเกม 3D",
    "studentName": "สมหญิง รักเรียน",
    "createdAt": "2025-11-02T10:31:00.000Z"
  }
]
```

---

## 🔧 การแก้ไขข้อมูลที่มีอยู่แล้ว

### วิธีที่ 1: ใช้ Generator นำเข้าไฟล์เดิม

1. เปิด `video-generator.html`
2. กดปุ่ม "📤 นำเข้า JSON"
3. เลือกไฟล์ `videos.json` ที่มีอยู่
4. แก้ไข/เพิ่ม/ลบตามต้องการ
5. ดาวน์โหลด `videos.json` ใหม่

### วิธีที่ 2: แก้ไขไฟล์โดยตรง

แก้ไขไฟล์ `videos.json` ด้วย Text Editor แล้ว push ขึ้น GitHub

---

## 🚨 ข้อควรระวัง

### 1. รูปแบบ JSON ต้องถูกต้อง
- ใช้ double quotes (`"`) ไม่ใช่ single quotes (`'`)
- ต้องมี comma (`,`) ระหว่างรายการ
- ไม่มี comma หลังรายการสุดท้าย

### 2. Google Drive URL
- ต้องเป็น link แบบ "Anyone with the link can view"
- รูปแบบ: `https://drive.google.com/file/d/xxx/view`

### 3. การ Cache
- บางครั้งเบราว์เซอร์ cache ไฟล์ JSON
- กด Ctrl+F5 (Windows) หรือ Cmd+Shift+R (Mac) เพื่อ hard refresh

---

## 📊 สถิติและรายงาน

Video Generator จะแสดง:
- จำนวนวิดีโอทั้งหมด
- จำนวนวิดีโอแต่ละหมวดหมู่ (แอนิเมชัน, เกม, เว็บ, วิดีโอ, กราฟิก)

---

## 🆘 แก้ปัญหาที่พบบ่อย

### ปัญหา: วิดีโอไม่แสดงบนเว็บ

**แก้ไข:**
1. ตรวจสอบว่า `videos.json` อยู่ในโฟลเดอร์หลัก
2. ตรวจสอบ Console (F12) ว่ามี error หรือไม่
3. ลอง hard refresh (Ctrl+F5)

### ปัญหา: ข้อมูลใน Generator หายหลังปิด Browser

**สาเหตุ:** Browser ล้าง localStorage

**แก้ไข:**
- ดาวน์โหลด `videos.json` สำรองไว้เป็นประจำ
- หรือใช้ "📤 นำเข้า JSON" เพื่อโหลดข้อมูลกลับมา

### ปัญหา: JSON รูปแบบไม่ถูกต้อง

**แก้ไข:**
- ใช้ https://jsonlint.com/ ตรวจสอบไฟล์ JSON
- หรือใช้ Generator ที่สร้างให้อัตโนมัติ (ไม่มีปัญหารูปแบบ)

---

## 📞 สรุป

1. ✅ ใช้ `video-generator.html` จัดการวิดีโอบนเครื่องคอม
2. ✅ ดาวน์โหลด `videos.json`
3. ✅ Push ขึ้น GitHub
4. ✅ เว็บไซต์อัปเดตอัตโนมัติ
5. ✅ ไม่ต้องใช้ Server, ทำงานบน GitHub Pages ได้เลย!

---

**ข้อดี:**
- 🆓 ฟรี ไม่มีค่าใช้จ่าย
- 🚀 ง่าย แค่ push ไฟล์ JSON
- 💾 ปลอดภัย ข้อมูลเก็บใน Git
- 🌐 ใช้ได้ทุกที่ ไม่ต้องพึ่ง Server
