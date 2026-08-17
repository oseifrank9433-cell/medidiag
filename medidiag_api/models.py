from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    """Replaces the old localStorage 'medidiag_users' array."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)  # never stored in plain text
    role = Column(String, nullable=False)  # e.g. "Clinical Officer", "Administrator"
    account_type = Column(String, nullable=False)  # "clinician" | "admin"
    facility = Column(String, nullable=False, index=True)
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login_at = Column(DateTime(timezone=True), nullable=True)

    records = relationship("Record", back_populates="clinician", cascade="all, delete-orphan")


class Record(Base):
    """Replaces the old localStorage 'medidiag_records_<email>' arrays."""
    __tablename__ = "records"

    id = Column(Integer, primary_key=True, index=True)
    clinician_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    patient_name = Column(String, nullable=False)
    age = Column(String, nullable=True)
    sex = Column(String, nullable=True)
    vitals_temperature = Column(String, nullable=True)
    vitals_fever_days = Column(String, nullable=True)
    symptoms = Column(JSON, nullable=False)  # list of symptom ids

    diagnosis = Column(String, nullable=False)
    drug = Column(String, nullable=True)
    malaria_pct = Column(Float, nullable=False)
    typhoid_pct = Column(Float, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    clinician = relationship("User", back_populates="records")


class FacilitySettings(Base):
    """Replaces the old localStorage 'medidiag_facility_settings_<facility>' objects."""
    __tablename__ = "facility_settings"

    facility = Column(String, primary_key=True, index=True)
    display_name = Column(String, nullable=True)
    address = Column(String, nullable=True)
    contact = Column(String, nullable=True)
    confidence_threshold = Column(Float, nullable=False, default=60.0)
