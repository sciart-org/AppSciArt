import { Handle, NodeResizer } from "@xyflow/react";
import { useContext, useEffect, useRef, useState } from "react";
import { DiagramContext } from "./DiagramContext";

export default function CustomNode(props) {
  const { nodes, setNodes } = useContext(DiagramContext);
  const [isEditable, setIsEditable] = useState(false);
  const inputRef = useRef(null);

  const label = nodes.filter((n) => n.id === props.id)[0]?.data.label;

  const onChange = (event) => {
    const newNodes = nodes.map((node) => {
      if (node.id === props.id) {
        node.data = {
          ...node.data,
          label: event.target.value,
        };
      }
      return node;
    });
    setNodes(newNodes);
  };

  useEffect(() => {
    if (isEditable && inputRef.current) {
      inputRef.current.focus();

      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    } else if (!isEditable && inputRef.current) {
      window.getSelection()?.removeAllRanges();
    }
  }, [isEditable]);

  const textProps = {
    style: {
      margin: "auto",
      border: 0,
      textAlign: "center",
      background: isEditable ? "white" : "transparent",
      cursor: isEditable ? "text" : "default",
      pointerEvents: isEditable ? "auto" : "none",
      userSelect: isEditable ? "text" : "none",
    },
    id: "text",
    name: "text",
    value: label,
    ref: inputRef,
    readOnly: !isEditable,
    onBlur: () => setIsEditable(false),
    onChange: onChange,
  };

  return (
    <>
      {props.resizable && (
        <NodeResizer
          lineStyle={props.selected ? {} : { border: 0 }}
          handleStyle={props.selected ? {} : { width: 0 }}
          minWidth={1}
          minHeight={1}
        />
      )}
      <div
        className={props.className}
        style={props.style}
        onDoubleClick={() => {
          if (props.makeEditable) setIsEditable(true);
        }}
      >
        {props.children}
        {props.textItem && (
          <props.textItem
            {...textProps}
            style={{
              ...textProps.style,
              ...props.itemStyle,
            }}
          />
        )}
      </div>
      {props.includeHandles && (
        <>
          <Handle type="source" position="top" id={"t"} />
          <Handle type="source" position="bottom" id={"b"} />
          <Handle type="source" position="left" id={"l"} />
          <Handle type="source" position="right" id={"r"} />
        </>
      )}
    </>
  );
}
