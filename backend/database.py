from time import sleep

import bcrypt
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Date, ForeignKey, Integer, String, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker


class Base(DeclarativeBase):
    pass


class Users(Base):
    __tablename__ = "knot_users"

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(30), nullable=False)
    password = Column(String(50), nullable=False)


class Database:

    def __init__(self, app, db_config: dict):
        user = db_config["user"]
        password = db_config["password"]
        host = db_config["host"]
        port = db_config["port"]
        database = db_config["database"]

        sql_connect_url = (
            f"mysql+mysqlconnector://{user}:{password}@{host}:{port}/{database}"
        )
        app.config["SQLALCHEMY_DATABASE_URI"] = sql_connect_url

        self.db = SQLAlchemy(model_class=Base)
        self.db.init_app(app)

        with app.app_context():
            self.db.create_all()

        self.session = self.db.session
        self.db_config = db_config

    def auth_user(self, req_data: dict) -> bool:
        if not "user" in req_data or not "password" in req_data:
            print("Auth user: missing fields")
            return False

        user = req_data["user"]
        password = req_data["password"]

        user_data = self.session.query(Users).filter_by(username=user).first()
        if not user_data:
            return False

        password = password.encode()
        password_correct = user_data.password.encode()

        if bcrypt.checkpw(password, password_correct):
            return True

        return False
