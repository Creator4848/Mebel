"""
Seed script — run once to populate the database with initial data.
Usage: python seed.py
"""
import sys, os
sys.path.append(os.path.dirname(__file__))

from app.database import SessionLocal, engine
from app import models
from app.auth import hash_password

models.Base.metadata.create_all(bind=engine)
db = SessionLocal()

# ─── Admin user ───────────────────────────────────────────────────────
admin = db.query(models.User).filter(models.User.role == models.UserRole.admin).first()
if not admin:
    admin = models.User(
        name="MebelAkademiya Admin",
        email="admin@mebelakademiya.uz",
        role=models.UserRole.admin,
    )
    db.add(admin)

admin.phone = "+998889884848"
admin.password_hash = hash_password("Grant2tatu")
print("✅ Admin ma'lumotlari yangilandi: +998889884848 / Grant2tatu")

# ─── Courses ──────────────────────────────────────────────────────────
courses_data = [
    dict(emoji="🪑", title="Klassik Kreslo Yasash", category="boshlangich", level="Boshlang'ich",
         level_color="#2a7a4b", bg_gradient="linear-gradient(135deg,#5D3A1A,#A0522D)",
         hours=24, lessons=18, rating=4.9, price=0, description="Noldan klassik kreslo yasash san'atini o'rganasiz."),
    dict(emoji="🛋️", title="Divan va Matros", category="professional", level="Professional",
         level_color="#7a2a2a", bg_gradient="linear-gradient(135deg,#2C1810,#6B3A2A)",
         hours=48, lessons=36, rating=4.8, price=350000, description="To'liq divan yasash texnologiyasi."),
    dict(emoji="🎨", title="Mebel Dizayni AutoCAD", category="dizayn", level="O'rta",
         level_color="#7a5a2a", bg_gradient="linear-gradient(135deg,#8B5E3C,#C9893A)",
         hours=32, lessons=24, rating=4.7, price=250000, description="AutoCAD dasturida mebel loyihalash."),
    dict(emoji="🔧", title="Mebel Restoratsiyasi", category="restoratsiya", level="Boshlang'ich",
         level_color="#2a7a4b", bg_gradient="linear-gradient(135deg,#3D2B1F,#6B4226)",
         hours=20, lessons=15, rating=4.9, price=0, description="Eski mebellarga yangi hayot berasiz."),
    dict(emoji="⚙️", title="CNC Mashinasi Bilan Ishlash", category="professional", level="Professional",
         level_color="#7a2a2a", bg_gradient="linear-gradient(135deg,#1a0d08,#4a2010)",
         hours=60, lessons=42, rating=4.8, price=600000, description="Zamonaviy CNC stanoklar bilan ishlash."),
    dict(emoji="🏡", title="Oshxona Mebeli Kompleksi", category="dizayn", level="O'rta",
         level_color="#7a5a2a", bg_gradient="linear-gradient(135deg,#6B3A2A,#A0522D)",
         hours=40, lessons=28, rating=4.6, price=400000, description="Oshxona uchun to'liq mebel kompleksi yasash."),
]
for cd in courses_data:
    if not db.query(models.Course).filter(models.Course.title == cd["title"]).first():
        db.add(models.Course(**cd))
print("✅ 6 ta kurs qo'shildi")

