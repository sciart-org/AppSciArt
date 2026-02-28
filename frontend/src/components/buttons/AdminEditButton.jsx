import { EditionActionButton } from "../../features/editions/components/EditionActionButton";
import tokenService from "../../utils/token.service";
import AsterButton from "./AsterButton";

export default function AdminEditButton({ entityName, entity }) {
  const isAdmin = tokenService.getIsAdmin();
  if (!isAdmin) return null;

  const SecondaryButton = () => {
    if (entityName?.toLowerCase() === "edition") {
      return (
        <EditionActionButton style={{ width: "15rem" }} edition={entity} />
      );
    }
    return <></>;
  };

  return (
    <div className="buttons-container">
      <AsterButton
        to={`/${entityName}/${entity?.id}`}
        style={{ width: "15rem" }}
      >
        Edit
      </AsterButton>
      <SecondaryButton />
    </div>
  );
}
