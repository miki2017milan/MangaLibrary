type Props = {
  genres: string[] | undefined;
};

export default function MangaGenres({ genres }: Props) {
  return (
    <ul className="mangaGenres">
      {genres?.map((genre, j) => (
        <li key={j} className="genreTag">
          {genre}
        </li>
      ))}
    </ul>
  );
}