# ─── Modules ──────────────────────────────────────────────────────────
modules_data = [
    dict(order=1, number="01", title="Yog'och Turlari va Materiallar", hours=12,
         topics=["Qattiq va yumshoq yog'och farqlari","Namlik va quritish jarayoni","Materiallar tanlash mezonlari","Sifat tekshirish usullari"],
         tools=["Namlık o'lchagich","Sirtni tekshirish"]),
    dict(order=2, number="02", title="Asbob-Uskunalar Bilan Ishlash", hours=20,
         topics=["Qo'l asboblari xavfsizligi","Elektr asboblarni sozlash","Stanoklar bilan ishlash","Texnik xizmat ko'rsatish"],
         tools=["Tsirkulyar arra","Frezer","Elektr arra","Zubila"]),
    dict(order=3, number="03", title="O'lchash va Chizma", hours=16,
         topics=["AutoCAD asosları","Texnik chizma o'qish","O'lchov aniqlik darajasi","3D modellashtirish kirish"],
         tools=["AutoCAD","Ruletkа","Kombinatsion gon"]),
    dict(order=4, number="04", title="Birlashtirish Texnikalari", hours=28,
         topics=["Shipa va tenon ulanish","Domino birlashtirish","Yelim va mañkur ishlatish","Konstruktiv mustahkamlik"],
         tools=["Yelim press","Domino aparati","Bolt va vint to'plami"]),
    dict(order=5, number="05", title="Lak va Yuzakovlash", hours=18,
         topics=["Yuzani tayyorlash — zımpara","Bo'yoq va morila qo'llash","Lak qatlamlari va quritish","Sifat nazorat usullari"],
         tools=["Frezer","Zımpara mashinasi","Sprey piston","Yuvgich"]),
    dict(order=6, number="06", title="Loyiha — Real Mebel Yasash", hours=40,
         topics=["Loyiha tanlov va rejalashtirish","Barcha bosqichlarni o'z ichiga olish","Sifat nazorat va test","Taqdimot va baholash"],
         tools=["Barcha asboblar","AutoCAD","Kamera"]),
]
for md in modules_data:
    if not db.query(models.Module).filter(models.Module.title == md["title"]).first():
        db.add(models.Module(**md))
print("✅ 6 ta modul qo'shildi")

# ─── Instructors ──────────────────────────────────────────────────────
instructors_data = [
    dict(name="Akbar Toshmatov", role="Klassik Mebel Ustasi", experience="25 yil tajriba", rating=4.9,
         emoji="👨‍🔧", avatar_color="linear-gradient(135deg,#A0522D,#6B3A2A)"),
    dict(name="Malika Yusupova", role="Mebel Dizayneri", experience="Magistr darajasi", rating=4.8,
         emoji="👩‍🎨", avatar_color="linear-gradient(135deg,#C9893A,#8B5E3C)"),
    dict(name="Jasur Rahimov", role="CNC Mutaxassisi", experience="15 yil tajriba", rating=4.9,
         emoji="👨‍💼", avatar_color="linear-gradient(135deg,#5D3A1A,#3D2B1F)"),
    dict(name="Bobur Nazarov", role="Restoratsiya Ustasi", experience="10 yil tajriba", rating=4.7,
         emoji="🧑‍🏭", avatar_color="linear-gradient(135deg,#8B5E3C,#C19A6B)"),
]
for inst in instructors_data:
    if not db.query(models.Instructor).filter(models.Instructor.name == inst["name"]).first():
        db.add(models.Instructor(**inst))
print("✅ 4 ta usta qo'shildi")

# ─── Plans ────────────────────────────────────────────────────────────
plans_data = [
    dict(name="Starter", price=350000, is_featured=False,
         features=["5 ta asosiy kurs","Video darslar + PDF","Jamiyat forumi","Boshlang'ich sertifikat"]),
    dict(name="Professional", price=850000, is_featured=True,
         features=["Barcha kurslar","Ustaxona (haftada 2 marta)","Shaxsiy mentor","Professional sertifikat","Ish topishda yordam"]),
    dict(name="Biznes", price=1800000, is_featured=False,
         features=["10 ta litsenziya","Maxsus korporativ kurslar","Guruh mentoring","Analytics panel"]),
]
for pd in plans_data:
    if not db.query(models.Plan).filter(models.Plan.name == pd["name"]).first():
        db.add(models.Plan(**pd))
print("✅ 3 ta reja qo'shildi")

db.commit()
db.close()
print("\n🎉 Seed muvaffaqiyatli bajarildi!")
