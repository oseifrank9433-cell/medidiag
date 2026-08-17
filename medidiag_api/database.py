from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# A single SQLite file, sitting alongside main.py. For a real multi-facility
# production deployment, swap this connection string for a PostgreSQL one
# (e.g. via an environment variable) -- no other code in this file needs to
# change, since SQLAlchemy abstracts the underlying database engine.
SQLALCHEMY_DATABASE_URL = "sqlite:///./medidiag.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},  # needed only for SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency: yields a DB session, always closed after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
