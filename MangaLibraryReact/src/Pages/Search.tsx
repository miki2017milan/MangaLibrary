import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import MangaGenres from "../Components/MangaGenres";
import MangaDescription from "../Components/MangaDescription";
import FilterContext, { sortByValues } from "../Components/FilterContext";
import Filters from "../Components/Filters";

type MangaSearchResponse = {
  id: string;
  titleEnglish: string;
  description: string;
  genres: string[];
  cover: string;
};

const fetchMangaData = async (searchParams: URLSearchParams): Promise<MangaSearchResponse[]> => {
  const res = await axios.get<MangaSearchResponse[]>("https://localhost:6060/api/mangas/query", {
    params: searchParams,
  });
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
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters
  const [searchFilter, setSearchFilter] = useState<string>(searchParams.get("title") ?? "");
  const [selectedGenres, setSelectedGenres] = useState<string[]>(searchParams.getAll("genre"));
  const [showAdultContent, setAdultContent] = useState<boolean>(searchParams.get("adultContent") === "true");
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get("sortBy") &&
      searchParams.get("sortBy")! in sortByValues
      ? searchParams.get("sortBy")!
      : ""
  );

  const [listView, setListView] = useState<boolean>(true);
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

    if (showAdultContent) params.append("adultContent", "true");

    if (sortBy != "") params.append("sortBy", sortBy);

    return params;
  }

  const {
    data: mangas,
    error,
    isLoading,
    isError,
  } = useQuery<MangaSearchResponse[]>({
    queryKey: ["mangas", delayedSearch.trim(), selectedGenres.sort(), showAdultContent, sortBy],
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
  }, [delayedSearch, selectedGenres, showAdultContent, sortBy, setSearchParams]);

  const navbar = () => {
    return (
      <FilterContext.Provider
        value={{
          searchFilter: searchFilter,
          setSearchFilter: (searchFilter: string) => setSearchFilter(searchFilter),
          selectedGenres: selectedGenres,
          setSelectedGenres: (genres: string[]) => setSelectedGenres(genres),
          showAdultContent: showAdultContent,
          setAdultContent: (status: boolean) => setAdultContent(status),
          sortBy: sortBy,
          setSortBy: (sortBy: string) => setSortBy(sortBy),
          listView: listView,
          setListView: (listView: boolean) => setListView(listView),
        }}
      >
        <Filters></Filters>
      </FilterContext.Provider>
    );
  };

  const errorPage = (text: string) => {
    return (
      <div className="searchContent">
        {navbar()}
        <h1>{text}</h1>
      </div>
    );
  };

  if (isError) {
    var text = error.message;
    if ((error as any)?.response?.status == 404) text = "No manga found!";
    return errorPage(text);
  }

  const loadingPage = () => {
    return (
      <div className="searchContent">
        {navbar()}
        <ul className={listView ? "searchResult list" : "searchResult grid"}>
          {Array.from({ length: 10 }).map((_, i) => (
            <li key={i} className="mangaResult loading"></li>
          ))}
        </ul>
      </div>
    );
  };

  if (isLoading) {
    return loadingPage();
  }

  return (
    <div className="searchContent">
      {navbar()}

      <ul className={listView ? "searchResult list" : "searchResult grid"}>
        {mangas?.map((manga, i) => (
          <li className="mangaResult" key={i}>
            <img
              src={manga.cover}
              className="loading"
              onClick={() => navigate("/manga/" + manga.id)}
            />
            <div className="text">
              <h2 onClick={() => navigate("/manga/" + manga.id)}>{manga.titleEnglish}</h2>
              <MangaGenres genres={manga.genres}></MangaGenres>
              <MangaDescription description={manga.description}></MangaDescription>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
