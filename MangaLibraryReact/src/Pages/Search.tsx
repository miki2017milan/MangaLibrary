import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import DropdownList from "../Components/DropdownList";
import SearchBar from "../Components/SearchBar";
import FilterTags from "./FilterTags";
import MangaGenres from "../Components/MangaGenres";
import MangaDescription from "../Components/MangaDescription";

type MangaSearchResponse = {
  id: string;
  titleEnglish: string;
  description: string;
  genres: string[];
  cover: string;
};

const fetchMangaData = async (
  searchParams: URLSearchParams
): Promise<MangaSearchResponse[]> => {
  const res = await axios.get<MangaSearchResponse[]>(
    "http://localhost:5181/api/mangas/search",
    {
      params: searchParams,
    }
  );
  return res.data;
};

function useDebounce<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function Search() {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const delayedSearch = useDebounce(searchFilter, 500);
  const navigate = useNavigate();

  function createParamsFromFilters() {
    const params = new URLSearchParams();

    if (searchFilter.trim()) {
      params.set("title", searchFilter.trim());
    }

    selectedGenres.forEach((genre) => {
      params.append("genre", genre);
    });

    return params;
  }

  const {
    data: mangas,
    error,
    isLoading,
    isError,
  } = useQuery<MangaSearchResponse[]>({
    queryKey: ["mangas", delayedSearch.trim(), selectedGenres.sort()],
    queryFn: () => {
      return fetchMangaData(createParamsFromFilters());
    },
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });

  useEffect(() => {
    setSearchParams(createParamsFromFilters());
  }, [delayedSearch, selectedGenres, setSearchParams]);

  useEffect(() => {
    setSearchFilter(
      searchParams.get("title") != null ? searchParams.get("title")! : ""
    );
    setSelectedGenres(searchParams.getAll("genre"));
  }, [searchParams]);

  if (isError) {
    if ((error as any)?.response.status != 404)
      return (
        <p style={{ color: "red" }}>
          Error {error.name}: {error.message}
        </p>
      );
  }

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

      {(error as any)?.response.status == 404 ? (
        <>
          <h1>No manga found!</h1>
        </>
      ) : (
        <ul className="searchResult">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <li key={i} className="mangaResult loading"></li>
              ))
            : mangas?.map((manga, i) => (
                <li className="mangaResult" key={i}>
                  <img
                    src={manga.cover}
                    alt=""
                    className="loading"
                    onClick={() => navigate("/manga/" + manga.id)}
                  />
                  <div className="text">
                    <h2 onClick={() => navigate("/manga/" + manga.id)}>
                      {manga.titleEnglish}
                    </h2>
                    <MangaGenres genres={manga.genres}></MangaGenres>
                    <MangaDescription
                      description={manga.description}
                    ></MangaDescription>
                  </div>
                </li>
              ))}
        </ul>
      )}
    </div>
  );
}
