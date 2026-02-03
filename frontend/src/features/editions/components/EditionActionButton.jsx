import AsterButton from "../../../components/AsterButton";

export const EditionActionButton = ({ edition, ...props }) => {
  switch (edition?.state) {
    case "PLANNED":
      return (
        <AsterButton {...props} onClick={() => console.log("Announce")}>
          Announce
        </AsterButton>
      );

    case "ACTIVE":
      return (
        <AsterButton {...props} onClick={() => console.log("Close")}>
          Close
        </AsterButton>
      );

    case "CLOSED":
      return (
        <AsterButton {...props} onClick={() => console.log("Publish")}>
          Publish
        </AsterButton>
      );

    default:
      return null;
  }
};
