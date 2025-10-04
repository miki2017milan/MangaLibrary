import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DropdownItem from "./DropdownItem";
import React from "react";

type Props = {
  name: string;
  content: string[];
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function DropdownList({
  name,
  content,
  selectedItems,
  setSelectedItems,
}: Props) {
  const [open, setOpen] = useState(false);
  const [searchWord, setSearchWord] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const removeSelectedItem = useCallback((item: string) => {
    setSelectedItems((prev) => prev.filter((i) => i !== item));
  }, []);

  const appendSelectedItem = useCallback((item: string) => {
    setSelectedItems((prev) => [...prev, item]);
    setSearchWord("");
  }, []);

  const updateSearchWord = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchWord(e.target.value);
    },
    []
  );

  useEffect(() => {
    // close dropdown if click outside
    function close(e: MouseEvent) {
      if (
        dropdownRef.current != null &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
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
          onChange={updateSearchWord}
          onClick={() => setOpen(true)}
          onBlur={() => setSearchWord("")}
          value={searchWord}
        />
        {selectedItems.length > 0 ? (
          <img
            src="/closeFilter.png"
            alt=""
            onClick={() => setSelectedItems([])}
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
            {content.map((item) => (
              <DropdownItem
                content={item}
                selected={selectedItems.includes(item)}
                searchWord={searchWord}
                removeSelectedItem={removeSelectedItem}
                appendSelectedItem={appendSelectedItem}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
