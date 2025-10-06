import { createContext } from "react";

type FilterContextType = {
  searchFilter: string;
  setSearchFilter: (searchFilter: string) => void;
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
  showAdultContent: boolean;
  setAdultContent: (status: boolean) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
};

const FilterContext = createContext<FilterContextType>({
  searchFilter: "",
  setSearchFilter: () => {},
  selectedGenres: [],
  setSelectedGenres: () => {},
  showAdultContent: false,
  setAdultContent: () => {},
  sortBy: "",
  setSortBy: () => {},
});

export var sortByValues = ["alphaASC", "alphaDEC", "releaseASC", "releaseDEC"];
export var sortByLabels = ["A-Z", "Z-A", "Release date ↑", "Release date ↓"];

export default FilterContext;
