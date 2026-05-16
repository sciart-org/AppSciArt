import flowerJpg from "../../assets/logoFlowerBlack.png";
import "./Loading.css";

export default function Loading() {
  return (
    <div className="loading-container">
      <img
        src={flowerJpg}
        className="spinner-flower"
        alt="Loading"
        style={{ width: "5rem" }}
      />
      <p className="loading-text">Loading</p>
    </div>
  );
}
