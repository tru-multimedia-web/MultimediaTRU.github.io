# 📸 คู่มือการใช้งานภาพปก (Thumbnail)

## ⭐ ฟีเจอร์ใหม่: ภาพปกสำหรับวิดีโอ

ตั้งแต่ตอนนี้ คุณสามารถเพิ่มภาพปกแสดงในหน้า Gallery แทนการใช้ iframe ของ Google Drive ได้แล้ว!

---

## 🎯 วิธีการเพิ่มภาพปก

### 1. เตรียมภาพปก
- ขนาดแนะนำ: **1280x720 px** (อัตราส่วน 16:9)
- รูปแบบไฟล์: **JPG, PNG, WebP**
- ขนาดไฟล์: ไม่เกิน 500 KB (เพื่อความเร็วในการโหลด)

### 2. อัปโหลดภาพไปยังที่เก็บออนไลน์

#### ตัวเลือก A: Google Drive (แนะนำ)
1. อัปโหลดภาพไปยัง Google Drive
2. คลิกขวา > Get link > เปลี่ยนเป็น "Anyone with the link"
3. คัดลอก URL (รูปแบบ: `https://drive.google.com/file/d/XXXXX/view`)
4. แปลงเป็น Direct Link: 
   ```
   จาก: https://drive.google.com/file/d/1abc123xyz/view
   เป็น: https://drive.google.com/uc?export=view&id=1abc123xyz
   ```

#### ตัวเลือก B: Imgur
1. ไปที่ [Imgur.com](https://imgur.com)
2. คลิก "New post" > อัปโหลดภาพ
3. คลิกขวาที่ภาพ > "Copy image address"
4. ใช้ URL นี้ (รูปแบบ: `https://i.imgur.com/xxxxx.jpg`)

#### ตัวเลือก C: GitHub (ถ้าใช้ GitHub Pages)
1. สร้างโฟลเดอร์ `images/thumbnails/` ในโปรเจค
2. อัปโหลดภาพไปยังโฟลเดอร์นี้
3. ใช้ relative path: `images/thumbnails/my-video.jpg`

---

## 📝 วิธีเพิ่มวิดีโอพร้อมภาพปก

### ในหน้า Video Generator:

1. **Google Drive URL*** - URL วิดีโอของคุณ (จำเป็น)
   ```
   https://drive.google.com/file/d/xxx/view
   ```

2. **URL ภาพปก (Thumbnail)** - URL ภาพปกของคุณ (ไม่บังคับ)
   ```
   https://i.imgur.com/example.jpg
   ```
   > 💡 **หมายเหตุ**: ถ้าไม่ใส่ URL ภาพปก ระบบจะใช้ภาพจากวิดีโอแทน (แบบเดิม)

3. กรอกข้อมูลอื่นๆ ตามปกติ (หมวดหมู่, ชื่อ, คำอธิบาย, ชื่อนักศึกษา)

4. คลิก **"เพิ่มวิดีโอ"**

5. ดาวน์โหลด `videos.json` และวางในโฟลเดอร์ `js/`

---

## 🎨 ตัวอย่างผลลัพธ์

### ✅ กรณีมีภาพปก:
- แสดงภาพปกที่คุณกำหนด
- มีปุ่มเล่นสีแดงตรงกลาง (แบบ YouTube)
- เมื่อ hover: ภาพซูมเข้า + ปุ่มเล่นขยาย
- เมื่อคลิก: ไปหน้า player และเล่นวิดีโอจาก Google Drive

### ⚪ กรณีไม่มีภาพปก:
- แสดง iframe Google Drive แบบเดิม
- ไม่มีปุ่มเล่น
- ยังคงใช้งานได้ปกติ

---

## 🔧 ตัวอย่าง JSON

```json
[
  {
    "id": "1234567890",
    "url": "https://drive.google.com/file/d/xxx/view",
    "thumbnail": "https://i.imgur.com/example.jpg",
    "category": "animation",
    "title": "ชื่อวิดีโอ",
    "description": "คำอธิบาย",
    "studentName": "ชื่อนักศึกษา",
    "createdAt": "2025-11-03T00:00:00.000Z"
  }
]
```

---

## ⚡ Tips & Best Practices

### ✅ ควรทำ:
- ใช้ภาพที่มีคุณภาพดี (ชัดเจน ไม่เบลอ)
- ใช้ภาพที่สื่อความหมายของวิดีโอ
- ใช้ขนาดไฟล์เล็ก (optimize ด้วย TinyPNG หรือ Squoosh)
- ใช้ Imgur หรือ Google Drive สำหรับความสะดวก

### ❌ ไม่ควรทำ:
- อัปโหลดไฟล์ขนาดใหญ่ (>1 MB)
- ใช้ภาพที่มี copyright
- ใช้ URL ที่ต้อง login ก่อนดู
- ใช้ภาพที่ไม่เกี่ยวข้องกับวิดีโอ

---

## 🛠️ Troubleshooting

### ภาพปกไม่แสดง:
1. ตรวจสอบว่า URL ภาพถูกต้อง (เปิดใน tab ใหม่ได้หรือไม่)
2. ตรวจสอบว่าเป็น Direct Link (เห็นภาพโดยตรง ไม่ใช่หน้า landing page)
3. ตรวจสอบ CORS policy (Imgur และ Google Drive รองรับ)
4. ตรวจสอบว่าไฟล์ videos.json อยู่ในโฟลเดอร์ `js/` แล้ว

### ปุ่มเล่นไม่แสดง:
- ตรวจสอบว่าเพิ่ม CSS ใหม่ไปยัง `css/styles.css` แล้ว
- Clear cache ของ browser (Ctrl+F5 หรือ Cmd+Shift+R)

### วิดีโอไม่เล่น:
- ตรวจสอบ Google Drive URL ว่าถูกต้อง
- ตรวจสอบ Permission ของวิดีโอ (Anyone with the link)

---

## 🎬 ตัวอย่าง URL ภาพปกที่ใช้ได้

```
✅ https://i.imgur.com/abc123.jpg
✅ https://drive.google.com/uc?export=view&id=1abc123
✅ images/thumbnails/my-video.jpg (relative path)
✅ https://example.com/image.png

❌ https://drive.google.com/file/d/xxx/view (ไม่ใช่ Direct Link)
❌ https://www.facebook.com/photo.php?xxx (ต้อง login)
❌ C:\Users\Desktop\image.jpg (local path ใช้ไม่ได้)
```

---

## 📚 เอกสารเพิ่มเติม

- [Imgur Upload Guide](https://help.imgur.com/hc/en-us/articles/210076663-Uploading-Content)
- [Google Drive Sharing](https://support.google.com/drive/answer/2494822)
- [Image Optimization with TinyPNG](https://tinypng.com/)
- [Squoosh Image Compressor](https://squoosh.app/)

---

## 💬 ติดต่อสอบถาม

หากมีปัญหาหรือข้อสงสัย:
- แก้ไขที่ไฟล์ `js/video-gallery.js` หรือ `css/styles.css`
- ติดต่อผู้ดูแลระบบ

---

**สร้างโดย**: Multimedia TRU Admin Tool  
**อัพเดทล่าสุด**: 3 พฤศจิกายน 2568  
**เวอร์ชัน**: 2.0 (รองรับภาพปก)
