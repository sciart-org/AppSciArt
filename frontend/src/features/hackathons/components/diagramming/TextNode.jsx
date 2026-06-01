import { useContext } from "react";
import { DiagramContext } from "./DiagramContext";
import CustomNode from "./CustomNode";

export default function TextNode(props) {
  const { nodes } = useContext(DiagramContext);

  const label = nodes.filter((n) => n.id === props.id)[0]?.data.label;

  return (
    <CustomNode
      includeHandles={true}
      id={props.id}
      selected={props.selected}
      className={"react-flow__node-default nopan selected selectable draggable"}
      style={{
        width: `${label?.length || 1}ch`,
        minWidth: "15ch",
        maxWidth: "50ch",
      }}
      textItem={"input"}
      itemStyle={{
        width: "100%",
      }}
      makeEditable={true}
    />
  );
}
