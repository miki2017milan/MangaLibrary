import { useContext } from "react";
import FilterContext from "./FilterContext";

export default function SearchBar() {
  const filters = useContext(FilterContext);

  return (
    <div className="searchbar">
      <img src="search.webp" />
      <input
        type="text"
        placeholder=""
        onChange={(e) => filters.setSearchFilter(e.target.value)}
        value={filters.searchFilter}
      />

      {filters.searchFilter != "" && (
        <img className="close" src="closeFilter.png" onClick={() => filters.setSearchFilter("")} />
      )}
    </div>
  );
}
