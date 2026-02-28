import tokenService from "../../utils/token.service";
import AsterButton from "./AsterButton";

export default function AdminCreateButton({ entity }) {
  const isAdmin = tokenService.getIsAdmin();
  if (!isAdmin) return null;

  return (
    <AsterButton style={{ width: "20rem" }} to={"create"}>
      Create {entity}
    </AsterButton>
  );
}
