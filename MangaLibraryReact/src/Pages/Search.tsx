import { useEffect, useState } from "react";
import DropdownList from "../Components/DropdownList";
import SearchBar from "../Components/SearchBar";
import { createSearchParams, useSearchParams } from "react-router-dom";
import FilterTags from "./FilterTags";

export default function Search() {
  const [_, setSearchParams] = useSearchParams();
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  useEffect(() => {
    const params: Record<string, string | string[]> = {};

    if (searchFilter.trim() !== "") {
      params["title"] = searchFilter;
    }

    if (selectedGenres.length > 0) {
      params["genre"] = selectedGenres;
    }

    setSearchParams(createSearchParams(params));
  }, [searchFilter, selectedGenres, setSearchParams]);

  var genres = ["Mystery", "Drama", "Comedy", "Horror", "Thriller", "Shounen"];

  return (
    <div className="searchContent">
      <div className="searchNavbar">
        <div className="filterForms">
          <div className="filterForm">
            <h3>Search</h3>
            <SearchBar
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
            ></SearchBar>
          </div>

          <div className="filterForm">
            <h3>Genres</h3>
            <DropdownList
              name="Genres"
              content={genres}
              selectedItems={selectedGenres}
              setSelectedItems={setSelectedGenres}
            ></DropdownList>
          </div>
        </div>

        <FilterTags
          searchFilter={searchFilter}
          resetSearchFilter={() => setSearchFilter("")}
          selectedGenres={selectedGenres}
          removeGenre={(item: string) =>
            setSelectedGenres((prev) => prev.filter((i) => i !== item))
          }
        ></FilterTags>
      </div>

      <div className="searchResult">
        <h2>itme2</h2>
        <h2>item2</h2>
      </div>
    </div>
  );
}
