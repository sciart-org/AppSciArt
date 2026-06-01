import { FaInstagram, FaFacebook, FaLink } from "react-icons/fa6";
import "./SocialNetworks.css";

export default function SocialNetworks(props) {
  return (
    <div
      style={{ ...props.style }}
      className={props.className + " social-networks"}
    >
      <FaInstagram
        onClick={() =>
          window.open("https://www.instagram.com/asterproyecto", "_blank")
        }
      />
      <FaFacebook
        onClick={() =>
          window.open(
            "https://www.facebook.com/Proyecto-ASTER-109935918470222",
            "_blank",
          )
        }
      />
      <FaLink
        onClick={() =>
          window.open("https://aster.us.es/alleditions/", "_blank")
        }
      />
    </div>
  );
}
