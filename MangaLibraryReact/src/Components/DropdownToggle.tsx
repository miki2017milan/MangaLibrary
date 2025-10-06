import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  name: string;
  status: boolean;
  setStatus: (status: boolean) => void;
};

export default function DropdownToggle({ name, status, setStatus }: Props) {
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
        {status ? "Yes" : "No"}
        <img src="/downarrow.png" alt="" />
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
            <li className="dropdownItem" onMouseDown={() => setStatus(true)}>
              Yes
              {status && <img src="/check.png" alt="noimage" />}
            </li>
            <li className="dropdownItem" onMouseDown={() => setStatus(false)}>
              No
              {!status && <img src="/check.png" alt="noimage" />}
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
