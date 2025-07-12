import { useState } from "react";
import AsterButton from "./AsterButton";
import "./CollectionsPagination.css";

export default function CollectionsPagination({
  items,
  itemsNumber,
  containerComponent: Container,
  itemComponent: ItemComponent,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const shownItems = items.slice(currentPage * itemsNumber, currentPage * itemsNumber + itemsNumber);
  const totalPages = Math.ceil(items.length / itemsNumber);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <Container>
        {shownItems.map((item) => (
          <ItemComponent item={item} />
        ))}
      </Container>
      {totalPages > 1 && (
        <div className="pagination-controls">
          <AsterButton onClick={() => previousPage()}>{"<"}</AsterButton>
          {[...Array(totalPages).keys()].map((page) => (
            <AsterButton
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? "selected-page" : ""}
            >
              {page + 1}
            </AsterButton>
          ))}
          <AsterButton onClick={() => nextPage()}>{">"}</AsterButton>
        </div>
      )}
    </>
  );
}
