import { useEffect, useState } from "react";
import tokenService from "../../utils/token.service";
import ActiveHackathon from "./ActiveHackathon";
import Loading from "../../components/messages/Loading";
import { useNavigate, useParams } from "react-router";
import useFetcher from "../../utils/useFetcher";
import HackathonEdit from "./HackathonEdit";
import HackathonManagement from "./HackathonManagement";
import { HackathonContext } from "./components/HackathonContext";

export default function HackathonRouter() {
  const isAdmin = tokenService.getIsAdmin();

  const [loading, setLoading] = useState(true);
  const [hackathon, setHackathon] = useState(null);
  const [participation, setParticipation] = useState(null);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  const { fetcher } = useFetcher(error, setError);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    fetcher({
      url: `hackathons/${params.hackathonId}`,
      onSuccess: (data) => {
        if (!isAdmin && !data.isEnrolled) {
          navigate(`/unauthorized`);
        }
        setHackathon(data);
      },
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      fetcher({
        url: `hackathons/${params.hackathonId}/participants/me`,
        onSuccess: (data) => {
          setParticipation(data);
        },
      });
    }
  }, [isAdmin]);

  if (loading) {
    return <Loading />;
  }

  if (!hackathon) {
    return <h2>No hackathon found.</h2>;
  }

  if (hackathon.state === "FINISHED") {
    return <h2>This hackathon has finished. Thanks for coming!</h2>;
  }

  if (!isAdmin) {
    return (
      <HackathonContext
        value={{ hackathon, setHackathon, participation, socket, setSocket }}
      >
        <ActiveHackathon />
      </HackathonContext>
    );
  }

  const handleNextPhase = () => {
    fetcher({
      url: `hackathons/${hackathon.id}/next-phase?broadcast=true`,
      method: "POST",
      onSuccess: (updatedHackathon) => {
        setHackathon(updatedHackathon);
      },
    });
  };

  if (hackathon.state === "CLOSED") {
    return (
      <HackathonContext
        value={{ hackathon, setHackathon, socket, setSocket, handleNextPhase }}
      >
        <HackathonManagement />
      </HackathonContext>
    );
  }

  return <HackathonEdit hackathon={hackathon} />;
}
