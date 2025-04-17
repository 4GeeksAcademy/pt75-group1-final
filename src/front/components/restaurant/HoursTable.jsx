import React from 'react';

const HoursTable = ({ restaurant, isApiData }) => {
  // Helper function to check if we have hours data
  const hasHoursData = () => {
    return isApiData && restaurant.hours && restaurant.hours.week_ranges;
  };

  // Helper function to get hour displays
  const getHourDisplay = (dayIndex) => {
    if (hasHoursData()) {
      const dayRanges = restaurant.hours.week_ranges[dayIndex];
      if (dayRanges && dayRanges.length > 0) {
        return "9-5"; // Simplified display
      }
    }
    return "Closed";
  };

  return (
    <div style={{
      background: "#f0f0f0",
      borderRadius: "12px",
      padding: "15px",
      height: "100%",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      {hasHoursData() || (!isApiData && restaurant.businessHours) ? (
        <table className="table table-borderless mb-0">
          <tbody>
            <tr style={{ backgroundColor: "#ddd", borderRadius: "4px" }}>
              <td style={{ width: "140px", fontWeight: "500", padding: "8px 15px" }}>Monday</td>
              <td style={{ padding: "8px 15px" }}>{getHourDisplay(0)}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: "500", padding: "8px 15px" }}>Tuesday</td>
              <td style={{ padding: "8px 15px" }}>{getHourDisplay(1)}</td>
            </tr>
            <tr style={{ backgroundColor: "#ddd", borderRadius: "4px" }}>
              <td style={{ fontWeight: "500", padding: "8px 15px" }}>Wednesday</td>
              <td style={{ padding: "8px 15px" }}>{getHourDisplay(2)}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: "500", padding: "8px 15px" }}>Thursday</td>
              <td style={{ padding: "8px 15px" }}>{getHourDisplay(3)}</td>
            </tr>
            <tr style={{ backgroundColor: "#ddd", borderRadius: "4px" }}>
              <td style={{ fontWeight: "500", padding: "8px 15px" }}>Friday</td>
              <td style={{ padding: "8px 15px" }}>{getHourDisplay(4)}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: "500", padding: "8px 15px" }}>Saturday</td>
              <td style={{ padding: "8px 15px" }}>{getHourDisplay(5)}</td>
            </tr>
            <tr style={{ backgroundColor: "#ddd", borderRadius: "4px" }}>
              <td style={{ fontWeight: "500", padding: "8px 15px" }}>Sunday</td>
              <td style={{ padding: "8px 15px" }}>{getHourDisplay(6)}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <div className="text-center py-3">
          <div style={{ fontSize: "50px", marginBottom: "10px" }}>⏰</div>
          <h5>Hours Not Available</h5>
          <p className="mb-1">This business hasn't shared their hours with us yet.</p>
          {(isApiData && restaurant.phone) ? (
            <p className="mb-0">
              Give them a call at {" "}
              <a href={`tel:${restaurant.phone}`}>
                {restaurant.phone}
              </a>{" "}
              to check if they're open!
            </p>
          ) : (
            <p className="mb-0">Check their website for more information.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HoursTable;