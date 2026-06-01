import { useState } from "react";

export default function useCollapsible(defaultCollapsed = false) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const toggle = () => setCollapsed((prev) => !prev);
  return { collapsed, toggle };
}
