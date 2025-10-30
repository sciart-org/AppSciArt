import React, { useState } from "react";
import { useEffect } from "react";
import CollectionsPagination from "../../../components/CollectionsPagination";
import tokenService from "../../../utils/token.service";
import "./css/collections.css";
import useFetcher from "../../../utils/useFetcher";
import AsterButton from "../../../components/AsterButton";
import FruitCard from "./components/FruitCard";
import FlowerCard from "./components/FlowerCard";
import SeedCard from "./components/SeedCard";
import EditionPicker from "./components/EditionPicker";
import Loading from "../../../components/messages/Loading";

export default function Collection({ itemName: itemNameRaw }) {
  const jwt = tokenService.getLocalAccessToken();
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [allEditions, setAllEditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEdition, setSelectedEdition] = useState(null);

  const itemName = itemNameRaw.toLowerCase();

  const ItemCard =
    itemName === "seed"
      ? SeedCard
      : itemName === "flower"
      ? FlowerCard
      : FruitCard;

  const { fetcher } = useFetcher(error, setError);

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

  useEffect(() => {
    setLoading(true);
    if (!selectedEdition) {
      setItems([]);
      return;
    }
    fetcher({
      url: `${itemName}s?editionId=${selectedEdition?.id}`,
      onSuccess: (data) => {
        setItems(data);
        console.log(data);
      },
      onError: () => {
        setItems([]);
      },
    }).finally(() => setLoading(false));
  }, [selectedEdition, itemName]);

  const Header = () => {
    return (
      <div className="collection-header-container">
        <div className="collection-header">
          <h1>
            {itemName.charAt(0).toUpperCase() + itemName.slice(1)} Collection:
          </h1>
          <EditionPicker
            selectedEdition={selectedEdition}
            setSelectedEdition={setSelectedEdition}
            allEditions={allEditions}
          />
        </div>
        {!jwt && (
          <>
            <h2>You are not logged in! Want to get the full experience?</h2>
            <AsterButton
              to={"/signin"}
              style={{ margin: "2rem", marginTop: "1rem" }}
            >
              Log in
            </AsterButton>
          </>
        )}
      </div>
    );
  };

  const CreateButton = () => {
    if (selectedEdition?.state === "PUBLISHED") return <></>;
    return (
      <AsterButton
        style={{ marginBottom: "2rem" }}
        to={`create?editionId=${selectedEdition?.id}`}
      >
        Create {itemName}
      </AsterButton>
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <CreateButton />
        <h2 style={{ fontWeight: "normal" }}>
          No {itemName}s for this edition yet
        </h2>
      </>
    );
  }

  return (
    <div>
      <Header />
      <CreateButton />
      <CollectionsPagination
        items={items || []}
        itemsNumber={6}
        containerComponent={({ children }) => (
          <div className="collection-grid">{children}</div>
        )}
        itemComponent={ItemCard}
      />
    </div>
  );
}
