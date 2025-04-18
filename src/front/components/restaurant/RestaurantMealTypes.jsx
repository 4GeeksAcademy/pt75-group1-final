import React, { useState } from 'react';

const RestaurantMealTypes = ({ restaurant, isApiData }) => {
  // State for hover tooltips
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Function to get phone number from restaurant data
  const getPhoneNumber = () => {
    if (isApiData) {
      return restaurant.phone || restaurant.telephone || restaurant.contact_number || null;
    }
    // For static data
    return restaurant.phone || null;
  };

  // Function to get website URL from restaurant data
  const getWebsiteUrl = () => {
    if (isApiData) {
      return restaurant.website || restaurant.web_url || restaurant.menu_web_url || null;
    }
    // For static data
    return restaurant.website || restaurant.menuUrl || null;
  };

  // Function to determine relevant icons based on restaurant data
  const getRelevantIcons = () => {
    const icons = [];

    // Helper to add an icon if it's applicable
    const addIcon = (condition, icon, label) => {
      if (condition) {
        icons.push({ icon, label });
      }
    };

    // Get cuisine type for food-specific icons
    let cuisineType = '';
    if (isApiData) {
      cuisineType = restaurant.cuisine_type ||
        (restaurant.cuisine && restaurant.cuisine[0]?.name) || '';
    } else {
      cuisineType = restaurant.cuisine || '';
    }

    cuisineType = cuisineType.toLowerCase();

    // Add cuisine-specific icons
    if (cuisineType.includes('italian') || cuisineType.includes('pasta') || cuisineType.includes('pizza')) {
      addIcon(true, '🍝', 'Italian');
    } else if (cuisineType.includes('mexican') || cuisineType.includes('taco') || cuisineType.includes('burrito')) {
      addIcon(true, '🌮', 'Mexican');
    } else if (cuisineType.includes('japanese') || cuisineType.includes('sushi')) {
      addIcon(true, '🍣', 'Japanese');
    } else if (cuisineType.includes('chinese') || cuisineType.includes('asian')) {
      addIcon(true, '🥢', 'Asian');
    } else if (cuisineType.includes('burger') || cuisineType.includes('american')) {
      addIcon(true, '🍔', 'Burgers');
    } else if (cuisineType.includes('seafood')) {
      addIcon(true, '🦞', 'Seafood');
    } else if (cuisineType.includes('indian')) {
      addIcon(true, '🍛', 'Indian');
    } else if (cuisineType.includes('bakery') || cuisineType.includes('pastry')) {
      addIcon(true, '🥐', 'Bakery');
    } else if (cuisineType.includes('steakhouse') || cuisineType.includes('grill')) {
      addIcon(true, '🥩', 'Steakhouse');
    } else if (cuisineType.includes('vegan') || cuisineType.includes('vegetarian')) {
      addIcon(true, '🥗', 'Vegan/Veg');
    } else {
      // Default icon if no specific cuisine is detected
      addIcon(true, '🍽️', 'Dining');
    }

    // Add meal type icons
    const mealTypes = getMealTypes();
    if (mealTypes.includes('breakfast')) {
      addIcon(true, '🍳', 'Breakfast');
    } else if (mealTypes.includes('brunch')) {
      addIcon(true, '🥞', 'Brunch');
    } else if (mealTypes.includes('lunch')) {
      addIcon(true, '🥪', 'Lunch');
    } else if (mealTypes.includes('dinner')) {
      addIcon(true, '🍴', 'Dinner');
    }

    // Add amenity icons - excluding Parking
    if (isApiData) {
      addIcon(restaurant.offers_delivery || restaurant.normalizedDelivery, '🚚', 'Delivery');
      addIcon(restaurant.offers_takeout || restaurant.offers_takeaway, '🥡', 'Takeout');
      addIcon(restaurant.features?.includes('Outdoor Seating') ||
        (restaurant.amenities && restaurant.amenities.some(a => a.includes('outdoor'))),
        '☀️', 'Outdoor');
      addIcon(restaurant.features?.includes('Free Wi-Fi') ||
        (restaurant.amenities && restaurant.amenities.some(a => a.includes('wi-fi') || a.includes('wifi'))),
        '📶', 'Wi-Fi');
      addIcon(restaurant.features?.includes('Bar') ||
        (restaurant.amenities && restaurant.amenities.some(a => a === 'Bar' || a.includes('bar'))),
        '🍹', 'Bar');
      addIcon(restaurant.features?.includes('Reservations') ||
        (restaurant.amenities && restaurant.amenities.some(a => a.includes('reservation'))),
        '📅', 'Reservations');
    } else {
      // For static data
      const amenities = restaurant.amenities || [];
      addIcon(restaurant.offersDelivery, '🚚', 'Delivery');
      addIcon(amenities.some(a => a.includes('Takeout') || a.includes('Take-out')), '🥡', 'Takeout');
      addIcon(amenities.some(a => a.includes('Outdoor')), '☀️', 'Outdoor');
      addIcon(amenities.some(a => a.includes('Wi-Fi') || a.includes('WiFi')), '📶', 'Wi-Fi');
      addIcon(amenities.some(a => a === 'Bar' || a.includes('bar')), '🍹', 'Bar');
      addIcon(amenities.some(a => a.includes('Reservation')), '📅', 'Reservations');
    }

    // Ensure we have a reasonable number of icons (3)
    if (icons.length < 3) {
      // Add some generic icons if we don't have enough
      const genericIcons = [
        { icon: '💳', label: 'Cards Accepted' },
        { icon: '👨‍👩‍👧‍👦', label: 'Family Friendly' },
        { icon: '♿', label: 'Accessible' }
      ];

      while (icons.length < 3 && genericIcons.length > 0) {
        icons.push(genericIcons.shift());
      }
    }

    // Limit to 3 icons maximum to match the mockup
    return icons.slice(0, 3);
  };

  // Get meal type data from the restaurant object
  const getMealTypes = () => {
    // Data sources to check for meal types, in order of preference
    const mealTypeSources = [
      isApiData && restaurant.meal_types,
      isApiData && restaurant.cuisine_type,
      isApiData && restaurant.cuisine && restaurant.cuisine[0]?.name,
      restaurant.cuisine
    ];

    // Find the first valid source
    let mealTypeData = null;
    for (const source of mealTypeSources) {
      if (source) {
        mealTypeData = source;
        break;
      }
    }

    // Process the meal type data
    let mealTypes = [];
    if (Array.isArray(mealTypeData)) {
      // If it's already an array, use it directly
      mealTypes = mealTypeData.map(type => typeof type === 'string' ? type.toLowerCase() : '');
    } else if (typeof mealTypeData === 'string') {
      // If it's a string, try to split it or use it as is
      const splitTypes = mealTypeData.split(/[,&]/);
      mealTypes = splitTypes.length > 1
        ? splitTypes.map(type => type.trim().toLowerCase())
        : [mealTypeData.toLowerCase()];
    }

    return mealTypes;
  };

  // Get phone and website data
  const phoneNumber = getPhoneNumber();
  const websiteUrl = getWebsiteUrl();

  // Get relevant icons based on restaurant data
  const relevantIcons = getRelevantIcons();

  // Style for the tooltip
  const tooltipStyle = {
    position: 'absolute',
    top: '-35px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    zIndex: 100,
    opacity: 0,
    transition: 'opacity 0.2s ease'
  };

  return (
    <section className="container mt-3 mb-4">
      <div style={{
        background: "#f0f0f0", // Slightly darker background for better visibility
        borderRadius: "30px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        maxWidth: "fit-content", // Tighter fit around icons
        margin: "0 auto"
      }}>
        <div className="d-flex justify-content-center" style={{ gap: "60px" }}> {/* Increased gap */}
          {/* Left group - action buttons */}
          <div className="d-flex" style={{ gap: "30px" }}> {/* Group the left buttons with their own gap */}
            {/* Website button (formerly Menu) */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "white",
                boxShadow: "3px 3px 10px rgba(0,0,0,0.1)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: websiteUrl ? "pointer" : "default",
                transition: "transform 0.3s, box-shadow 0.3s",
                position: "relative" // For tooltip positioning
              }}
              onClick={() => {
                if (websiteUrl) {
                  window.open(websiteUrl, '_blank');
                }
              }}
              onMouseEnter={() => {
                if (websiteUrl) {
                  setActiveTooltip('website');
                  // Add this line:
                  e.currentTarget.style.transform = "translateY(-5px)";
                }
              }}
              onMouseLeave={(e) => {
                setActiveTooltip(null);
                // Add this line:
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Tooltip */}
              <div style={{
                ...tooltipStyle,
                opacity: activeTooltip === 'website' ? 1 : 0
              }}>
                Website
              </div>

              {/* Icon only - no text inside */}
              <div style={{ fontSize: "28px" }}>🌐</div>
            </div>

            {/* Phone button */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "white",
                boxShadow: "3px 3px 10px rgba(0,0,0,0.1)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: phoneNumber ? "pointer" : "default",
                transition: "transform 0.3s, box-shadow 0.3s",
                position: "relative" // For tooltip positioning
              }}
              onClick={() => {
                if (phoneNumber) {
                  window.location.href = `tel:${phoneNumber}`;
                }
              }}
              onMouseEnter={() => {
                if (phoneNumber) {
                  setActiveTooltip('phone');
                }
              }}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              {/* Tooltip */}
              <div style={{
                ...tooltipStyle,
                opacity: activeTooltip === 'phone' ? 1 : 0
              }}>
                {phoneNumber ? "Call" : "No Phone"}
              </div>

              {/* Icon only - no text inside */}
              <div style={{ fontSize: "28px" }}>📞</div>
            </div>
          </div>

          {/* Right group - info icons */}
          <div className="d-flex" style={{ gap: "30px" }}> {/* Group the right buttons with their own gap */}
            {/* Relevant icons based on restaurant data */}
            {relevantIcons.map((item, idx) => (
              <div
                key={idx}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "white",
                  boxShadow: "3px 3px 10px rgba(0,0,0,0.1)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  position: "relative", // For tooltip positioning
                  cursor: "pointer" // Add this line to make the cursor a pointer
                }}
                onMouseEnter={(e) => {
                  setActiveTooltip(`icon-${idx}`);
                  e.currentTarget.style.transform = "translateY(-5px)"; // Add this line for hover effect
                }}
                onMouseLeave={(e) => {
                  setActiveTooltip(null);
                  e.currentTarget.style.transform = "translateY(0)"; // Add this line for hover effect
                }}
              >
                {/* Tooltip */}
                <div style={{
                  ...tooltipStyle,
                  opacity: activeTooltip === `icon-${idx}` ? 1 : 0
                }}>
                  {item.label}
                </div>

                {/* Icon only - no text inside */}
                <div style={{ fontSize: "28px" }}>{item.icon}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantMealTypes;