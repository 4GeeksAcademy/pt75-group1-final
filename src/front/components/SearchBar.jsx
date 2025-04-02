const SearchBar = ({ value, onChange, onSearch, placeholder = "Search Restaurants" }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="input-group-append">
        <button className="btn btn-outline-secondary" onClick={onSearch}>
          🔍
        </button>
      </div>
    </div>
  );
};
