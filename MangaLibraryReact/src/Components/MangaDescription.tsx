import DOMPurify from "dompurify";

type Props = {
  description: string | null | undefined;
};

export default function MangaGenres({ description }: Props) {
  return (
    description != null && (
      <p
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(description),
        }}
      ></p>
    )
  );
}
