import Genres from "../Components/Genres";
import SearchBar from "../Components/SearchBar";

export default function Search() {
  return (
    <>
      <div className="searchContent">
        <SearchBar></SearchBar>
        <Genres></Genres>
      </div>
    </>
  );
}
