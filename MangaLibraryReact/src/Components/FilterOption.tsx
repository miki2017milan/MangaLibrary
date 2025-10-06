import { JSX } from "react";

type Props = {
  name: string;
  children: JSX.Element | JSX.Element[];
};

export default function FilterOption({ name, children }: Props) {
  return (
    <div className="filterForm">
      <h3>{name}</h3>
      {children}
    </div>
  );
}
