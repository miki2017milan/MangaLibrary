import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  name: string;
  content: string[];
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
};

export default function DropdownMultiSelect({
  name,
  content,
  selectedItems,
  setSelectedItems,
}: Props) {
  const [open, setOpen] = useState(false);
  const [searchWord, setSearchWord] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const removeSelectedItem = (item: string) => {
    setSelectedItems(selectedItems.filter((i) => i !== item));
  };

  const addSelectedItem = (item: string) => {
    setSelectedItems([...selectedItems, item]);
    setSearchWord("");
  };

  const isSearchWordInItem = (item: string) => {
    return item.toLowerCase().includes(searchWord.toLowerCase());
  };

  useEffect(() => {
    // close dropdown if click outside
    function close(e: MouseEvent) {
      if (dropdownRef.current != null && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    // add or remove event listener
    if (open) {
      window.addEventListener("click", close);
    }
    // cleanup
    return function removeListener() {
      window.removeEventListener("click", close);
    };
  }, [open]);

  return (
    <div ref={dropdownRef}>
      <div className="dropdownButton">
        <div className="placeholder" onClick={() => setOpen(!open)}>
          {selectedItems.length > 0 && (
            <>
              <div className="selectedGenre">{selectedItems[0]}</div>
              {selectedItems.length > 1 && (
                <div className="selectedGenre">+{selectedItems.length - 1}</div>
              )}
            </>
          )}
        </div>
        <input
          type="search"
          onChange={(e) => setSearchWord(e.target.value)}
          onClick={() => setOpen(true)}
          onBlur={() => setSearchWord("")}
          value={searchWord}
        />
        {selectedItems.length > 0 ? (
          <img
            src="/closeFilter.png"
            alt=""
            onClick={() => {
              setSelectedItems([]);
              setOpen(false);
            }}
          />
        ) : (
          <img src="/downarrow.png" alt="" onClick={() => setOpen(!open)} />
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="dropdownContent"
          >
            <h3>{name}</h3>
            {content.map(
              (item) =>
                isSearchWordInItem(item) && (
                  <li
                    className="dropdownItem"
                    onMouseDown={() => {
                      // OnMouseDown instead of onClick becuase it fires befor the blur of the input field
                      selectedItems.includes(item)
                        ? removeSelectedItem(item)
                        : addSelectedItem(item);
                    }}
                  >
                    {item}
                    {selectedItems.includes(item) && <img src="/check.png" alt="noimage" />}
                  </li>
                )
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
