from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app import models, schemas
from backend.app.database import get_db

router = APIRouter(prefix="/courses", tags=["courses"])


@router.get("", response_model=List[schemas.CourseOut])
def list_courses(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    q = db.query(models.Course).filter(models.Course.is_active == True)
    if category and category != "all":
        q = q.filter(models.Course.category == category)
    return q.order_by(models.Course.id).all()


@router.get("/{course_id}", response_model=schemas.CourseOut)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(models.Course).filter(
        models.Course.id == course_id,
        models.Course.is_active == True
    ).first()
    if not course:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Kurs topilmadi")
    return course
