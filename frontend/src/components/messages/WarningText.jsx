export default function WarningText({ style, className = "", children }) {
  return (
    <p className={`warning-text justified-text ${className}`} style={style}>
      {children}
    </p>
  );
}
