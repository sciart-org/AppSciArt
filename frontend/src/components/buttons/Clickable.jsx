import "./Clickable.css";

export default function Clickable({ children, onClick, style }) {
  return (
    <div
      tabIndex={0}
      className="redirect-buttons-container"
      onClick={onClick}
      style={{ ...style }}
    >
      {children}
    </div>
  );
}
