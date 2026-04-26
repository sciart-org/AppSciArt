import "./SelectorBar.css";

export default function SelectorBar(props) {
  return (
    <div
      className={`${props.className ?? ""} selector-bar`}
      style={props.style}
    >
      {props.children}
    </div>
  );
}
