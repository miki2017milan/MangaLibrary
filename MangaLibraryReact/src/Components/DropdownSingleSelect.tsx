import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  name: string;
  content: string[];
  labels: string[];
  selectedItem: string;
  setSelectedItem: (items: string) => void;
};

export default function DropdownMultiSelect({
  name,
  content,
  labels,
  selectedItem,
  setSelectedItem,
}: Props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      <div className="dropdownButton" onClick={() => setOpen(!open)}>
        {selectedItem != "" ? labels[content.indexOf(selectedItem)] : "Any"}

        {selectedItem != "" ? (
          <img src="/closeFilter.png" alt="" onClick={() => setSelectedItem("")} />
        ) : (
          <img src="/downarrow.png" alt="" />
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
            {content.map((item, i) => (
              <li
                className="dropdownItem"
                onMouseDown={() => {
                  // OnMouseDown instead of onClick becuase it fires befor the blur of the input field
                  selectedItem == item ? setSelectedItem("") : setSelectedItem(item);
                }}
              >
                {labels[i]}
                {selectedItem == item && <img src="/check.png" alt="noimage" />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
