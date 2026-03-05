import SciArtProducts from "../../../components/sciartProducts/SciArtProducts";
import { parseEnumValue } from "../../../utils/commonUtils";

export default function HackathonDescription(props) {
  const mockedHackathon = {
    ...props.hackathon,
    descriptionParagraphs: {
      before_the_hackathon: `· (January 10, 2025) Webinar (online) with MARÍA PTQK
      
· (January 20, 2025) Webinar (online) with Paula Bruna and Raquel Ajetes

Participate in live webinars with María PTQK, Paula Bruna, and Raquel Ajetes, experts in the field of SciArt. During these webinars, we will present the ASTER+S project and introduce the eco-SciArt methodology`,
      during_the_hackathon: `· 1st Day of the Hackathon: Meet the participants + Develop a common understanding of "SciArt Seeds" + Form interdisciplinary teams.

· 2nd Day of the Hackathon: Brainstorm to develop the artistic concept and create the SciArt proposal, which we call
"SciArt Flowers."`,
      after_the_hackathon: `Over the course of three months, interdisciplinary creative teams will develop their final artworks. Thus, the flowers will transform into the "fruits of SciArt."

The selected "SciArt Flowers" will become part of a collective exhibition to be inaugurated before the summer of 2025. The exhibition will invite visitors to immerse themselves in the artistic installations, not only enjoying them but also exploring the profound scientific and humanistic dimensions that inspire them. 

A selection of this exhibition may be showcased during the Ars Electronica Festival in Linz, Austria.`,
    },
  };

  return (
    <div style={{ width: "70vw" }}>
      <h2 style={{ textAlign: "start" }}>What will we do?</h2>
      <div style={{ display: "flex" }}>
        <div>
          {Object.entries(mockedHackathon?.descriptionParagraphs).map(
            ([key, value]) => (
              <>
                <h3 style={{ textAlign: "start" }}>{parseEnumValue(key)}</h3>
                <p
                  style={{
                    whiteSpace: "pre-line",
                    textAlign: "start",
                    width: "100%",
                  }}
                >
                  {value}
                </p>
              </>
            ),
          )}
        </div>
        <div style={{ justifyItems: "start", marginLeft: "2rem" }}>
          <SciArtProducts style={{ flexDirection: "column", height: "100%" }} />
        </div>
      </div>
    </div>
  );
}
