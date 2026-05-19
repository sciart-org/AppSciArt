import tokenService from "../../utils/token.service";
import AsterButton from "./AsterButton";

export default function AdminCreateButton({ entity, style }) {
  const isStaff = tokenService.getIsStaff();
  if (!isStaff) return null;

  return (
    <AsterButton
      style={{ width: "20rem", marginBottom: "2rem", ...style }}
      to={"create"}
    >
      Create {entity}
    </AsterButton>
  );
}
