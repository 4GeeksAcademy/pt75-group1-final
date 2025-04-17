import React from 'react';

const RestaurantMealTypes = ({ restaurant, isApiData }) => {
  // Function to determine the right emoji based on meal type
  const getMealTypeIcon = (type) => {
    if (!type) return { icon: '🍽️', label: "Dining" };
    
    const typeStr = typeof type === 'string' ? type.toLowerCase() : '';
    
    // Map of types to icons and labels
    const iconMap = {
      'breakfast': { icon: '🍳', label: "Breakfast" },
      'brunch': { icon: '🥞', label: "Brunch" },
      'lunch': { icon: '🥪', label: "Lunch" },
      'dinner': { icon: '🍽️', label: "Dinner" },
      'dessert': { icon: '🍰', label: "Dessert" },
      'cafe': { icon: '☕', label: "Cafe" },
      'bar': { icon: '🍹', label: "Bar" },
      'pizza': { icon: '🍕', label: "Pizza" },
      'sushi': { icon: '🍣', label: "Sushi" },
      'burger': { icon: '🍔', label: "Burger" },
      'asian': { icon: '🥢', label: "Asian" },
      'italian': { icon: '🍝', label: "Italian" },
      'mexican': { icon: '🌮', label: "Mexican" }
    };
    
    // Find the matching type or return default
    for (const [key, value] of Object.entries(iconMap)) {
      if (typeStr.includes(key)) {
        return value;
      }
    }
    
    // Default icon
    return { icon: '🍴', label: "Dining" };
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
      mealTypes = mealTypeData.slice(0, 3);
    } else if (typeof mealTypeData === 'string') {
      // If it's a string, try to split it or use it as is
      const splitTypes = mealTypeData.split(/[,&]/);
      mealTypes = splitTypes.length > 1 ? splitTypes.slice(0, 3) : [mealTypeData];
    }
    
    // Ensure we have at least 3 icons
    if (mealTypes.length === 0) {
      mealTypes = ['breakfast', 'lunch', 'dinner']; // Default fallback
    } else if (mealTypes.length < 3) {
      const defaults = ['breakfast', 'lunch', 'dinner'];
      for (let i = mealTypes.length; i < 3; i++) {
        mealTypes.push(defaults[i % 3]);
      }
    }
    
    return mealTypes;
  };

  return (
    <section className="container mt-3 mb-4">
      <div style={{
        background: "#f8f8f8",
        borderRadius: "30px",
        padding: "15px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        maxWidth: "500px",
        margin: "0 auto"
      }}>
        <div className="d-flex justify-content-center gap-3">
          {/* Menu button */}
          <div style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            background: "linear-gradient(145deg, #e6e6e6, #f5f5f5)",
            boxShadow: "8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: restaurant.menu_web_url ? "pointer" : "default",
            transition: "transform 0.3s, box-shadow 0.3s",
          }}
            onClick={() => {
              if (restaurant.menu_web_url) {
                window.open(restaurant.menu_web_url, '_blank');
              }
            }}
            onMouseOver={(e) => {
              if (restaurant.menu_web_url) {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "10px 10px 20px #d1d1d1, -10px -10px 20px #ffffff";
              }
            }}
            onMouseOut={(e) => {
              if (restaurant.menu_web_url) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff";
              }
            }}
          >
            <div style={{
              fontSize: "14px",
              fontWeight: "600",
              textAlign: "center",
              color: "#333"
            }}>
              {restaurant.menu_web_url ? "View" : "No Menu"}
            </div>
            <div style={{
              fontSize: "14px",
              fontWeight: "600",
              textAlign: "center",
              color: "#333"
            }}>
              {restaurant.menu_web_url ? "Menu" : "Available"}
            </div>
          </div>

          {/* Meal type icons */}
          {getMealTypes().map((type, idx) => {
            const { icon, label } = getMealTypeIcon(type);
            return (
              <div
                key={idx}
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  background: "linear-gradient(145deg, #e6e6e6, #f5f5f5)",
                  boxShadow: "8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "transform 0.3s, box-shadow 0.3s"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "10px 10px 20px #d1d1d1, -10px -10px 20px #ffffff";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff";
                }}
              >
                <div style={{ fontSize: "32px" }}>{icon}</div>
                <div style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  marginTop: "6px",
                  color: "#555"
                }}>
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RestaurantMealTypes;