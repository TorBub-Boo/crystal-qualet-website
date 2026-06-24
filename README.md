# Crystal Qualet Co., Ltd. — Corporate Website

เว็บไซต์บริษัทแบบ single-page สองภาษา (ไทย/อังกฤษ) สำหรับ **บริษัท คริสตัล ควาเลท จำกัด** (Crystal Qualet Co., Ltd.) — ผู้พัฒนาและจัดจำหน่ายผลิตภัณฑ์ดูแลผิว/เครื่องสำอางผ่านแพลตฟอร์มอีคอมเมิร์ซชั้นนำ (Shopee, Lazada, TikTok Shop)

## คุณสมบัติ (Features)

- ดีไซน์ทันสมัย โทนพรีเมียม (jewel teal + champagne gold) สื่อถึงความ "ใสกระจ่าง" ของแบรนด์
- รองรับ 2 ภาษาในหน้าเดียว สลับ TH/EN ได้ทันที (จำค่าไว้ใน localStorage) — รวมถึงข้อความใน dropdown
- Responsive เต็มรูปแบบ: มือถือ / แท็บเล็ต / เดสก์ท็อป พร้อมเมนูแฮมเบอร์เกอร์
- เอฟเฟกต์ระดับโปร: scroll reveal, ตัวเลขนับขึ้น (counter), การ์ด hover, glassmorphism
- **No-JS fallback**: หาก JavaScript ปิด/โหลดไม่สำเร็จ เนื้อหายังแสดงครบ (reveal จะซ่อนเฉพาะตอน JS ทำงาน)
- ฟอร์มติดต่อพร้อมการตรวจสอบข้อมูล (validation) ฝั่งหน้าเว็บ
- ครบทุกสถานะ UI: hover / focus / error / success / empty
- SEO: meta description, keywords, robots, Open Graph + Twitter Card (พร้อม OG image), JSON-LD (Organization), `sitemap.xml`, `robots.txt`
- Accessibility: semantic HTML, skip link, focus-visible, `scroll-padding`, `prefers-reduced-motion`, `aria-pressed`, `aria-hidden` บน SVG ตกแต่ง
- ไม่มี dependency / build step — เปิดไฟล์ได้เลย

## โครงสร้างไฟล์

```
crystal-qualet-website/
├── index.html          # หน้าเว็บหลัก (TH/EN ในไฟล์เดียว)
├── css/
│   └── styles.css      # design system + สไตล์ทั้งหมด
├── js/
│   └── main.js         # nav, สลับภาษา, reveal, counters, ฟอร์ม
├── assets/
│   ├── logo.svg        # โลโก้คริสตัล (crystal facet)
│   ├── favicon.svg     # ไอคอนเว็บ
│   └── og-image.svg    # ภาพแชร์โซเชียล (1200×630)
├── robots.txt          # สำหรับ search engine
├── sitemap.xml         # แผนผังเว็บ
├── README.md
└── .gitignore
```

## Deploy — Cloudflare Pages + crystalqualet.co.th

เว็บนี้เป็น static site ไม่ต้อง build เหมาะกับ **Cloudflare Pages** โดเมน `crystalqualet.co.th` อยู่ใน Cloudflare แล้ว ทำตามนี้ได้เลย

### วิธี A — เชื่อม GitHub (แนะนำ, อัปเดตอัตโนมัติ)

**1. Push โค้ดขึ้น GitHub**

```bash
cd crystal-qualet-website
git add .
git commit -m "Prepare Cloudflare Pages deploy"
gh repo create crystal-qualet-website --public --source=. --push
# หรือสร้าง repo เองแล้ว: git remote add origin ... && git push -u origin master
```

**2. สร้าง Pages project**

1. เปิด [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. เลือก repo `crystal-qualet-website`
3. ตั้งค่า build:

| ช่อง | ค่า |
|------|-----|
| Production branch | `master` (หรือ `main`) |
| Build command | *(ว่าง)* |
| Build output directory | `/` |

4. กด **Save and Deploy** — จะได้ URL แบบ `https://crystal-qualet-website.pages.dev`

**3. ผูกโดเมน**

1. Pages project → **Custom domains** → **Set up a custom domain**
2. เพิ่ม `www.crystalqualet.co.th` ก่อน (canonical ในเว็บใช้ www)
3. เพิ่ม `crystalqualet.co.th` (apex) ด้วย

Cloudflare จะสร้าง/อัปเดต DNS record ให้อัตโนมัติ (CNAME ไป Pages)

**4. Redirect apex → www (แนะนำ)**

Dashboard → **Rules** → **Redirect Rules** → Create rule:

- **If:** Hostname equals `crystalqualet.co.th`
- **Then:** Dynamic redirect → `https://www.crystalqualet.co.th${uri.path}`
- Status: **301**

**5. SSL**

Cloudflare จัดการ SSL ให้อัตโนมัติ — ตรวจว่า **SSL/TLS** → **Full (strict)**

---

### วิธี B — อัปโหลดตรงด้วย Wrangler (ไม่ใช้ GitHub)

```bash
cd crystal-qualet-website
npx wrangler login
npx wrangler pages deploy . --project-name=crystal-qualet
```

จากนั้นผูกโดเมนใน Dashboard เหมือนขั้นตอนที่ 3–5 ด้านบน

---

### หลัง deploy ควรเช็ก

- [ ] `https://www.crystalqualet.co.th` เปิดได้
- [ ] `https://crystalqualet.co.th` redirect ไป www
- [ ] โลโก้/รูปใน `/assets/` โหลดครบ
- [ ] สลับ TH/EN ทำงาน
- [ ] `/robots.txt` และ `/sitemap.xml` เปิดได้

### อัปเดตเว็บครั้งถัดไป

- **GitHub:** push ขึ้น repo → Pages deploy ใหม่เอง
- **Wrangler:** รันคำสั่ง `npx wrangler pages deploy .` อีกครั้ง

---

## วิธีเปิดดู (Run locally)

เปิดไฟล์ `index.html` ในเบราว์เซอร์ได้โดยตรง หรือรันเซิร์ฟเวอร์เล็ก ๆ:

```bash
# Python 3
python3 -m http.server 5173
# จากนั้นเปิด http://localhost:5173
```

## ข้อมูลบริษัท (อ้างอิงจากการค้นหาสาธารณะ)

| รายการ | ข้อมูล |
| --- | --- |
| ชื่อบริษัท | บริษัท คริสตัล ควาเลท จำกัด (CRYSTAL QUALET CO., LTD.) |
| เลขทะเบียนนิติบุคคล | 0115567011384 |
| วันจดทะเบียน | 25 มีนาคม 2567 |
| ทุนจดทะเบียน | 1,000,000 บาท |
| ประเภทธุรกิจ | ขายส่งเครื่องสำอาง / ผลิตภัณฑ์ดูแลผิว, E-commerce |
| ช่องทางขาย | Shopee, Lazada, TikTok Shop |
| ที่ตั้ง | ต.สำโรงเหนือ อ.เมืองสมุทรปราการ จ.สมุทรปราการ |

## สิ่งที่ควรปรับก่อนนำขึ้นใช้งานจริง (Placeholders)

ข้อมูลต่อไปนี้เป็นค่าตัวอย่าง/สมมุติ ควรแทนที่ด้วยข้อมูลจริงของบริษัท:

- **อีเมล** `info@crystalqualet.co.th` และโดเมน `crystalqualet.co.th` (สมมุติ)
- **เลขที่อยู่** บ้านเลขที่ "456/2" (ยืนยันแล้ว)
- **รายการผลิตภัณฑ์และรูปภาพ** เป็นตัวอย่างเพื่อการนำเสนอ ควรแทนด้วยสินค้าจริง + ภาพถ่ายจริง
- **ลิงก์ร้านค้า** Shopee / Lazada / TikTok Shop ปัจจุบันชี้ไปที่ส่วนติดต่อ ควรใส่ URL ร้านจริง
- **เบอร์โทรศัพท์** ยังไม่ได้ระบุ
- **ฟอร์มติดต่อ** ทำงานเฉพาะฝั่งหน้าเว็บ (demo) ยังไม่ได้เชื่อมต่อระบบส่งอีเมล/แบ็กเอนด์
- **สถิติในส่วน Hero/Stats** เป็นข้อเท็จจริงที่ตรวจสอบได้ (ปีก่อตั้ง 2567, 3 แพลตฟอร์ม, ทุนจดทะเบียน 1 ล้านบาท, สินค้าของแท้) — หลีกเลี่ยงตัวเลขที่กล่าวอ้างเกินจริง เพื่อความน่าเชื่อถือ หากมีตัวเลขจริง (เช่น ยอดรีวิว/จำนวนลูกค้า) สามารถเพิ่มได้
- **URL/โดเมนใน meta tags, sitemap, JSON-LD** ใช้ `crystalqualet.co.th` (สมมุติ) — เปลี่ยนเป็นโดเมนจริงเมื่อ deploy

> หมายเหตุ: ทะเบียนภาษาอังกฤษสะกดว่า "QUALET" (ตามกรมพัฒนาธุรกิจการค้า) เว็บนี้ใช้ "Qualet" เป็นหลัก
