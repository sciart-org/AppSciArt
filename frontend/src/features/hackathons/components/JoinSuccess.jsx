import AsterButton from "../../../components/AsterButton";
import ClickableText from "../../../components/ClickableText";

export default function JoinSuccess() {
  return (
    <div>
      <div>
        <h2>You have joined successfully</h2>
        <p> Updates will be sent to your email</p>
      </div>
      <div style={{ marginTop: "10vh" }}>
        <h3>Curious to see what you will be working on?</h3>
        <AsterButton>Seed collection</AsterButton>
      </div>
      <div>
        <p>See an example here</p>
      </div>
      <ClickableText
        onClick={() => (window.location.href = "/")}
        style={{ marginTop: "5vh" }}
      >
        Home
      </ClickableText>
    </div>
  );
}
