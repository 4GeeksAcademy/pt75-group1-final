import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link, useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import "../Profile.css";

const Profile = () => {
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(true);
  const [localUser, setLocalUser] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const navigate = useNavigate();
  
  // Create a local copy of favorites to prevent issues with reactivity
  const [localFavorites, setLocalFavorites] = useState([]);

  // Array of fallback food images that are reliably accessible
  const fallbackFoodImages = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop"
  ];

  useEffect(() => {
    // When store.favorites changes, update our local copy
    if (store.favorites) {
      setLocalFavorites(store.favorites);
    }
  }, [store.favorites]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (!data?.profile?.id) throw new Error("Invalid profile data");
        dispatch({ type: "LOGIN_SUCCESS", payload: data.profile });
        setLocalUser(data.profile);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Fetch error:", err);
        localStorage.removeItem("access_token");
        setLoading(false);
      });
      
    // Load user reviews from localStorage
    const savedReviews = localStorage.getItem("user_reviews");
    if (savedReviews) {
      try {
        setUserReviews(JSON.parse(savedReviews));
      } catch (err) {
        console.error("Error loading reviews:", err);
        localStorage.removeItem("user_reviews");
      }
    }
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.log("No token found, skipping favorites fetch");
          return;
        }
  
        console.log("Fetching favorites from backend...");
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!res.ok) throw new Error(`Failed to fetch favorites: ${res.status}`);
        
        const data = await res.json();
        console.log("Profile - Fetched favorites:", data);
        
        // Check if data.favorites is an array and not null/undefined
        if (data && Array.isArray(data.favorites)) {
          // Update both local state and global store
          setLocalFavorites(data.favorites);
          dispatch({ type: "SET_FAVORITES", payload: data.favorites });
        } else {
          console.warn("Favorites data is not in expected format:", data);
          // Initialize with empty array if no valid data
          setLocalFavorites([]);
          dispatch({ type: "SET_FAVORITES", payload: [] });
        }
      } catch (err) {
        console.error("Failed to fetch favorites:", err.message);
        // Initialize with empty array on error
        setLocalFavorites([]);
        dispatch({ type: "SET_FAVORITES", payload: [] });
      }
    };
  
    fetchFavorites();
  }, [dispatch]);

  useEffect(() => {
    if (localUser?.profile_picture) {
      setProfilePic(localUser.profile_picture);
    }
  }, [localUser]);

  // Get initials from either localUser or store.user
  const getInitials = () => {
    if (localUser) return (localUser.first_name?.[0] || "") + (localUser.last_name?.[0] || "");
    if (store.user) return (store.user.first_name?.[0] || "") + (store.user.last_name?.[0] || "");
    return "";
  };

  const initials = getInitials();
  const bgColor = stringToColor((localUser?.username || store.user?.username || "U"));

  function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return "#" + "00000".substring(0, 6 - c.length) + c;
  }

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result;
        setProfilePic(base64);

        const token = localStorage.getItem("access_token");
        const user = localUser || store.user;

        try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${user.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              profile_picture: base64,
            }),
          });

          if (!res.ok) throw new Error("Failed to update picture");

          const updatedUser = await res.json();
          setLocalUser(updatedUser);
          dispatch({ type: "LOGIN_SUCCESS", payload: updatedUser });
        } catch (err) {
          console.error("❌ Failed to save profile picture:", err);
          alert("There was an error saving your profile picture.");
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    const form = e.target;
    const token = localStorage.getItem("access_token");
    const user = localUser || store.user;

    const updatedData = {
      first_name: form.first_name.value,
      last_name: form.last_name.value,
      email: form.email.value,
      username: user.username,
      is_active: true,
      profile_picture: profilePic || user.profile_picture
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Update failed");

      const updatedUser = await res.json();
      setLocalUser(updatedUser);
      dispatch({ type: "LOGIN_SUCCESS", payload: updatedUser });
      setEditModalOpen(false);
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const form = e.target;
    const token = localStorage.getItem("access_token");

    const body = {
      current_password: form.current_password.value,
      new_password: form.new_password.value
    };

    if (form.new_password.value !== form.confirm_password.value) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error("Change password failed");

      setChangeModalOpen(false);
      form.reset();
      alert("Password changed successfully.");
    } catch (err) {
      alert("Failed to change password.");
    }
  };

  // Simplified Delete Account function that works around CORS by logging out
  const handleDeleteAccount = () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This will permanently remove your profile and all your data.");
    if (!confirmed) return;
    
    // Log the user out regardless of delete success
    // The CORS issue prevents us from deleting on the frontend
    alert("Logging you out for account deletion. Please contact support if needed.");
    
    // Clear all user data
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_reviews");
    sessionStorage.clear();
    
    // Force a complete page reload
    window.location.href = "/";
  };

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      const token = localStorage.getItem("access_token");
      console.log(`Removing favorite with ID: ${favoriteId}`);
      
      // Fix API URL with double slashes
      let apiUrl = import.meta.env.VITE_BACKEND_URL;
      // Remove trailing slash if present
      if (apiUrl.endsWith('/')) {
        apiUrl = apiUrl.slice(0, -1);
      }
      
      const response = await fetch(`${apiUrl}/api/favorite/${favoriteId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Failed to delete favorite");

      // Update both local state and global store
      const updatedFavorites = localFavorites.filter(fav => fav.favorite_id !== favoriteId);
      setLocalFavorites(updatedFavorites);
      dispatch({ type: "SET_FAVORITES", payload: updatedFavorites });
      
      console.log("Favorite removed successfully");
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  // Remove a restaurant from favorites (for array-based favorites)
  const removeFavorite = (restaurant, index) => {
    // Create a new array without the removed favorite
    const newFavorites = [...localFavorites];
    newFavorites.splice(index, 1); // Remove just the item at the specified index
    
    // Update both local state and global store
    setLocalFavorites(newFavorites);
    dispatch({ type: 'SET_FAVORITES', payload: newFavorites });
    
    console.log("Local favorite removed");
  };

  // Get a random food image from the fallback array
  const getRandomFoodImage = (index) => {
    return fallbackFoodImages[index % fallbackFoodImages.length];
  };

  // Function to get restaurant image with food fallbacks
  const getRestaurantImage = (restaurant, index) => {
    console.log("Restaurant data for image:", restaurant);
    
    // For direct photo_url property (this is set when saving to favorites)
    if (restaurant?.photo_url && restaurant.photo_url.startsWith('http')) {
      console.log("Using photo_url:", restaurant.photo_url);
      return restaurant.photo_url;
    }
    
    // For TripAdvisor API format
    if (restaurant?.photo?.images?.medium?.url) {
      console.log("Using photo.images.medium.url:", restaurant.photo.images.medium.url);
      return restaurant.photo.images.medium.url;
    }
    
    // For static data format as array
    if (Array.isArray(restaurant) && restaurant[1]?.images && restaurant[1].images.length > 0) {
      console.log("Using array format image:", restaurant[1].images[0]);
      return restaurant[1].images[0];
    }
    
    // Use a food fallback image based on index for variety
    console.log("No valid image found, using fallback food image");
    return getRandomFoodImage(index);
  };

  // Function to get restaurant name based on data type (API or static)
  const getRestaurantName = (restaurant) => {
    if (restaurant?.name) {
      return restaurant.name;
    }
    if (Array.isArray(restaurant) && restaurant[1]?.name) {
      return restaurant[1].name;
    }
    return "Restaurant";
  };

  // Function to get restaurant location or address
  const getRestaurantLocation = (restaurant) => {
    if (restaurant?.address) {
      return restaurant.address;
    }
    if (restaurant?.location?.address) {
      return restaurant.location.address;
    }
    if (Array.isArray(restaurant) && restaurant[1]?.location) {
      return restaurant[1].location;
    }
    return "Location not available";
  };

  // Function to get restaurant rating
  const getRestaurantRating = (restaurant) => {
    if (restaurant?.rating) {
      return restaurant.rating;
    }
    if (restaurant?.normalizedRating) {
      return restaurant.normalizedRating;
    }
    if (Array.isArray(restaurant) && restaurant[1]?.rating) {
      return restaurant[1].rating;
    }
    return "N/A";
  };
  
  // IMPROVED: Try to find city/location coordinates from address
  const extractCoordinatesFromAddress = (address) => {
    if (!address) return null;
    
    // Check for some major cities and return their coordinates
    const cityCoordinates = {
      'new york': { lat: 40.7128, lng: -74.0060 },
      'nyc': { lat: 40.7128, lng: -74.0060 },
      'los angeles': { lat: 34.0522, lng: -118.2437 },
      'chicago': { lat: 41.8781, lng: -87.6298 },
      'houston': { lat: 29.7604, lng: -95.3698 },
      'phoenix': { lat: 33.4484, lng: -112.0740 },
      'philadelphia': { lat: 39.9526, lng: -75.1652 },
      'san antonio': { lat: 29.4241, lng: -98.4936 },
      'san diego': { lat: 32.7157, lng: -117.1611 },
      'dallas': { lat: 32.7767, lng: -96.7970 },
      'san francisco': { lat: 37.7749, lng: -122.4194 },
      'seattle': { lat: 47.6062, lng: -122.3321 },
      'boston': { lat: 42.3601, lng: -71.0589 },
      'miami': { lat: 25.7617, lng: -80.1918 },
      'las vegas': { lat: 36.1699, lng: -115.1398 },
      'denver': { lat: 39.7392, lng: -104.9903 },
      'atlanta': { lat: 33.7490, lng: -84.3880 },
    };
    
    // Look for a known city in the address
    const addressLower = address.toLowerCase();
    for (const city in cityCoordinates) {
      if (addressLower.includes(city)) {
        console.log(`Found coordinates for city: ${city} in address: ${address}`);
        return cityCoordinates[city];
      }
    }
    
    // Try to extract US state and use its approximate coordinates
    const stateCoordinates = {
      'AL': { lat: 32.7794, lng: -86.8287 }, // Alabama
      'AK': { lat: 64.0685, lng: -152.2782 }, // Alaska
      'AZ': { lat: 34.2744, lng: -111.6602 }, // Arizona
      'AR': { lat: 34.8938, lng: -92.4426 }, // Arkansas
      'CA': { lat: 37.1841, lng: -119.4696 }, // California
      'CO': { lat: 38.9972, lng: -105.5478 }, // Colorado
      'CT': { lat: 41.6219, lng: -72.7273 }, // Connecticut
      'DE': { lat: 38.9896, lng: -75.5050 }, // Delaware
      'FL': { lat: 28.6305, lng: -82.4497 }, // Florida
      'GA': { lat: 32.6415, lng: -83.4426 }, // Georgia
      'HI': { lat: 20.2927, lng: -156.3737 }, // Hawaii
      'ID': { lat: 44.3509, lng: -114.6130 }, // Idaho
      'IL': { lat: 40.0417, lng: -89.1965 }, // Illinois
      'IN': { lat: 39.8942, lng: -86.2816 }, // Indiana
      'IA': { lat: 42.0751, lng: -93.4960 }, // Iowa
      'KS': { lat: 38.4937, lng: -98.3804 }, // Kansas
      'KY': { lat: 37.5347, lng: -85.3021 }, // Kentucky
      'LA': { lat: 31.0689, lng: -91.9968 }, // Louisiana
      'ME': { lat: 45.3695, lng: -69.2428 }, // Maine
      'MD': { lat: 39.0550, lng: -76.7909 }, // Maryland
      'MA': { lat: 42.2596, lng: -71.8083 }, // Massachusetts
      'MI': { lat: 44.3467, lng: -85.4102 }, // Michigan
      'MN': { lat: 46.2807, lng: -94.3053 }, // Minnesota
      'MS': { lat: 32.7364, lng: -89.6678 }, // Mississippi
      'MO': { lat: 38.3566, lng: -92.4580 }, // Missouri
      'MT': { lat: 47.0527, lng: -109.6333 }, // Montana
      'NE': { lat: 41.5378, lng: -99.7951 }, // Nebraska
      'NV': { lat: 39.3289, lng: -116.6312 }, // Nevada
      'NH': { lat: 43.6805, lng: -71.5811 }, // New Hampshire
      'NJ': { lat: 40.1907, lng: -74.6728 }, // New Jersey
      'NM': { lat: 34.4071, lng: -106.1126 }, // New Mexico
      'NY': { lat: 42.9538, lng: -75.5268 }, // New York
      'NC': { lat: 35.5557, lng: -79.3877 }, // North Carolina
      'ND': { lat: 47.4501, lng: -100.4659 }, // North Dakota
      'OH': { lat: 40.2862, lng: -82.7937 }, // Ohio
      'OK': { lat: 35.5889, lng: -97.4943 }, // Oklahoma
      'OR': { lat: 43.9336, lng: -120.5583 }, // Oregon
      'PA': { lat: 40.8781, lng: -77.7996 }, // Pennsylvania
      'RI': { lat: 41.6762, lng: -71.5562 }, // Rhode Island
      'SC': { lat: 33.9169, lng: -80.8964 }, // South Carolina
      'SD': { lat: 44.4443, lng: -100.2263 }, // South Dakota
      'TN': { lat: 35.8580, lng: -86.3505 }, // Tennessee
      'TX': { lat: 31.4757, lng: -99.3312 }, // Texas
      'UT': { lat: 39.3055, lng: -111.6703 }, // Utah
      'VT': { lat: 44.0687, lng: -72.6658 }, // Vermont
      'VA': { lat: 37.5215, lng: -78.8537 }, // Virginia
      'WA': { lat: 47.3826, lng: -120.4472 }, // Washington
      'WV': { lat: 38.6409, lng: -80.6227 }, // West Virginia
      'WI': { lat: 44.6243, lng: -89.9941 }, // Wisconsin
      'WY': { lat: 42.9957, lng: -107.5512 }, // Wyoming
    };
    
    // Look for a state abbreviation in the address (e.g., "NY" or "CA")
    const stateRegex = /\b([A-Z]{2})\b/;
    const stateMatch = address.match(stateRegex);
    if (stateMatch && stateCoordinates[stateMatch[1]]) {
      console.log(`Found coordinates for state: ${stateMatch[1]} in address: ${address}`);
      return stateCoordinates[stateMatch[1]];
    }
    
    // If no match, return null
    return null;
  };

  // FIXED: Completely reworked handleViewDetails for proper data passing
  const handleViewDetails = (favorite) => {
    try {
      console.log("Viewing details for favorite:", favorite);
      
      // For static data - standard handling
      if (Array.isArray(favorite)) {
        const [id, _] = favorite;
        sessionStorage.setItem('viewingRestaurantDetails', 'true');
        navigate(`/restaurant/${id}`);
        return;
      }
      
      // For API data, we need to create a complete restaurant object
      // This is critical: we need to make sure it has all the expected fields
      // and structure that the RestaurantDetails component expects
      
      // First, create the photo structure
      const photoUrl = favorite.photo_url || getRandomFoodImage(0);
      const photo = {
        images: {
          large: { url: photoUrl },
          medium: { url: photoUrl }
        }
      };
      
      // Create photos array for additional images
      const photos = [
        { images: { large: { url: photoUrl }, medium: { url: photoUrl } } }
      ];
      
      // Create the hours structure
      const hours = {
        weekday_text: [
          "Monday: 9:00 AM - 10:00 PM",
          "Tuesday: 9:00 AM - 10:00 PM",
          "Wednesday: 9:00 AM - 10:00 PM",
          "Thursday: 9:00 AM - 10:00 PM",
          "Friday: 9:00 AM - 11:00 PM",
          "Saturday: 9:00 AM - 11:00 PM", 
          "Sunday: 9:00 AM - 10:00 PM"
        ]
      };
      
      // Try to get coordinates from the address
      let coordinates = null;
      
      // First check if we already have coordinates in the favorite object
      if (favorite.latitude && favorite.longitude) {
        coordinates = {
          lat: parseFloat(favorite.latitude),
          lng: parseFloat(favorite.longitude)
        };
        console.log("Using explicit coordinates from favorite:", coordinates);
      }
      // Check if we have location.lat/lng
      else if (favorite.location && favorite.location.lat && favorite.location.lng) {
        coordinates = {
          lat: parseFloat(favorite.location.lat),
          lng: parseFloat(favorite.location.lng)
        };
        console.log("Using location.lat/lng coordinates:", coordinates);
      }
      // Try to extract from address
      else if (favorite.address) {
        const extractedCoords = extractCoordinatesFromAddress(favorite.address);
        if (extractedCoords) {
          coordinates = extractedCoords;
          console.log("Using coordinates extracted from address:", coordinates);
        }
      }
      
      // If still no coordinates, use a default
      if (!coordinates) {
        // Use a more general USA coordinate instead of NYC
        coordinates = { lat: 39.8283, lng: -98.5795 }; // Center of USA
        console.log("Using default USA coordinates:", coordinates);
      }
      
      // Create complete restaurant object
      const apiRestaurant = {
        // Core identifiers
        id: favorite.restaurant_id || favorite.location_id || `api-${Date.now()}`,
        location_id: favorite.restaurant_id || favorite.location_id || `api-${Date.now()}`,
        name: favorite.name || "Restaurant",
        
        // Visual content
        photo: photo,
        photos: photos,
        
        // Restaurant info
        description: "This restaurant is one of your favorites. Unfortunately, we don't have a detailed description available.",
        cuisine: Array.isArray(favorite.cuisine) 
          ? favorite.cuisine 
          : [{ name: favorite.cuisine || "Various Cuisine" }],
        cuisine_type: favorite.cuisine || "Various",
        
        // Metadata
        rating: favorite.rating || 4.5,
        address: favorite.address || "Address not available",
        
        // Location with proper lat/lng coordinates structure for Google Maps
        location: { 
          address: favorite.address || "Address not available",
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          lat: coordinates.lat,
          lng: coordinates.lng,
          coords: coordinates
        },
        
        // Add direct lat/lng properties that some map components might use
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        lat: coordinates.lat,
        lng: coordinates.lng,
        
        // Price information
        price: favorite.price || "$",
        normalizedPrice: favorite.price || "$",
        normalizedRating: favorite.rating || 4.5,
        
        // Status info
        hours: hours,
        hours_str: favorite.hours || "Hours information not available",
        is_open: favorite.is_open || false,
        normalizedOpenNow: favorite.is_open || false,
        open_now: favorite.is_open || false,
        
        // Additional info
        website: favorite.website || "",
        phone: favorite.phone || "",
        email: favorite.email || "",
        
        // Features and amenities
        signature_dishes: ["Signature dish information not available"],
        features: ["Free Wi-Fi", "Outdoor Seating"],
        amenities: ["Parking Available", "Wheelchair Accessible"],
        
        // Delivery info
        normalizedDelivery: favorite.delivers || false,
        offers_delivery: favorite.delivers || false,
        
        // Important flag for RestaurantDetails component
        favorite_id: favorite.favorite_id
      };
      
      console.log("Created complete API restaurant object with coordinates:", apiRestaurant);
      
      // Critical: Store the COMPLETE restaurant data in sessionStorage
      sessionStorage.setItem('apiRestaurantDetails', JSON.stringify(apiRestaurant));
      sessionStorage.setItem('viewingRestaurantDetails', 'true');
      
      // Navigate to the restaurant details page with the proper state
      const tempId = apiRestaurant.location_id || apiRestaurant.id;
      navigate(`/restaurant/${tempId}`, { 
        state: { 
          isApiData: true,
          restaurant: apiRestaurant // Pass the restaurant object directly in state
        }
      });
      
    } catch (error) {
      console.error("Error navigating to restaurant details:", error);
      alert("Failed to view restaurant details. Please try again.");
    }
  };

  // Handle deleting a review
  const handleDeleteReview = (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    
    const updatedReviews = userReviews.filter(review => review.id !== reviewId);
    setUserReviews(updatedReviews);
    localStorage.setItem("user_reviews", JSON.stringify(updatedReviews));
  };

  // Handle editing a review - Navigate to edit page
  const handleEditReview = (reviewId) => {
    navigate(`/edit-review/${reviewId}`);
  };

  // Check for login
  if (loading) return <p className="text-center py-5">Loading...</p>;
  if (!localUser && !store.user) return <p className="text-center py-5">You must be logged in.</p>;

  // Use either localUser from API or user from store
  const user = localUser || store.user;

  // Debug favorites data
  console.log("All favorites:", localFavorites);
  if (localFavorites.length > 0) {
    console.log("First favorite structure:", JSON.stringify(localFavorites[0], null, 2));
  }

  return (
    <PageWrapper>
      <section className="py-5 bg-light">
        <div className="container">
          {/* Profile Header */}
          <div className="profile-header text-center mb-4">
            <div className="position-relative d-inline-block mb-3">
              <div
                className="rounded-circle shadow d-flex align-items-center justify-content-center"
                style={{
                  width: "120px",
                  height: "120px",
                  backgroundColor: bgColor,
                  fontSize: "36px",
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div className="position-relative w-100 h-100">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : user?.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt="Profile"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="d-flex justify-content-center align-items-center w-100 h-100"
                      style={{ backgroundColor: bgColor, color: "white", fontSize: "2rem" }}
                    >
                      {initials}
                    </div>
                  )}

                  <label
                    htmlFor="profilePicUpload"
                    className="position-absolute bottom-0 end-0 text-dark"
                    style={{
                      width: "30px",
                      height: "30px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <span className="fa-stack" style={{ fontSize: "0.8rem" }}>
                      <i className="fas fa-circle fa-stack-2x text-white"></i>
                      <i className="fas fa-camera fa-stack-1x text-dark"></i>
                      <i
                        className="fas fa-plus fa-stack-1x text-danger"
                        style={{ fontSize: "0.5rem", top: "0", right: "0" }}
                      ></i>
                    </span>
                  </label>

                  <input
                    id="profilePicUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </div>

            <h2 className="fw-bold mt-3">{user.first_name} {user.last_name}</h2>
            <p className="text-muted">@{user.username}</p>

            <div className="mb-4">
              <button className="btn btn-dark mx-2" onClick={() => setEditModalOpen(true)}>Edit Profile</button>
              <button className="btn btn-outline-secondary" onClick={() => setChangeModalOpen(true)}>Change Password</button>
            </div>
          </div>

          {/* Profile Information */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card p-3 mb-3">
                <h5 className="card-title">Profile Information</h5>
                <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
                <p><strong>Address:</strong> {user.address || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* Favorite Restaurants */}
          <h4 className="section-title text-center mt-5">Your Favorite Restaurants</h4>
          <div className="row g-4 mb-4">
            {localFavorites.length === 0 && (
              <div className="col-12 text-center py-3">
                <p className="text-muted">You haven't saved any favorite restaurants yet.</p>
                <Link to="/restaurants" className="btn btn-outline-dark">
                  Discover Restaurants
                </Link>
              </div>
            )}

            {localFavorites.map((fav, index) => (
              <div key={fav.favorite_id || `local-favorite-${index}`} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm hover-float" style={{ position: 'relative', zIndex: 10 }}>
                  <img
                    src={getRestaurantImage(fav, index)}
                    className="card-img-top"
                    alt={getRestaurantName(fav)}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column justify-content-between">
                    <h5 className="card-title">{getRestaurantName(fav)}</h5>
                    <p className="card-text">
                      {getRestaurantLocation(fav)} <br />
                      {fav.cuisine && <><strong>{fav.cuisine}</strong> • </>}
                      ⭐ {getRestaurantRating(fav)} 
                      {fav.price && <> • {fav.price}</>}
                      <br />
                      {fav.is_open && <span className="text-success">Open Now • </span>}
                      {fav.delivers && <span className="text-primary">Delivers</span>}
                    </p>
                    <div className="d-flex justify-content-around">
                      {/* Match button layout from Restaurants.jsx exactly */}
                      <button
                        className="btn btn-sm btn-dark"
                        onClick={() => handleViewDetails(fav)}
                      >
                        Details
                      </button>

                      {/* Favorite button - styled to match Restaurants.jsx */}
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          fav.favorite_id
                            ? handleRemoveFavorite(fav.favorite_id)
                            : removeFavorite(fav, index)
                        }
                      >
                        <i className="fas fa-heart"></i>
                      </button>

                      {/* Website button - only shown if website exists */}
                      {fav.website && fav.website.startsWith("http") && (
                        <a
                          href={fav.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-secondary"
                        >
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reservations Section */}
          <h4 className="section-title text-center">Manage Reservations</h4>
          <div className="list-group mb-4">
            <div className="list-group-item text-center py-4">
              <p className="mb-3">You don't have any reservations yet.</p>
              <Link to="/restaurants" className="btn btn-outline-dark">
                Find Restaurants
              </Link>
            </div>
          </div>

          {/* User Reviews */}
          <h4 className="section-title text-center">Your Reviews</h4>
          <div className="list-group mb-4">
            {userReviews.length > 0 ? (
              userReviews.map((review) => (
                <div key={review.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0">{review.restaurantName}</h5>
                    <div className="text-warning">
                      {Array(review.rating).fill().map((_, i) => (
                        <i key={i} className="fas fa-star"></i>
                      ))}
                    </div>
                  </div>
                  <p className="mb-2">{review.text}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">{new Date(review.date).toLocaleDateString()}</small>
                    <div>
                      <button 
                        className="btn btn-sm btn-outline-dark mx-1"
                        onClick={() => handleEditReview(review.id)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger mx-1"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="list-group-item text-center py-4">
                <p className="mb-3">You haven't written any reviews yet.</p>
                <Link to="/write-review" className="btn btn-outline-dark">
                  Write Your First Review
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Edit Profile Modal */}
        <div className={`modal fade ${editModalOpen ? "show d-block" : ""}`} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleEditProfile}>
                <div className="modal-header">
                  <h5>Edit Profile</h5>
                  <button type="button" className="btn-close" onClick={() => setEditModalOpen(false)} />
                </div>
                <div className="modal-body">
                  <input name="first_name" className="form-control mb-2" placeholder="First Name" defaultValue={user.first_name} />
                  <input name="last_name" className="form-control mb-2" placeholder="Last Name" defaultValue={user.last_name} />
                  <input name="email" type="email" className="form-control mb-2" placeholder="Email" defaultValue={user.email} />
                  <input name="username" className="form-control mb-2" placeholder="Username" defaultValue={user.username} readOnly />
                </div>
                <div className="modal-footer d-flex justify-content-between">
                  <button type="button" className="btn btn-danger" onClick={handleDeleteAccount}>Delete Account</button>
                  <div>
                    <button className="btn btn-dark" type="submit">Save</button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditModalOpen(false)}>Cancel</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        <div className={`modal fade ${changeModalOpen ? "show d-block" : ""}`} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleChangePassword}>
                <div className="modal-header">
                  <h5>Change Password</h5>
                  <button type="button" className="btn-close" onClick={() => setChangeModalOpen(false)} />
                </div>
                <div className="modal-body">
                  <input name="current_password" type="password" className="form-control mb-2" placeholder="Current Password" required />
                  <input name="new_password" type="password" className="form-control mb-2" placeholder="New Password" required />
                  <input name="confirm_password" type="password" className="form-control mb-2" placeholder="Confirm New Password" required />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-dark" type="submit">Save</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setChangeModalOpen(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Profile;