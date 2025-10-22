type Props = {
  title: string;
  failState: string;
  onChange: (e: any) => void;
  type: string;
};

export default function FormField({ title, failState, onChange, type }: Props) {
  return (
    <>
      <p>{title}</p>
      <input
        type={type}
        className={failState != "" ? "failInput" : ""}
        onChange={(e) => onChange(e)}
      />
      {failState == "" ? null : <p className="failText">{failState}</p>}
    </>
  );
}
