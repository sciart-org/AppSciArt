export default function Loading({ style }) {
  return (
    <div
      style={{
        height: "100%",
        alignContent: "center",
        textAlign: "center",
        ...style,
      }}
    >
      <p>Loading...</p>
    </div>
  );
}
