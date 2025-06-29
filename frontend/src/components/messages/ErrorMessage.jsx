import { useContext, useEffect } from "react";
import { MessageContext } from "../../context/MessageContext";

export default function ErrorMessage({ errorMessage, setErrorMessage }) {
  const { showErrorMessage } = useContext(MessageContext);
  useEffect(() => {
    if (errorMessage) {
      showErrorMessage(errorMessage, setErrorMessage);
    }
  }, [errorMessage]);
  return <></>;
}
