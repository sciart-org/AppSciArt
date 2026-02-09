import { Bounce, Slide, ToastContainer, toast } from "react-toastify";

function Message() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      transition={Bounce}
    />
  );
}

function showErrorMessage(errorMessage, setErrorMessage) {
  toast.error(errorMessage, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Slide,
    onClose: () => setErrorMessage(null),
  });
}

function showSuccessMessage(message, setMessage = () => {}) {
  toast.success(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Slide,
    onClose: () => setMessage(null),
  });
}

export { Message, showErrorMessage, showSuccessMessage };
