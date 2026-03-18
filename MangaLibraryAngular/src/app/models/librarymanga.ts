import { Manga } from './manga.type';

export type LibraryManga = Manga & {
  status: string;
};
