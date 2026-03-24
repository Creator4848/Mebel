from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.auth import get_current_user
from app.database import get_db

router = APIRouter(prefix="/enrollments", tags=["enrollments"])


@router.post("", response_model=schemas.EnrollmentOut, status_code=201)
def enroll(
    data: schemas.EnrollmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if not data.course_id and not data.plan_id:
        raise HTTPException(status_code=400, detail="Kurs yoki reja tanlang")
    # Check if already enrolled
    existing = db.query(models.Enrollment).filter(
        models.Enrollment.user_id == current_user.id,
        models.Enrollment.course_id == data.course_id,
        models.Enrollment.plan_id == data.plan_id,
    ).first()
    if existing:
        return existing
    enrollment = models.Enrollment(
        user_id=current_user.id,
        course_id=data.course_id,
        plan_id=data.plan_id,
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


@router.get("/my", response_model=List[schemas.EnrollmentOut])
def my_enrollments(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.Enrollment).filter(models.Enrollment.user_id == current_user.id).all()
