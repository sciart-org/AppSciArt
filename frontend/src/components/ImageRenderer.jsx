export default function ImageRenderer({ image, style, className }) {
  return (
    <img
      src={image instanceof File ? URL.createObjectURL(image) : image}
      style={style}
      className={className}
      referrerPolicy="no-referrer"
    />
  );
}
