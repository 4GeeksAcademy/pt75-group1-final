from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from datetime import datetime, timezone

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True, nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)
    is_active = db.Column(db.Boolean, nullable=False)
    favorites = db.relationship('Favorite', backref='user', lazy=True)
    reservations = db.relationship('Reservation', backref='user', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "is_active": self.is_active
        }

class Restaurant(db.Model):
    __tablename__ = "restaurant"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def serialize(self):
        return {
            "restaurant_id": self.id,
            "user_id": self.user_id
        }

class Favorite(db.Model):
    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurant.id'), nullable=False)

    def serialize(self):
        return {
            "favorite_id": self.id,
            "user_id": self.user_id,
            "restaurant_id": self.restaurant_id
        }

class Reservation(db.Model):
    __tablename__ = "reservation"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurant.id'), nullable=False)
    time_created = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    reservation_time = db.Column(db.DateTime, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    def serialize(self):
        return {
            "reservation_id": self.id,
            "user_id": self.user_id,
            "restaurant_id": self.restaurant_id,
            "time_created": self.time_created.isoformat(),
            "reservation_time": self.reservation_time.isoformat(),
            "is_active": self.is_active
        }