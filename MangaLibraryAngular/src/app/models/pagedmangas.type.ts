import { Manga } from './manga.type';

export type PagedMangas = {
  content: Manga[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
};
