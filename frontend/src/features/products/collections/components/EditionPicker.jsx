import FormSelect from "../../../../components/form/FormSelect";

export default function EditionPicker({
  selectedEdition,
  setSelectedEdition,
  allEditions,
  style,
  size,
}) {
  const selectedEditionName = selectedEdition?.name;
  const allEditionNames = allEditions.map((e) => e.name);

  const setSelectedEditionByName = (name) => {
    const edition = allEditions.find((e) => e.name === name);
    if (edition) {
      setSelectedEdition(edition);
      const url = new URL(window.location);
      url.searchParams.set("editionId", edition.id);
      window.history.replaceState({}, "", url);
    } else {
      setSelectedEdition(null);
    }
  };

  return (
    <FormSelect
      name={""}
      value={selectedEditionName}
      setValue={setSelectedEditionByName}
      options={allEditionNames}
      clearable={false}
      className={size === "small" ? "" : "edition-picker"}
      style={style}
    />
  );
}
