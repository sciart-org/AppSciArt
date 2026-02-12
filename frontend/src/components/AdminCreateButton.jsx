import { useNavigate } from "react-router";
import tokenService from "../utils/token.service";
import AsterButton from "./AsterButton";

export default function AdminCreateButton({ entity }) {
  const user = tokenService.getUser();
  const isAdmin = user?.roles.includes("administrator");
  const navigate = useNavigate();

  if (!isAdmin) return null;
  return (
    <AsterButton style={{ width: "20rem" }} onClick={() => navigate("create")}>
      Create {entity}
    </AsterButton>
  );
}
