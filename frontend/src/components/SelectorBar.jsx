import "./SelectorBar.css";

export default function SelectorBar(props) {
  return (
    <div className="selector-bar" style={props.style}>
      {props.children}
    </div>
  );
}
