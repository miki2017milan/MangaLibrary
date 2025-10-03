type Props = {
  searchFilter: string;
  resetSearchFilter: () => void;
  selectedGenres: string[];
  removeGenre: (item: string) => void;
};

export default function FilterTags({
  searchFilter,
  resetSearchFilter,
  selectedGenres,
  removeGenre,
}: Props) {
  return (
    <ul className="searchFilters">
      {searchFilter != "" && (
        <li className="searchTag">
          <img src="/tag.png" alt="alarm" className="tagImage" />
          Search: {searchFilter}{" "}
          <img
            src="/close-button.webp"
            alt="noimg"
            className="closeImage"
            onClick={resetSearchFilter}
          />
        </li>
      )}
      {selectedGenres.map((item, index) => (
        <li key={index}>
          <img src="/tag.png" alt="alarm" className="tagImage" />
          {item}
          <img
            src="/close-button.webp"
            alt="noimg"
            className="closeImage"
            onClick={() => removeGenre(item)}
          />
        </li>
      ))}
    </ul>
  );
}
