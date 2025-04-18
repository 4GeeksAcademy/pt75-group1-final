import React from 'react';

// HoursTable component for displaying restaurant business hours
// Props:
// - restaurant: restaurant data object (from API or static data)
// - isApiData: boolean indicating if data is from API or static source
const HoursTable = ({ restaurant, isApiData }) => {
  // Parse hours data from various API formats
  const parseHoursData = () => {
    if (!restaurant) return null;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let hoursData = null;

    // For API data
    if (isApiData) {
      // Format 1: TripAdvisor API format with week_ranges (time in minutes)
      if (restaurant.hours && restaurant.hours.week_ranges && Array.isArray(restaurant.hours.week_ranges)) {
        return days.map((day, index) => {
          const dayRanges = restaurant.hours.week_ranges[index];

          if (!dayRanges || dayRanges.length === 0) {
            return { day, hours: 'Closed' };
          }

          // Format each time range for the day
          const formattedRanges = dayRanges.map(range => {
            const openMinutes = range.open_time;
            const closeMinutes = range.close_time;

            const openTime = formatMinutesToTime(openMinutes);
            const closeTime = formatMinutesToTime(closeMinutes);

            return `${openTime} - ${closeTime}`;
          });

          return { day, hours: formattedRanges.join(', ') };
        });
      }

      // Format 2: Check for hours.open array (Yelp Fusion API format)
      if (restaurant.hours && Array.isArray(restaurant.hours) && restaurant.hours.length > 0) {
        const openHours = restaurant.hours[0];

        if (openHours && Array.isArray(openHours.open)) {
          // Map day numbers to day names and format times
          const hoursByDay = {};

          openHours.open.forEach(slot => {
            const dayIndex = slot.day;
            const dayName = days[dayIndex];
            const start = formatTime(slot.start);
            const end = formatTime(slot.end);

            if (!hoursByDay[dayName]) {
              hoursByDay[dayName] = [];
            }

            hoursByDay[dayName].push(`${start} - ${end}`);
          });

          // Create formatted hours data
          hoursData = days.map(day => ({
            day,
            hours: hoursByDay[day] ? hoursByDay[day].join(', ') : 'Closed'
          }));

          return hoursData;
        }
      }

      // Format 3: Check for weekday_text array in hours
      if (restaurant.hours && restaurant.hours.weekday_text && Array.isArray(restaurant.hours.weekday_text)) {
        hoursData = restaurant.hours.weekday_text.map(dayText => {
          const [day, hours] = dayText.split(': ');
          return { day, hours: hours || 'Closed' };
        });

        return hoursData;
      }

      // Format 4: Check for open_now_text or similar properties
      if (restaurant.open_now_text) {
        // If we only know if it's open or closed now, but not the hours
        const isOpenNow = restaurant.open_now_text.toLowerCase().includes('open');

        // Try to provide some useful information based on what we know
        if (restaurant.description && restaurant.description.toLowerCase().includes('hour')) {
          // Extract hours information from description if it exists
          return { generalHours: restaurant.description };
        }

        // Create a default schedule with current open/closed status
        return {
          generalHours: `${restaurant.open_now_text}. Please call ${restaurant.phone || 'the restaurant'} for hours information.`
        };
      }

      // Format 5: Check for hours_str (may contain day info)
      if (restaurant.hours_str) {
        try {
          // Try to parse different hour string formats
          const lines = restaurant.hours_str
            .split(/\n|<br\s*\/?>/)
            .map(line => line.trim())
            .filter(line => line.length > 0);

          if (lines.length > 0) {
            // Try to detect if each line starts with a day name
            const dayPrefixes = days.map(day => day.toLowerCase().substring(0, 3));
            const formattedLines = [];

            for (const line of lines) {
              const lowerLine = line.toLowerCase();
              const foundDayIndex = dayPrefixes.findIndex(prefix =>
                lowerLine.startsWith(prefix) || lowerLine.includes(` ${prefix}`));

              if (foundDayIndex >= 0) {
                // This line contains a day reference
                const parts = line.split(/:\s*|\s+-\s+|\s+to\s+/);
                if (parts.length >= 2) {
                  formattedLines.push({
                    day: days[foundDayIndex],
                    hours: parts.slice(1).join(' ')
                  });
                } else {
                  formattedLines.push({
                    day: days[foundDayIndex],
                    hours: 'Hours not specified'
                  });
                }
              } else {
                // This might be a general statement or continuation
                if (formattedLines.length > 0) {
                  formattedLines[formattedLines.length - 1].hours += ` ${line}`;
                } else {
                  // If we can't parse it as days, just return the raw string
                  return { generalHours: restaurant.hours_str };
                }
              }
            }

            if (formattedLines.length > 0) {
              return formattedLines;
            }
          }
        } catch (err) {
          console.error("Error parsing hours_str:", err);
        }
      }
    }

    // For static data - check if hours is an object with day properties
    if (restaurant.hours && typeof restaurant.hours === 'object' && !Array.isArray(restaurant.hours)) {
      hoursData = days.map(day => {
        const lowerDay = day.toLowerCase();
        const hours = restaurant.hours[lowerDay] || restaurant.hours[day] || 'Closed';
        return { day, hours };
      });

      return hoursData;
    }

    // If all parsing attempts failed, but we know if the restaurant is open or closed,
    // create a default schedule
    if (restaurant.openNow !== undefined ||
      (restaurant.normalizedOpenNow !== undefined) ||
      (restaurant.is_open_now !== undefined) ||
      (restaurant.open_now !== undefined)) {

      const isOpen = restaurant.openNow || restaurant.normalizedOpenNow ||
        restaurant.is_open_now || restaurant.open_now;

      // Create a basic message about the current open state
      return {
        generalHours: isOpen ?
          'Currently open. Please call for specific hours.' :
          'Currently closed. Please call for specific hours.'
      };
    }

    return null;
  };

  // Helper function to convert minutes to a formatted time string (e.g., 360 -> "6:00 AM")
  const formatMinutesToTime = (minutes) => {
    if (typeof minutes !== 'number') return 'Unknown';

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    // Convert to 12-hour format
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM

    return `${hours12}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  // Helper function to format time from 24h format "1430" to "2:30 PM"
  const formatTime = (timeString) => {
    if (!timeString) return '';

    try {
      // Handle "HH:MM" format
      if (timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':');
        return formatHoursMinutes(parseInt(hours, 10), parseInt(minutes, 10));
      }

      // Handle "HHMM" format (e.g., "1430" for 2:30 PM)
      if (timeString.length === 4) {
        const hours = parseInt(timeString.substring(0, 2), 10);
        const minutes = parseInt(timeString.substring(2, 4), 10);
        return formatHoursMinutes(hours, minutes);
      }

      // If we can't parse it, return as is
      return timeString;
    } catch (e) {
      return timeString;
    }
  };

  // Format hours and minutes to 12-hour format with AM/PM
  const formatHoursMinutes = (hours, minutes) => {
    let period = hours >= 12 ? 'PM' : 'AM';
    let hour12 = hours % 12;
    if (hour12 === 0) hour12 = 12;

    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const hoursData = parseHoursData();
  const generalHours = typeof restaurant?.hours === 'string' ? restaurant.hours : null;

  return (
    <div className="hours-table-container border rounded p-3 h-100">
      <h5 className="mb-3 border-bottom pb-2">Business Hours</h5>

      {hoursData ? (
        Array.isArray(hoursData) ? (
          <table className="table table-striped mb-0">
            <tbody>
              {hoursData.map((item, idx) => (
                <tr key={idx} className={item.hours.toLowerCase().includes('closed') ? 'text-muted' : ''}>
                  <td className="fw-bold" style={{ width: '40%' }}>{item.day}</td>
                  <td>{item.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : hoursData.generalHours ? (
          <p className="mb-0">{hoursData.generalHours}</p>
        ) : (
          <div className="text-center py-3">
            <p className="text-primary mb-1">Hours information not available</p>
            <p className="small text-muted mb-0">Please contact the restaurant for current business hours</p>
            <div className="mt-3">
              <i className="fas fa-clock fa-2x text-secondary opacity-50"></i>
            </div>
          </div>
        )
      ) : generalHours ? (
        <p className="mb-0">{generalHours}</p>
      ) : (
        <div className="text-center py-3">
          <p className="text-primary mb-1">Hours information not available</p>
          <p className="small text-muted mb-0">Please contact the restaurant for current business hours</p>
          <div className="mt-3">
            <i className="fas fa-clock fa-2x text-secondary opacity-50"></i>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoursTable;