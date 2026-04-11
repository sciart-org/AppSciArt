import { useEffect, useState } from "react";
import useFetcher from "../../../utils/useFetcher";
import Loading from "../../../components/messages/Loading";
import AsterButton from "../../../components/buttons/AsterButton";
import { CiEdit } from "react-icons/ci";
import "../users.css";
import InvitationModal from "./InvitationModal";
import EditScientistModal from "./EditScientistModal";
import AsterTable from "../../../components/AsterTable";

export default function Scientists() {
  const [scientists, setScientists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingScientist, setEditingScientist] = useState(null);
  const showEditModal = !!editingScientist;

  const { fetcher } = useFetcher(error, setError);

  useEffect(() => {
    fetcher({
      url: "scientists",
      onSuccess: (data) => {
        setScientists(data);
      },
    }).finally(() => setLoading(false));
  }, [showEditModal]);

  const scientistsColumns = [
    { key: "name", label: "Name", render: (s) => `${s.name} ${s.surname}` },
    { key: "email", label: "Email" },
    {
      key: "editions",
      label: "Editions",
      width: "40%",
      render: (s) => (
        <ul>
          {s.editions.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      width: "4rem",
      render: (s) => (
        <CiEdit
          size="1.5rem"
          style={{ cursor: "pointer" }}
          onClick={() => setEditingScientist(s)}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <>
        <h1>Scientists</h1>
        <Loading />
      </>
    );
  }

  return (
    <div>
      <InvitationModal
        openModal={showInviteModal}
        setOpenModal={setShowInviteModal}
      />
      <EditScientistModal
        openModal={showEditModal}
        setOpenModal={(value) => {
          if (!value) setEditingScientist(null);
        }}
        scientist={editingScientist}
      />
      <h1>Scientists</h1>
      <AsterButton
        style={{ marginBottom: "2rem" }}
        onClick={() => setShowInviteModal(true)}
      >
        Invite scientist
      </AsterButton>
      <AsterTable
        columns={scientistsColumns}
        data={scientists}
        emptyMessage="No scientists found."
      />
    </div>
  );
}
