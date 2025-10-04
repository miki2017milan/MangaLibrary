import React from "react";

type Props = {
  searchFilter: string;
  setSearchFilter: React.Dispatch<React.SetStateAction<string>>;
};

function SearchBar({ searchFilter, setSearchFilter }: Props) {
  // console.log("searchabr alarm");
  return (
    <div className="searchbar">
      <img src="search.webp" />
      <input
        type="text"
        placeholder=""
        onChange={(e) => setSearchFilter(e.target.value)}
        value={searchFilter}
      />

      {searchFilter != "" && (
        <img
          className="close"
          src="closeFilter.png"
          onClick={() => setSearchFilter("")}
        />
      )}
    </div>
  );
}

export default React.memo(SearchBar);
