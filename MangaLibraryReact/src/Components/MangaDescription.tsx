import DOMPurify from "dompurify";

type Props = {
  description: string | null | undefined;
};

export default function MangaDescription({ description }: Props) {
  return (
    description != null && (
      <p
        className="mangaDescription"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(description),
        }}
      ></p>
    )
  );
}
