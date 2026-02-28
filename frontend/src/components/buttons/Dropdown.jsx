import { useRef, useState } from "react";
import { useDropdown } from "../../utils/useDropdown";
import { Link } from "react-router";
import "../core/core.css";
import { IoChevronDown } from "react-icons/io5";

export default function Dropdown({ children, title, style }) {
  const [showCollections, setShowDropdown] = useState(false);
  const dropdownref = useRef(null);
  useDropdown(dropdownref, () => setShowDropdown(false));

  return (
    <Link
      onClick={() => setShowDropdown(!showCollections)}
      className="collections-container"
      ref={dropdownref}
    >
      <text>{title}</text>
      <IoChevronDown size={"1.25rem"} style={{ marginLeft: "0.2rem" }} />
      {showCollections && (
        <div className="collections-dropdown" style={{ ...style }}>
          {children}
        </div>
      )}
    </Link>
  );
}
