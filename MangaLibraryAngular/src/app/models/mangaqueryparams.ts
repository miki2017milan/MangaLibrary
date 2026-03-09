export type MangaQueryParams = {
  title: string;
  genres: string[];
  tags: string[];
  format: string;
  includesAdultContent: boolean;
  countryOfOrigin: string;
  page: number;
};
