from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List, Any
from datetime import datetime
from app.models import UserRole, PaymentStatus, PaymentProvider


# ─── Auth ─────────────────────────────────────────────────
class UserRegister(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    password: str

class UserLogin(BaseModel):
    phone: str
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    phone: str
    email: Optional[str] = None
    role: UserRole
    created_at: datetime
    model_config = {"from_attributes": True}

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ─── Course ────────────────────────────────────────────────
class CourseBase(BaseModel):
    emoji: str = "📚"
    title: str
    category: str
    level: str
    level_color: str = "#A0522D"
    bg_gradient: str = "linear-gradient(135deg,#2C1810,#6B3A2A)"
    hours: int = 0
    lessons: int = 0
    rating: float = 5.0
    price: int = 0
    description: Optional[str] = None
    youtube_link: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class CourseUpdate(CourseBase):
    pass

class CourseOut(CourseBase):
    id: int
    is_active: bool
    created_at: datetime
    model_config = {"from_attributes": True}


# ─── Module ────────────────────────────────────────────────
class ModuleBase(BaseModel):
    order: int = 0
    number: str
    title: str
    hours: int = 0
    topics: List[str] = []
    tools: List[str] = []

class ModuleCreate(ModuleBase):
    pass

class ModuleUpdate(ModuleBase):
    pass

class ModuleOut(ModuleBase):
    id: int
    is_active: bool
    model_config = {"from_attributes": True}


# ─── Instructor ────────────────────────────────────────────
class InstructorBase(BaseModel):
    name: str
    role: str
    experience: Optional[str] = None
    rating: float = 5.0
    emoji: str = "👨‍🏫"
    avatar_color: str = "linear-gradient(135deg,#A0522D,#6B3A2A)"
    bio: Optional[str] = None

class InstructorCreate(InstructorBase):
    pass

class InstructorUpdate(InstructorBase):
    pass

class InstructorOut(InstructorBase):
    id: int
    is_active: bool
    model_config = {"from_attributes": True}


# ─── Plan ──────────────────────────────────────────────────
class PlanBase(BaseModel):
    name: str
    price: int
    features: List[str] = []
    is_featured: bool = False

class PlanCreate(PlanBase):
    pass

class PlanUpdate(PlanBase):
    pass

class PlanOut(PlanBase):
    id: int
    is_active: bool
    model_config = {"from_attributes": True}


# ─── Enrollment ────────────────────────────────────────────
class EnrollmentCreate(BaseModel):
    course_id: Optional[int] = None
    plan_id: Optional[int] = None

class EnrollmentOut(BaseModel):
    id: int
    user_id: int
    course_id: Optional[int] = None
    plan_id: Optional[int] = None
    is_paid: bool
    created_at: datetime
    model_config = {"from_attributes": True}


# ─── Payment ───────────────────────────────────────────────
class PaymentCreate(BaseModel):
    enrollment_id: int
    provider: PaymentProvider

class PaymentOut(BaseModel):
    id: int
    enrollment_id: int
    amount: int
    provider: PaymentProvider
    status: PaymentStatus
    transaction_id: Optional[str] = None
    created_at: datetime
    model_config = {"from_attributes": True}


# ─── Generic ───────────────────────────────────────────────
class Msg(BaseModel):
    message: str
