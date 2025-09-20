import CustomNode from "./CustomNode";

export default function AnnotationNode(props) {
  return (
    <CustomNode
      resizable={true}
      id={props.id}
      selected={props.selected}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
      }}
      textItem={"textarea"}
      itemStyle={{
        width: "80%",
        height: "80%",
        overflow: "hidden",
      }}
      makeEditable={true}
    />
  );
}
