import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useEffect, useRef, useState } from "react";

export default function Column({ data, children, style }) {
  const ref = useRef(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      getData: () => ({ data }),
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, [data]);

  return (
    <div
      ref={ref}
      style={{
        minHeight: "3.5rem",
        transition: "background-color 0.2s",
        ...style,
      }}
    >
      {isDraggedOver && !children?.length ? (
        <p
          className="group-box-item"
          style={{ backgroundColor: "skyblue", opacity: 0.5 }}
        >
          &nbsp;
        </p>
      ) : (
        <div
          style={{
            backgroundColor: isDraggedOver
              ? "rgba(135,206,235,0.15)"
              : undefined,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
