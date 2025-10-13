import { RiStarSLine, RiStarSFill, RiStarHalfSFill } from "react-icons/ri";
import "./StarRating.css";
import { useEffect, useState } from "react";

const StarWrapper = ({ children, starRating, setSelectedRating }) => {
  return (
    <div>
      <div className="star-container">
        <div
          className="left-selector"
          onClick={() => setSelectedRating(starRating - 0.5)}
        />
        <div
          className="right-selector"
          onClick={() => setSelectedRating(starRating)}
        />
        {children}
      </div>
    </div>
  );
};

export default function StarRating({ onChange }) {
  const [selectedRating, setSelectedRating] = useState(0.5);

  useEffect(() => {
    if (!onChange) return;
    onChange(selectedRating);
  }, [selectedRating]);

  return (
    <div className="rating-container">
      {[1, 2, 3, 4, 5].map((s) => {
        return (
          <StarWrapper starRating={s} setSelectedRating={setSelectedRating}>
            {selectedRating >= s ? (
              <RiStarSFill className="star" />
            ) : selectedRating >= s - 0.5 ? (
              <RiStarHalfSFill className="star" />
            ) : (
              <RiStarSLine className="star" />
            )}
          </StarWrapper>
        );
      })}
    </div>
  );
}
