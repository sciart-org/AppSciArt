import { useState } from "react";
import Column from "./Column";

export default function AggregationsSection({ aggregation, children }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Column key={aggregation.id} data={aggregation.id}>
      <h4
        className="group-box-header aggregation-section-header"
        onClick={() => setCollapsed((prev) => !prev)}
      >
        {aggregation.title}
        <span style={{ fontSize: "0.8rem", color: "#888", marginLeft: "2rem" }}>
          {collapsed ? "▶" : "▼"}
        </span>
      </h4>
      <div style={{ minHeight: collapsed ? "3.5rem" : "0.5rem" }}>
        {collapsed ? children : null}
      </div>
    </Column>
  );
}
