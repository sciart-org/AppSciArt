export default function ImageRenderer({ image, style }) {
  return (
    <img
      src={image instanceof File ? URL.createObjectURL(image) : image}
      style={style}
      referrerPolicy="no-referrer"
    />
  );
}
