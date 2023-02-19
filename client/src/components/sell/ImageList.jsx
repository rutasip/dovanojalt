/* eslint-disable no-param-reassign */
import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Image } from "react-bootstrap";

const type = "Image";

function ImageItem({ image, index, moveImage, onDelete }) {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: type,
    hover(item) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveImage(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type, id: image.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0 : 1 }}
      className="file-item delete-image-div"
    >
      <div className="delete-image-overlay">
        <button
          type="button"
          aria-label="Close"
          onClick={() => {
            onDelete(index);
          }}
        >
          <span
            aria-hidden="true"
            style={{
              fontSize: "1.5em",
              color: "red",
              textShadow: "none",
            }}
          >
            &times;
          </span>
        </button>
      </div>

      <Image
        alt={`img - ${image.id}`}
        src={image.src}
        className="file-img"
        style={{ position: "relative", display: "inline-block" }}
      />
    </div>
  );
}

function ImageList({ images, moveImage, onDelete }) {
  const renderImage = (image, index) => (
    <ImageItem
      image={image}
      index={index}
      key={`${image.id}-image`}
      moveImage={moveImage}
      onDelete={onDelete}
    />
  );
  return <section className="file-list">{images.map(renderImage)}</section>;
}

export default ImageList;
