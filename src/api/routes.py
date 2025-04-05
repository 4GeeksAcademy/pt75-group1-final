from flask import Flask, Blueprint, jsonify, request, abort
from flask_cors import CORS
from datetime import datetime
from api.models import db, User, Restaurant, Favorite, Reservation
import requests
import os
from dotenv import load_dotenv

load_dotenv()
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
RAPIDAPI_HOST = os.getenv("RAPIDAPI_HOST")

api = Blueprint('api', __name__)
CORS(api, resources={r"/*": {"origins": ["http://localhost:3000", "https://animated-guide-wrvvx9gwpgwv27p7-3000.app.github.dev"]}}, supports_credentials=True)

# --- User Routes ---

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
    return jsonify(user.serialize()), 200

# --- Restaurant Routes ---

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

# --- Favorite Routes ---

@api.route('/favorites', methods=['GET'])
def get_favorites():
    favorites = Favorite.query.all()
    return jsonify([favorite.serialize() for favorite in favorites])

@api.route('/favorite', methods=['POST'])
def create_favorite():
    data = request.get_json()
    new_favorite = Favorite(user_id=data['user_id'], restaurant_id=data['restaurant_id'])
    db.session.add(new_favorite)
    db.session.commit()
    return jsonify(new_favorite.serialize()), 201

@api.route('/favorite/<int:favorite_id>', methods=['DELETE'])
def delete_favorite(favorite_id):
    favorite = Favorite.query.get_or_404(favorite_id)
    db.session.delete(favorite)
    db.session.commit()
    return '', 204

# --- Reservation Routes ---

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
    reservation.reservation_time = datetime.fromisoformat(data['reservation_time'])
    reservation.is_active = data['is_active']
    db.session.commit()
    return jsonify(reservation.serialize())

@api.route('/reservation/<int:reservation_id>', methods=['DELETE'])
def delete_reservation(reservation_id):
    reservation = Reservation.query.get_or_404(reservation_id)
    db.session.delete(reservation)
    db.session.commit()
    return '', 204

def get_location_id(city):
    """
    Fetches location_id for a given city using the /typeahead endpoint.
    """
    url = "https://restaurants222.p.rapidapi.com/typeahead"
    
    # Use a dictionary for the payload and let requests handle the encoding
    payload = {
        "q": city,
        "language": "en_US"
    }
    
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    # Use data=payload with a dictionary to ensure proper URL encoding
    response = requests.post(url, data=payload, headers=headers)

    try:
        data = response.json()
        print("API Response:", data)
    except ValueError:
        print("Failed to parse JSON response")
        return None

    # Check if we have results and data is correctly structured
    if "results" in data and "data" in data["results"]:
        for item in data["results"]["data"]:
            if item.get("result_type") == "geos":
                return item["result_object"]["location_id"]
    
    return None


@api.route('/search-restaurants', methods=['POST'])
def search_restaurants():
    """
    Searches for restaurants based on user-provided city name.
    """
    data = request.get_json()
    city = data.get("city", "").strip()

    if not city:
        return jsonify({"error": "City name is required"}), 400
    
    # Make sure city is at least 3 characters (per API error message)
    if len(city) < 3:
        return jsonify({"error": "City name must be at least 3 characters"}), 400

    location_id = get_location_id(city)
    print(f"Found location_id: {location_id}")

    if not location_id:
        return jsonify({"error": "City not found"}), 404

    # Fetch restaurants using the location_id
    url = "https://restaurants222.p.rapidapi.com/search"
    
    # Use a dictionary for payload instead of f-string
    payload = {
        "location_id": location_id,
        "language": "en_US",
        "currency": "USD"
    }

    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    # Use data=payload with a dictionary to ensure proper URL encoding
    response = requests.post(url, data=payload, headers=headers)
    
    print(f"Restaurant API Status Code: {response.status_code}")
    
    if response.status_code == 200:
        response_data = response.json()
        print(f"Response data keys: {response_data.keys() if isinstance(response_data, dict) else 'Not a dict'}")
        print(f"Response data sample: {str(response_data)[:500]}...")
        return jsonify(response_data), 200
    else:
        print(f"Error response: {response.text}")
        return jsonify({"error": "Failed to fetch restaurants"}), response.status_code
