import useCollapsible from "../../utils/useCollapsible";
import CollapsibleButton from "../buttons/CollapsibleButton";
import CollapsibleWrapper from "../buttons/CollapsibleWrapper";
import Column from "./Column";

export default function AggregationsSection({ data, title, children }) {
  const { collapsed, toggle } = useCollapsible();
  return (
    <Column data={data}>
      <h4
        className="group-box-header aggregation-section-header"
        onClick={toggle}
      >
        {title}
        {children && <CollapsibleButton collapsed={collapsed} />}
      </h4>
      <div className="aggregation-members">
        <CollapsibleWrapper collapsed={collapsed}>
          {children}
        </CollapsibleWrapper>
      </div>
    </Column>
  );
}
