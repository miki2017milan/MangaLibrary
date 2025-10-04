import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import MangaGenres from "../Components/MangaGenres";
import MangaDescription from "../Components/MangaDescription";

type MangaResponse = {
  titleEnglish: string;
  titleNative: string;
  genres: string[];
  description: string;
  cover: string;
  bannerImage: string;
  staff: { name: string; role: string }[];
};

function loadingPage() {
  return (
    <>
      <div className="mangaBanner loading" />
      <div className="mangaDisplayContent">
        <div className="coverImage loading" />
      </div>
    </>
  );
}

function errorPage() {
  return (
    <>
      <h1>Error 404!</h1> <h2>Manga not found</h2>
    </>
  );
}

const fetchManga = async (id: string): Promise<MangaResponse> => {
  const res = await axios.get<MangaResponse>(
    `http://localhost:5181/api/mangas?id=${id}`
  );
  return res.data;
};

export default function MangaDisplay() {
  const { mangaId } = useParams<{ mangaId: string }>();

  const {
    data: manga,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["manga", mangaId],
    queryFn: () => fetchManga(mangaId!),
    enabled: !!mangaId,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 400) return false;
      return failureCount < 3;
    },
  });

  if (isLoading) {
    return loadingPage();
  }

  if (isError) {
    const err = error as any;
    if (err?.response?.status === 400) {
      return errorPage();
    }
    return <p style={{ color: "red" }}>Unexpected error</p>;
  }

  return (
    <>
      {manga?.bannerImage && (
        <img className="mangaBanner" src={manga.bannerImage} />
      )}
      <div className="mangaDisplayContent">
        <img
          className="coverImage"
          src={manga?.cover}
          alt={manga?.titleEnglish + "cover"}
        />
        <div className="mangaText">
          <h2 className="mangaTitleEnglish">{manga?.titleEnglish}</h2>
          <h3 className="mangaTitleNative">{manga?.titleNative}</h3>
          <MangaGenres genres={manga?.genres}></MangaGenres>
          <MangaDescription description={manga?.description}></MangaDescription>
        </div>

        <ul className="staff">
          {manga?.staff.map((member, i) => (
            <li key={i} className="test">
              <p className="staffName">{member.name}</p>
              <p className="staffRole">{member.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
