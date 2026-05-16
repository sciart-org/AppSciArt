import React, { useState } from "react";
import { useEffect } from "react";
import CollectionsPagination from "../../../components/CollectionsPagination";
import tokenService from "../../../utils/token.service";
import "./Collection.css";
import useFetcher from "../../../utils/useFetcher";
import AsterButton from "../../../components/buttons/AsterButton";
import FruitCard from "./components/FruitCard";
import FlowerCard from "./components/FlowerCard";
import EditionPicker from "./components/EditionPicker";
import Loading from "../../../components/messages/Loading";
import AdminCreateButton from "../../../components/buttons/AdminCreateButton";
import SeedCard from "./components/SeedCard";

export default function Collection({ itemName: itemNameRaw }) {
  const jwt = tokenService.getLocalAccessToken();
  const [error, setError] = useState(null);
  const [items, setItems] = useState(null);
  const [allEditions, setAllEditions] = useState(null);
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
        if (data.length === 0) {
          setAllEditions([]);
          return;
        }

        setAllEditions(data);

        const url = new URL(window.location.href);
        const initialEditionId = url.searchParams.get("editionId");

        if (initialEditionId) {
          setSelectedEdition(data.find((e) => e.id === initialEditionId));
          return;
        }

        setSelectedEdition(data[0]);
      },
      onError: () => {
        setAllEditions(null);
      },
    });
  }, []);

  useEffect(() => {
    if (!selectedEdition) {
      if (allEditions?.length === 0) {
        setItems([]);
      }
      return;
    }
    fetcher({
      url: `${itemName}s?editionId=${selectedEdition?.id}`,
      onSuccess: (data) => {
        setItems(data);
      },
      onError: () => {
        setItems(null);
      },
    });
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
    return <AdminCreateButton entity={itemName} />;
  };

  if (allEditions === null) {
    return (
      <>
        <Header />
        <div>
          <Loading />
        </div>
      </>
    );
  }

  if (allEditions.length === 0) {
    return (
      <>
        <Header />
        <p className="empty-search" style={{ fontWeight: "normal" }}>
          No editions yet.
        </p>
      </>
    );
  }

  if (items?.length === 0) {
    return (
      <>
        <Header />
        <CreateButton />
        <p className="empty-search" style={{ fontWeight: "normal" }}>
          No {itemName}s found.
        </p>
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
