export default function CollapsibleButton({
  collapsed,
  toggle = () => {},
  className,
  style,
}) {
  return (
    <span
      className={className}
      style={{ fontSize: "0.8rem", color: "#888", cursor: "pointer", ...style }}
      onClick={toggle}
    >
      {collapsed ? "▶" : "▼"}
    </span>
  );
}
