import { useNavigate, useParams } from "react-router";
import useFetcher from "../../../utils/useFetcher";
import { useState } from "react";
import FormInput from "../../../components/form/FormInput";
import AsterButton from "../../../components/AsterButton";
import { MdDelete } from "react-icons/md";
import EditionPicker from "../collections/components/EditionPicker";
import { useEffect } from "react";
import "./creators.css";
import ScientistEmailForm from "../components/ScientistEmailForm";
import SubmitCancelButtons from "../../../components/SubmitCancelButtons";

export default function SeedCreator() {
  const [error, setError] = useState(null);
  const [selectedEdition, setSelectedEdition] = useState(null);
  const [allEditions, setAllEditions] = useState([]);

  const { fetcher } = useFetcher(error, setError);
  const navigate = useNavigate();

  useEffect(() => {
    fetcher({
      url: "editions",
      onSuccess: (data) => {
        setAllEditions(data);

        const url = new URL(window.location.href);
        const initialEditionId = url.searchParams.get("editionId");

        if (!data.length > 0) {
          return;
        }

        if (initialEditionId) {
          setSelectedEdition(data.find((e) => e.id === initialEditionId));
          return;
        }

        setSelectedEdition(data[0]);
      },
      onError: () => {
        setAllEditions([]);
      },
    });
  }, []);

  const params = useParams();
  const editionId = params.editionId;

  const [submissionBody, setSubmissionBody] = useState({
    title: "",
    addingEmail: "",
    editionId: editionId,
    scientistsToInvite: [],
    template: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetcher({
      url: "seeds",
      method: "POST",
      body: {
        title: submissionBody.title ? submissionBody.title : null,
        editionId: selectedEdition ? selectedEdition.id : editionId,
        template: submissionBody.template ? submissionBody.template : null,
        scientistsToInvite: submissionBody.scientistsToInvite,
      },
      onSuccess: (data) => {
        navigate(`/seeds/${data.id}`);
      },
    });
  };

  return (
    <div>
      <h1>Create Seed</h1>
      <form onSubmit={handleSubmit} className="seed-creation-form">
        <div className="seed-create">
          <div>
            <h3>Seed details:</h3>
            <FormInput
              name={"Title"}
              placeholder={"Seed title..."}
              value={submissionBody.title}
              onChange={(e) => handleChange("title", e)}
            />
            <FormInput
              name={"Google docs link"}
              placeholder={"Paste your link here"}
              required={true}
              value={submissionBody.template}
              onChange={(e) => handleChange("template", e)}
            />
            <text style={{ textAlign: "start" }}>Edition</text>
            <EditionPicker
              selectedEdition={selectedEdition}
              setSelectedEdition={setSelectedEdition}
              allEditions={allEditions}
              size={"small"}
            />
          </div>
          <div className="scientists-section">
            <h3>Scientists to invite:</h3>
            <div>
              {submissionBody.scientistsToInvite.length === 0 && (
                <p>No scientists added yet</p>
              )}
              {submissionBody.scientistsToInvite.map((scientist) => (
                <div key={scientist} className="scientists-item">
                  <span>{scientist}</span>
                  <MdDelete
                    size={"1.5rem"}
                    style={{
                      cursor: "pointer",
                      marginLeft: "0.5rem",
                    }}
                    onClick={() => {
                      setSubmissionBody({
                        ...submissionBody,
                        scientistsToInvite:
                          submissionBody.scientistsToInvite.filter(
                            (s) => s != scientist,
                          ),
                      });
                    }}
                  />
                </div>
              ))}
            </div>
            <ScientistEmailForm
              submissionBody={submissionBody}
              setSubmissionBody={setSubmissionBody}
            />
          </div>
        </div>
        <SubmitCancelButtons />
      </form>
    </div>
  );
}
