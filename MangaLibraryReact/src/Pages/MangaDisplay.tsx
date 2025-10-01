import { useParams } from "react-router-dom";

type staff = {
  name: string;
  role: string;
};

type mangaResponse = {
  titleEnglish: string;
  titleNative: string;
  genres: string[];
  description: string;
  cover: string;
  bannerImage: string;
  staff: staff[];
};

export default function MangaDisplay() {
  let { mangaId } = useParams();

  const manga: mangaResponse = {
    titleEnglish: "To your Eternity",
    titleNative: "ベルセルク",
    genres: ["Action", "Drama", "Mystery", "Comedy", "Thriller", "Horror"],
    description:
      "Everyone faces uncertainty at some point in their lives. Even a brilliant surgeon like Kenzo Tenma is no exception. But there’s no way he could have known that his decision to stop chasing professional success and instead concentrate on his oath to save peoples’ lives would result in the birth of an abomination. The questions of good and evil now take on a terrifyingly real dimension.Years later, in Germany during the tumultuous post-reunification period, middle-aged childless couples are being killed one after another. The serial killer’s identity is known. The reasons why he kills are not. Dr. Tenma sets out on a journey to find the killer’s twin sister, who may hold some clues to solving the enigma of the “Monster.” (Source: Viz Media)",
    cover: "/test.jpg",
    bannerImage:
      "https://s4.anilist.co/file/anilistcdn/media/manga/banner/105778-xpU0zxrlU2Ux.jpg",
    staff: [
      { name: "Naoki Urasawa", role: "Story & Art" },
      { name: "Naoki Urasawa", role: "Story & Art" },
      { name: "Naoki Urasawa", role: "Story & Art" },
      { name: "Naoki Urasawa", role: "Story & Art" },
      { name: "Naoki Urasawa", role: "Story & Art" },
    ],
  };

  return (
    <>
      {manga.bannerImage != null ? (
        <img className="mangaBanner" src={manga.bannerImage} />
      ) : (
        <></>
      )}
      <div className="mangaDisplayContent">
        <img className="coverImage" src={manga.cover} />
        <div className="mangaText">
          <h2 className="mangaTitleEnglish">{manga.titleEnglish}</h2>
          <h3 className="mangaTitleNative">{manga.titleNative}</h3>
          <ul className="mangaGenres">
            {manga.genres.map((i) => (
              <li className="genreTag">{i}</li>
            ))}
          </ul>
          <p className="mangaDescription">{manga.description}</p>
        </div>

        <ul className="staff">
          {manga.staff.map((i) => (
            <li>
              <p className="staffName">{i.name}</p>
              <p className="staffRole">{i.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
