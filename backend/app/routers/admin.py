"""
Admin CRUD router — requires admin role.
Covers: Courses, Modules, Instructors, Plans, Users, Enrollments, Payments.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.auth import require_admin
from app.database import get_db

router = APIRouter(prefix="/admin", tags=["admin"])


# ─── Courses ───────────────────────────────────────────────
@router.get("/courses", response_model=List[schemas.CourseOut])
def admin_list_courses(db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    return db.query(models.Course).filter(models.Course.is_active == True).order_by(models.Course.id).all()

@router.post("/courses", response_model=schemas.CourseOut, status_code=201)
def admin_create_course(data: schemas.CourseCreate, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    course = models.Course(**data.model_dump())
    db.add(course); db.commit(); db.refresh(course)
    return course

@router.put("/courses/{course_id}", response_model=schemas.CourseOut)
def admin_update_course(course_id: int, data: schemas.CourseUpdate, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course: raise HTTPException(404, "Kurs topilmadi")
    for k, v in data.model_dump().items(): setattr(course, k, v)
    db.commit(); db.refresh(course)
    return course

@router.delete("/courses/{course_id}")
def admin_delete_course(course_id: int, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course: raise HTTPException(404, "Kurs topilmadi")
    course.is_active = False; db.commit()
    return {"message": "Kurs o'chirildi"}


# ─── Modules ───────────────────────────────────────────────
@router.get("/modules", response_model=List[schemas.ModuleOut])
def admin_list_modules(db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    return db.query(models.Module).filter(models.Module.is_active == True).order_by(models.Module.order).all()

@router.post("/modules", response_model=schemas.ModuleOut, status_code=201)
def admin_create_module(data: schemas.ModuleCreate, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    m = models.Module(**data.model_dump())
    db.add(m); db.commit(); db.refresh(m)
    return m

@router.put("/modules/{module_id}", response_model=schemas.ModuleOut)
def admin_update_module(module_id: int, data: schemas.ModuleUpdate, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    m = db.query(models.Module).filter(models.Module.id == module_id).first()
    if not m: raise HTTPException(404, "Modul topilmadi")
    for k, v in data.model_dump().items(): setattr(m, k, v)
    db.commit(); db.refresh(m)
    return m

@router.delete("/modules/{module_id}")
def admin_delete_module(module_id: int, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    m = db.query(models.Module).filter(models.Module.id == module_id).first()
    if not m: raise HTTPException(404, "Modul topilmadi")
    m.is_active = False; db.commit()
    return {"message": "Modul o'chirildi"}


# ─── Instructors ───────────────────────────────────────────
@router.get("/instructors", response_model=List[schemas.InstructorOut])
def admin_list_instructors(db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    return db.query(models.Instructor).filter(models.Instructor.is_active == True).all()

@router.post("/instructors", response_model=schemas.InstructorOut, status_code=201)
def admin_create_instructor(data: schemas.InstructorCreate, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    inst = models.Instructor(**data.model_dump())
    db.add(inst); db.commit(); db.refresh(inst)
    return inst

@router.put("/instructors/{inst_id}", response_model=schemas.InstructorOut)
def admin_update_instructor(inst_id: int, data: schemas.InstructorUpdate, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    inst = db.query(models.Instructor).filter(models.Instructor.id == inst_id).first()
    if not inst: raise HTTPException(404, "Usta topilmadi")
    for k, v in data.model_dump().items(): setattr(inst, k, v)
    db.commit(); db.refresh(inst)
    return inst

@router.delete("/instructors/{inst_id}")
def admin_delete_instructor(inst_id: int, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    inst = db.query(models.Instructor).filter(models.Instructor.id == inst_id).first()
    if not inst: raise HTTPException(404, "Usta topilmadi")
    inst.is_active = False; db.commit()
    return {"message": "Usta o'chirildi"}


# ─── Plans ─────────────────────────────────────────────────
@router.get("/plans", response_model=List[schemas.PlanOut])
def admin_list_plans(db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    return db.query(models.Plan).filter(models.Plan.is_active == True).order_by(models.Plan.price).all()

@router.post("/plans", response_model=schemas.PlanOut, status_code=201)
def admin_create_plan(data: schemas.PlanCreate, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    plan = models.Plan(**data.model_dump())
    db.add(plan); db.commit(); db.refresh(plan)
    return plan

@router.put("/plans/{plan_id}", response_model=schemas.PlanOut)
def admin_update_plan(plan_id: int, data: schemas.PlanUpdate, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    plan = db.query(models.Plan).filter(models.Plan.id == plan_id).first()
    if not plan: raise HTTPException(404, "Reja topilmadi")
    for k, v in data.model_dump().items(): setattr(plan, k, v)
    db.commit(); db.refresh(plan)
    return plan

@router.delete("/plans/{plan_id}")
def admin_delete_plan(plan_id: int, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    plan = db.query(models.Plan).filter(models.Plan.id == plan_id).first()
    if not plan: raise HTTPException(404, "Reja topilmadi")
    plan.is_active = False; db.commit()
    return {"message": "Reja o'chirildi"}


# ─── Users ─────────────────────────────────────────────────
@router.get("/users", response_model=List[schemas.UserOut])
def admin_list_users(db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    return db.query(models.User).order_by(models.User.created_at.desc()).all()

@router.patch("/users/{user_id}/role")
def admin_set_role(user_id: int, role: str, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user: raise HTTPException(404, "Foydalanuvchi topilmadi")
    user.role = role; db.commit()
    return {"message": "Rol o'zgartirildi"}


# ─── Enrollments & Payments ────────────────────────────────
@router.get("/enrollments", response_model=List[schemas.EnrollmentOut])
def admin_list_enrollments(db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    return db.query(models.Enrollment).order_by(models.Enrollment.created_at.desc()).all()

@router.get("/payments", response_model=List[schemas.PaymentOut])
def admin_list_payments(db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    return db.query(models.Payment).order_by(models.Payment.created_at.desc()).all()
