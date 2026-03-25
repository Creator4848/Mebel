from sqlalchemy import Column, Integer, String, Boolean, Float, Text, ForeignKey, DateTime, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from backend.app.database import Base


class UserRole(str, enum.Enum):
    user = "user"
    admin = "admin"


class PaymentStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"
    failed = "failed"


class PaymentProvider(str, enum.Enum):
    payme = "payme"
    click = "click"


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    phone = Column(String(20), unique=True, nullable=False, index=True)
    email = Column(String(200), unique=True, nullable=True)
    password_hash = Column(String(300), nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.user, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    enrollments = relationship("Enrollment", back_populates="user")


class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    emoji = Column(String(10), default="📚")
    title = Column(String(300), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    level = Column(String(50), nullable=False)
    level_color = Column(String(20), default="#A0522D")
    bg_gradient = Column(String(200), default="linear-gradient(135deg,#2C1810,#6B3A2A)")
    hours = Column(Integer, default=0)
    lessons = Column(Integer, default=0)
    rating = Column(Float, default=5.0)
    price = Column(Integer, default=0)  # 0 = free, in so'm
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    enrollments = relationship("Enrollment", back_populates="course")


class Module(Base):
    __tablename__ = "modules"
    id = Column(Integer, primary_key=True, index=True)
    order = Column(Integer, default=0)
    number = Column(String(5), nullable=False)  # "01", "02", ...
    title = Column(String(300), nullable=False)
    hours = Column(Integer, default=0)
    topics = Column(JSON, default=list)   # list of strings
    tools = Column(JSON, default=list)    # list of strings
    is_active = Column(Boolean, default=True)


class Instructor(Base):
    __tablename__ = "instructors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    role = Column(String(200), nullable=False)
    experience = Column(String(100), nullable=True)   # "25 yil tajriba"
    rating = Column(Float, default=5.0)
    emoji = Column(String(10), default="👨‍🏫")
    avatar_color = Column(String(200), default="linear-gradient(135deg,#A0522D,#6B3A2A)")
    bio = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)


class Plan(Base):
    __tablename__ = "plans"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    price = Column(Integer, nullable=False)   # monthly price in so'm
    features = Column(JSON, default=list)     # list of strings
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    enrollments = relationship("Enrollment", back_populates="plan")


class Enrollment(Base):
    __tablename__ = "enrollments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    plan_id = Column(Integer, ForeignKey("plans.id"), nullable=True)
    is_paid = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
    plan = relationship("Plan", back_populates="enrollments")
    payments = relationship("Payment", back_populates="enrollment")


class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    enrollment_id = Column(Integer, ForeignKey("enrollments.id"), nullable=False)
    amount = Column(Integer, nullable=False)  # in tiyin (x100)
    provider = Column(SQLEnum(PaymentProvider), nullable=False)
    status = Column(SQLEnum(PaymentStatus), default=PaymentStatus.pending)
    transaction_id = Column(String(300), nullable=True)
    raw_response = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    enrollment = relationship("Enrollment", back_populates="payments")
