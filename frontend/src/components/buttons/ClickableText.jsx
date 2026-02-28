import "./ClickableText.css";

export default function ClickableText({ children, onClick, style }) {
  return (
    <div
      className="redirect-buttons-container"
      onClick={onClick}
      style={{ ...style }}
    >
      {children}
    </div>
  );
}
