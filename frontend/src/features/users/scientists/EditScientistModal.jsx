import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import useFetcher from "../../../utils/useFetcher";
import AsterButton from "../../../components/AsterButton";

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
    allEditions.map((e) => {
      const isIncluded = scientist?.editions
        ?.map((e) => e.name)
        .includes(e.name);
      initialSelectedEditions[e.name] = isIncluded;
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

  const handleSubmit = () => {
    e.preventDefault();
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
          width: "80%",
          margin: "auto",
          marginTop: "1rem",
        }}
      >
        <div style={{ textAlign: "start" }}>
          {Object.entries(editionSelection).map(([key, value]) => (
            <div key={key} style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={value}
                onChange={() =>
                  setEditionSelection({ ...editionSelection, [key]: !value })
                }
                style={{ height: "1rem", width: "1rem", marginRight: "1rem" }}
              />
              {key}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "2rem" }}>
          <AsterButton type="submit" style={{ marginTop: "1rem" }}>
            Save
          </AsterButton>
          <AsterButton
            style={{ marginTop: "1rem" }}
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </AsterButton>
        </div>
      </form>
    </Modal>
  );
}
