import React from "react";

const SearchBar = ({ searchTerm, setSearchTerm, onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search songs..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && searchTerm.trim()) {
          onSearch && onSearch(searchTerm.trim());
        }
      }}
      style={{
        padding: "8px",
        width: "100%",
        borderRadius: "6px",
      }}
    />
  );
};

export default SearchBar;
