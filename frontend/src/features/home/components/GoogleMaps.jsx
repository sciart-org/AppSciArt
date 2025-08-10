export default function GoogleMaps({ location }) {
  if (!location) {
    return <></>;
  }

  return (
    <div className="google-map-code">
      <iframe
        src={`https://www.google.com/maps?q=${location}&output=embed`}
        width="600"
        height="450"
        style={{ border: 0 }}
        allowFullScreen
        aria-hidden="false"
        tabIndex="0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
