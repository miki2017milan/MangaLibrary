import DropdownMultiSelect from "./DropdownMultiSelect";
import SearchBar from "../Components/SearchBar";
import FilterTags from "../Components/FilterTags";
import FilterOption from "../Components/FilterOption";
import { useContext } from "react";
import FilterContext, { sortByLabels, sortByValues } from "./FilterContext";
import DropdownToggle from "./DropdownToggle";
import DropdownSingleSelect from "./DropdownSingleSelect";

export default function Filters() {
  const filters = useContext(FilterContext);

  return (
    <div className="searchNavbar">
      <div className="filterForms">
        <FilterOption name="Search">
          <SearchBar />
        </FilterOption>

        <FilterOption name="Genres">
          <DropdownMultiSelect
            name="Genres"
            content={[
              "Action",
              "Ecchi",
              "Romance",
              "Adventure",
              "Hentai",
              "Slice of Life",
              "Thriller",
              "Mahou Shoujo",
              "Comedy",
              "Psychological",
              "Mystery",
              "Fantasy",
              "Sci-Fi",
              "Drama",
              "Horror",
              "Mecha",
              "Music",
              "Sports",
              "Supernatural",
            ]}
            selectedItems={filters.selectedGenres}
            setSelectedItems={filters.setSelectedGenres}
          ></DropdownMultiSelect>
        </FilterOption>

        <FilterOption name="NSFW">
          <DropdownToggle
            name="NSFW"
            status={filters.showAdultContent}
            setStatus={filters.setAdultContent}
          ></DropdownToggle>
        </FilterOption>

        <FilterOption name="Sort by">
          <DropdownSingleSelect
            name="Sort by"
            content={sortByValues}
            labels={sortByLabels}
            selectedItem={filters.sortBy}
            setSelectedItem={filters.setSortBy}
          ></DropdownSingleSelect>
        </FilterOption>
      </div>

      <FilterTags />
    </div>
  );
}
