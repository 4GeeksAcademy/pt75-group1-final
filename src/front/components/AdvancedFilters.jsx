import React from "react";

const AdvancedFilters = ({ selectedFilters, onChange, onApply }) => {
  const [showAllCategory, setShowAllCategory] = React.useState(false);
  const [showAllFeatured, setShowAllFeatured] = React.useState(false);
  const [showAllSuggested, setShowAllSuggested] = React.useState(false);

  const categoryOptions = [
    "American", "Asian Fusion", "Breakfast", "Italian", "Seafood", "Steakhouse", "Vegan", "Tacos", "Barbecue", "Indian"
  ];
  const featuredOptions = [
    "Full Bar", "Valet Parking", "Wi-Fi", "Dog Friendly", "Good for Brunch", "Live Music"
  ];
  const suggestedOptions = [
    "Open Now", "Outdoor Seating", "Accepts Reservations", "Family Friendly", "Late Night", "Pet Friendly"
  ];

  const handleCheckboxChange = (label) => {
    const current = selectedFilters.advanced || [];
    const updated = current.includes(label)
      ? current.filter((item) => item !== label)
      : [...current, label];

    // update only the 'advanced' part of selectedFilters
    onChange({ ...selectedFilters, advanced: updated });
  };

  const renderCheckboxes = (options, showAll) => {
    const visible = showAll ? options : options.slice(0, 3);
    return visible.map((label, i) => {
      const id = `filter-${i}-${label.replace(/[^a-zA-Z0-9]/g, '')}`;
      return (
        <div className="form-check" key={id}>
          <input
            className="form-check-input"
            type="checkbox"
            id={id}
            name={id}
            checked={selectedFilters.advanced?.includes(label) || false}
            onChange={() => handleCheckboxChange(label)}
          />
          <label className="form-check-label" htmlFor={id}>
            {label}
          </label>
        </div>
      );
    });
  };

  return (
    <div className="advanced-filters bg-white border rounded p-3 w-100" style={{ maxWidth: "900px" }}>
      <div className="mb-4">
        <h6 className="fw-bold">Category</h6>
        {renderCheckboxes(categoryOptions, showAllCategory)}
        <button className="btn btn-link p-0" onClick={() => setShowAllCategory(!showAllCategory)}>
          {showAllCategory ? "See less" : "See all"}
        </button>
      </div>

      <div className="mb-4">
        <h6 className="fw-bold">Featured</h6>
        {renderCheckboxes(featuredOptions, showAllFeatured)}
        <button className="btn btn-link p-0" onClick={() => setShowAllFeatured(!showAllFeatured)}>
          {showAllFeatured ? "See less" : "See all"}
        </button>
      </div>

      <div className="mb-4">
        <h6 className="fw-bold">Suggested</h6>
        {renderCheckboxes(suggestedOptions, showAllSuggested)}
        <button className="btn btn-link p-0" onClick={() => setShowAllSuggested(!showAllSuggested)}>
          {showAllSuggested ? "See less" : "See all"}
        </button>
      </div>

      <div className="d-flex justify-content-end mt-4">
        <button className="btn btn-dark" onClick={() => onApply(selectedFilters)}>
          Apply ({selectedFilters.advanced.length})
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilters;
