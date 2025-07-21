import logoFlowerBlack from "../../assets/logoFlowerBlack.png";

export default function Flower({ style, className }) {
  return (
    <div>
      <img src={logoFlowerBlack} style={style} className={className} />
    </div>
  );
}
