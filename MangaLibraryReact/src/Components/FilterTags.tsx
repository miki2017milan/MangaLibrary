import { useContext } from "react";
import FilterContext, { sortByLabels, sortByValues } from "./FilterContext";

export default function FilterTags() {
  const filters = useContext(FilterContext);

  const closeAll = () => {
    filters.setSearchFilter("");
    filters.setSelectedGenres([]);
    filters.setAdultContent(false);
    filters.setSortBy("");
  };

  return (
    <ul className="searchFilters">
      {filters.searchFilter != "" && (
        <li className="searchTag" onClick={() => filters.setSearchFilter("")}>
          <img src="/tag.png" alt="alarm" className="tagImage" />
          Search: {filters.searchFilter}{" "}
          <img src="/close-button.webp" alt="noimg" className="closeImage" />
        </li>
      )}
      {filters.selectedGenres.map((item, index) => (
        <li
          key={index}
          onClick={() =>
            filters.setSelectedGenres(filters.selectedGenres.filter((i) => i !== item))
          }
        >
          <img src="/tag.png" alt="alarm" className="tagImage" />
          {item}
          <img src="/close-button.webp" alt="noimg" className="closeImage" />
        </li>
      ))}
      {filters.showAdultContent && (
        <li onClick={() => filters.setAdultContent(false)}>
          <img src="/tag.png" alt="alarm" className="tagImage" />
          NSFW
          <img src="/close-button.webp" alt="noimg" className="closeImage" />
        </li>
      )}
      {filters.sortBy != "" && (
        <li onClick={() => filters.setSortBy("")}>
          <img src="/tag.png" alt="alarm" className="tagImage" />
          {sortByLabels[sortByValues.indexOf(filters.sortBy)]}
          <img src="/close-button.webp" alt="noimg" className="closeImage" />
        </li>
      )}
      <li className="closeAll" onClick={() => closeAll()}>
        Close all
        <img src="/close-button.webp" alt="noimg" className="closeImage" />
      </li>
    </ul>
  );
}
