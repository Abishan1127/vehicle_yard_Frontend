import { useState } from "react";

export default function ImageGallery({ images = [], height = 320 }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  if (!images.length) return <div className="text-muted">No images</div>;

  const mainImage = images[selectedIdx];
  const visibleCount = 3;
  const canScrollLeft = scrollStart > 0;
  const canScrollRight = scrollStart + visibleCount < images.length;

  function scrollLeft() {
    if (canScrollLeft) setScrollStart(Math.max(0, scrollStart - 1));
  }

  function scrollRight() {
    if (canScrollRight) setScrollStart(Math.min(scrollStart + 1, images.length - visibleCount));
  }

  return (
    <div>
      <div className="mb-3">
        <img
          src={mainImage}
          alt="Main view"
          className="img-fluid rounded shadow-sm"
          style={{ width: "100%", height: height, objectFit: "cover" }}
        />
      </div>

      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={scrollLeft}
          disabled={!canScrollLeft}
        >
          ← 
        </button>

        <div className="d-flex gap-2" style={{ overflowX: "hidden", flex: 1 }}>
          {images.slice(scrollStart, scrollStart + visibleCount).map((src, relIdx) => {
            const actualIdx = scrollStart + relIdx;
            const isSelected = actualIdx === selectedIdx;
            return (
              <img
                key={actualIdx}
                src={src}
                alt={`Thumbnail ${actualIdx + 1}`}
                onClick={() => setSelectedIdx(actualIdx)}
                className={`rounded cursor-pointer flex-shrink-0 ${isSelected ? "border border-primary border-3" : ""}`}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  cursor: "pointer",
                  opacity: isSelected ? 1 : 0.7,
                }}
              />
            );
          })}
        </div>

        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={scrollRight}
          disabled={!canScrollRight}
        >
          →
        </button>
      </div>
    </div>
  );
}
