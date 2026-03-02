export type Manga = {
  title: string;
  titleNative: string;
  genres: string[];
  tags: string[];
  format: string;
  releaseYear: number;
  releaseMonth: number;
  releaseDay: number;
  adultContent: boolean;
  countryOfOrigin: string;
  cover: string;
  banner: string;
  description: string;
  staff: { name: string; role: string }[];
};
