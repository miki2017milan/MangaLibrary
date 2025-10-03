import React from "react";
import clsx from "clsx";

type props = {
  content: string;
  selected: boolean;
  searchWord: string;
  removeSelectedItem: (item: string) => void;
  appendSelectedItem: (item: string) => void;
};

function DropdownItem({
  content,
  selected,
  searchWord,
  removeSelectedItem,
  appendSelectedItem,
}: props) {
  console.log("rerender alarm item" + content);

  const className = clsx("dropdownItem", {
    selected,
    nodisplay:
      searchWord && !content.toLowerCase().includes(searchWord.toLowerCase()),
  });
  return (
    <li
      className={className}
      onMouseDown={() => {
        // OnMouseDown instead of onClick becuase it fires befor the blur of the input field
        selected ? removeSelectedItem(content) : appendSelectedItem(content);
      }}
    >
      {content}
      <img
        className={selected ? "" : "nodisplay"}
        src="/check.png"
        alt="noimage"
      />
    </li>
  );
}

export default React.memo(DropdownItem);
