from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from backend.app import models, schemas
from backend.app.database import get_db

router = APIRouter(tags=["public"])


@router.get("/modules", response_model=List[schemas.ModuleOut])
def list_modules(db: Session = Depends(get_db)):
    return db.query(models.Module).filter(models.Module.is_active == True).order_by(models.Module.order).all()


@router.get("/instructors", response_model=List[schemas.InstructorOut])
def list_instructors(db: Session = Depends(get_db)):
    return db.query(models.Instructor).filter(models.Instructor.is_active == True).all()


@router.get("/plans", response_model=List[schemas.PlanOut])
def list_plans(db: Session = Depends(get_db)):
    return db.query(models.Plan).filter(models.Plan.is_active == True).order_by(models.Plan.price).all()
