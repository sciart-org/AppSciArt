import { useState } from "react";
import AsterButton from "../../../components/buttons/AsterButton";
import useFetcher from "../../../utils/useFetcher";
import { showSuccessMessage } from "../../../components/messages/Message";

export default function QuickRegisterBar() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const { fetcher } = useFetcher(error, setError);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = () => {
    if (email === "") {
      setError("Please, provide an email address");
      return;
    }

    fetcher({
      url: "register?method=quick",
      method: "POST",
      body: { email },
      onSuccess: () => {
        setEmail("");
        showSuccessMessage(
          "Thank you for registering! Check your inbox for the next steps.",
        );
      },
    });
  };

  return (
    <div>
      <h2>
        Do you want to participate and create science-inspired art,
        collaborating with minds from diverse disciplines to bring innovative
        ideas to life?
      </h2>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <input
          placeholder="Enter your email here..."
          type={"text"}
          style={{ width: "30rem", padding: "0.5rem" }}
          value={email}
          onChange={handleInputChange}
        />
        <AsterButton
          style={{ marginLeft: "1rem", width: "9rem" }}
          onClick={handleSubmit}
        >
          <text>Join now!</text>
        </AsterButton>
      </div>
    </div>
  );
}
