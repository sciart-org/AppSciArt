import { RiStarSLine, RiStarSFill, RiStarHalfSFill } from "react-icons/ri";
import "./StarRating.css";
import { useEffect, useState } from "react";

const StarWrapper = ({
  children,
  starRating,
  setSelectedRating,
  modifiable,
}) => {
  return (
    <div>
      <div className="star-container">
        <div
          className="left-selector"
          style={modifiable ? {} : { cursor: "default" }}
          onClick={() => {
            if (!modifiable) return;
            setSelectedRating(starRating - 0.5);
          }}
        />
        <div
          className="right-selector"
          style={modifiable ? {} : { cursor: "default" }}
          onClick={() => {
            if (!modifiable) return;
            setSelectedRating(starRating);
          }}
        />
        {children}
      </div>
    </div>
  );
};

export default function StarRating({
  onChange = () => {},
  initialRating = 0.5,
  style,
  modifiable = true,
}) {
  const [selectedRating, setSelectedRating] = useState(initialRating);

  useEffect(() => {
    if (!onChange) return;
    onChange(selectedRating);
  }, [selectedRating]);

  return (
    <div className="rating-container" style={style}>
      {[1, 2, 3, 4, 5].map((s) => {
        return (
          <StarWrapper
            starRating={s}
            setSelectedRating={setSelectedRating}
            modifiable={modifiable}
          >
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
