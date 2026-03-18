import SciArtProducts from "../../../components/sciartProducts/SciArtProducts";

export default function HackathonDescription({ hackathon }) {
  if (!hackathon) return null;
  return (
    <div style={{ width: "70vw" }}>
      <h2 style={{ textAlign: "start" }}>What will we do?</h2>
      <div style={{ display: "flex" }}>
        <div>
          {hackathon?.descriptionSections?.map((section, index) => (
            <div key={index}>
              <h3 style={{ textAlign: "start" }}>{section.title}</h3>
              <p
                style={{
                  whiteSpace: "pre-line",
                  textAlign: "start",
                  width: "100%",
                }}
              >
                {section.text}
              </p>
            </div>
          ))}
        </div>
        <div style={{ justifyItems: "start", marginLeft: "2rem" }}>
          <SciArtProducts style={{ flexDirection: "column", height: "100%" }} />
        </div>
      </div>
    </div>
  );
}
