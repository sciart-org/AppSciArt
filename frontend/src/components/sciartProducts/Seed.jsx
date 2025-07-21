import logoSeedBlack from "../../assets/logoSeedBlack.png";

export default function Seed({ style, className }) {
  return (
    <div>
      <img src={logoSeedBlack} style={style} className={className} />
    </div>
  );
}
