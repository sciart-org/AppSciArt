import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import useFetcher from "../../../utils/useFetcher";
import SubmitCancelButtons from "../../../components/buttons/SubmitCancelButtons";

export default function EditScientistModal({
  openModal,
  setOpenModal,
  scientist,
}) {
  const [error, setError] = useState(null);
  const [allEditions, setAllEditions] = useState([]);
  const [editionSelection, setEditionSelection] = useState({});

  const handleEditionChange = (edition, newValue) => {
    const isEnrolled = scientist?.editions?.includes(edition.name);
    let valueToAssign = undefined;
    if (isEnrolled !== newValue) {
      valueToAssign = newValue;
    }
    setEditionSelection({
      ...editionSelection,
      [edition.id]: valueToAssign,
    });
  };

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
          {Object.entries(allEditions).map(([_, edition]) => {
            const currentEdition = allEditions.filter((e) => e === edition)[0];
            const isClosed = ["CLOSED", "PUBLISHED"].includes(
              currentEdition.state,
            );
            const value =
              editionSelection[edition.id] ??
              scientist?.editions?.includes(edition.name);
            return (
              <div
                key={edition.id}
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
                  onChange={() => handleEditionChange(edition, !value)}
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
        <SubmitCancelButtons
          onCancel={() => setOpenModal(false)}
          submitText="Save"
        />
      </form>
    </Modal>
  );
}
