import DropdownList from "../Components/DropdownList";

export default function Genres() {
  var genres = ["Mystery", "Drama", "Comedy", "Horror", "Thriller", "Shounen"];

  return (
    <div className="filter">
      <h3>Genres</h3>
      <DropdownList name="Genres" content={genres}></DropdownList>
    </div>
  );
}
