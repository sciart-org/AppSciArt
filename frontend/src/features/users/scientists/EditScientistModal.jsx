import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import useFetcher from "../../../utils/useFetcher";
import SubmitCancelButtons from "../../../components/SubmitCancelButtons";

export default function EditScientistModal({
  openModal,
  setOpenModal,
  scientist,
}) {
  const [error, setError] = useState(null);
  const [allEditions, setAllEditions] = useState([]);
  const [editionSelection, setEditionSelection] = useState({});

  useEffect(() => {
    if (!allEditions || allEditions.length === 0) return;
    const initialSelectedEditions = {};
    allEditions
      .sort((a, b) => a.year - b.year)
      .map((e) => {
        const isIncluded = scientist?.editions?.includes(e.name);
        initialSelectedEditions[e.id] = isIncluded;
      });
    setEditionSelection(initialSelectedEditions);
  }, [allEditions, scientist]);

  const { fetcher } = useFetcher(error, setError);

  useEffect(() => {
    fetcher({
      url: "editions",
      onSuccess: (data) => {
        setAllEditions(data);
      },
      onError: () => {
        setAllEditions([]);
      },
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetcher({
      url: `scientists/${scientist?.id}/editions`,
      method: "PATCH",
      body: editionSelection,
      onSuccess: () => {
        setOpenModal(false);
      },
    });
  };

  return (
    <Modal openCondition={openModal}>
      <h3>
        Edit {scientist?.name} {scientist?.surname} editions
      </h3>
      <hr style={{ width: "90%", margin: "0 auto" }} />
      <form
        onSubmit={handleSubmit}
        className="seed-creation-form"
        style={{
          width: "90%",
          margin: "auto",
          marginTop: "1rem",
        }}
      >
        <div style={{ textAlign: "start" }}>
          {Object.entries(editionSelection).map(([key, value]) => {
            const currentEdition = allEditions.filter((e) => e.id === key)[0];
            const isClosed = ["CLOSED", "PUBLISHED"].includes(
              currentEdition.state,
            );
            return (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  opacity: isClosed ? 0.5 : 1,
                }}
              >
                <input
                  type="checkbox"
                  checked={value}
                  disabled={isClosed}
                  onChange={() =>
                    setEditionSelection({ ...editionSelection, [key]: !value })
                  }
                  style={{
                    height: "1rem",
                    width: "1rem",
                    marginRight: "1rem",
                  }}
                />
                {currentEdition?.name} {isClosed ? "(Enrollment closed)" : ""}
              </div>
            );
          })}
        </div>
        <SubmitCancelButtons submitText="Save" />
      </form>
    </Modal>
  );
}
