# """
# This module takes care of starting the API Server, Loading the DB and Adding the endpoints
# """
# from flask import Flask, request, jsonify, url_for, Blueprint
# from api.models import db, User
# from api.utils import generate_sitemap, APIException
# from flask_cors import CORS

# api = Blueprint('api', __name__)

# # Allow CORS requests to this API
# CORS(api)


# @api.route('/hello', methods=['POST', 'GET'])
# def handle_hello():

#     response_body = {
#         "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
#     }

#     return jsonify(response_body), 200

"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, Blueprint, jsonify, request, abort
from flask_cors import CORS
from datetime import datetime, timezone
from api.models import db, User, Restaurant, Favorite, Reservation



api = Blueprint('api', __name__)
CORS(api)

# User


@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.serialize() for user in users])


@api.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.serialize())


@api.route('/user', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(
        username=data['username'],
        email=data['email'],
        password=data['password'],
        first_name=data['first_name'],
        last_name=data['last_name'],
        is_active=data['is_active']
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()), 201


@api.route('/user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    user = User.query.get_or_404(user_id)
    user.username = data['username']
    user.email = data['email']
    user.password = data['password']
    user.first_name = data['first_name']
    user.last_name = data['last_name']
    user.is_active = data['is_active']
    db.session.commit()
    return jsonify(user.serialize())


@api.route('/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return 'user deleted', 204


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"msg": "Email and password required."}), 400

    user = User.query.filter_by(email=email).first()

    if not user or user.password != password:
        return jsonify({"msg": "Invalid credentials."}), 401

    # Optional: You could generate a token here later
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "is_active": user.is_active
    }), 200


# Restaurant
@api.route('/restaurants', methods=['GET'])
def get_restaurants():
    restaurants = Restaurant.query.all()
    return jsonify([restaurant.serialize() for restaurant in restaurants])


@api.route('/restaurant/<int:restaurant_id>', methods=['GET'])
def get_restaurant(restaurant_id):
    restaurant = Restaurant.query.get_or_404(restaurant_id)
    return jsonify(restaurant.serialize())


@api.route('/restaurant', methods=['POST'])
def create_restaurant():
    data = request.get_json()
    new_restaurant = Restaurant(user_id=data['user_id'])
    db.session.add(new_restaurant)
    db.session.commit()
    return jsonify(new_restaurant.serialize()), 201

# Favorite


@api.route('/favorites', methods=['GET'])
def get_favorites():
    favorites = Favorite.query.all()
    return jsonify([favorite.serialize() for favorite in favorites])


@api.route('/favorite', methods=['POST'])
def create_favorite():
    data = request.get_json()
    new_favorite = Favorite(
        user_id=data['user_id'],
        restaurant_id=data['restaurant_id']
    )
    db.session.add(new_favorite)
    db.session.commit()
    return jsonify(new_favorite.serialize()), 201


@api.route('/favorite/<int:favorite_id>', methods=['DELETE'])
def delete_favorite(favorite_id):
    favorite = Favorite.query.get_or_404(favorite_id)
    db.session.delete(favorite)
    db.session.commit()
    return '', 204

# Reservation


@api.route('/reservations', methods=['GET'])
def get_reservations():
    reservations = Reservation.query.all()
    return jsonify([reservation.serialize() for reservation in reservations])


@api.route('/reservation/<int:reservation_id>', methods=['GET'])
def get_reservation(reservation_id):
    reservation = Reservation.query.get_or_404(reservation_id)
    return jsonify(reservation.serialize())


@api.route('/reservation', methods=['POST'])
def create_reservation():
    data = request.get_json()
    new_reservation = Reservation(
        user_id=data['user_id'],
        restaurant_id=data['restaurant_id'],
        reservation_time=datetime.fromisoformat(data['reservation_time']),
        is_active=data['is_active']
    )
    db.session.add(new_reservation)
    db.session.commit()
    return jsonify(new_reservation.serialize()), 201


@api.route('/reservation/<int:reservation_id>', methods=['PUT'])
def update_reservation(reservation_id):
    data = request.get_json()
    reservation = Reservation.query.get_or_404(reservation_id)
    reservation.reservation_time = datetime.fromisoformat(
        data['reservation_time'])
    reservation.is_active = data['is_active']
    db.session.commit()
    return jsonify(reservation.serialize())


@api.route('/reservation/<int:reservation_id>', methods=['DELETE'])
def delete_reservation(reservation_id):
    reservation = Reservation.query.get_or_404(reservation_id)
    db.session.delete(reservation)
    db.session.commit()
    return '', 204



