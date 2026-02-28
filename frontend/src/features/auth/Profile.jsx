import React from "react";
import AsterButton from "../../components/buttons/AsterButton.jsx";
import tokenService from "../../utils/token.service.js";

export default function Profile() {
  return (
    <div style={{ padding: "10vh" }}>
      <AsterButton
        onClick={() => {
          tokenService.removeUser();
          window.location.href = "/";
        }}
      >
        <text>Log out</text>
      </AsterButton>
    </div>
  );
}
