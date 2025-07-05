import { useEffect, useState } from "react";
import FormSelect from "../../../components/form/FormSelect";
import useFetcher from "../../../utils/useFetcher";

export default function EditionPicker({
  selectedEdition,
  setSelectedEdition,
  allEditions,
}) {
  const selectedEditionName = selectedEdition?.name;
  const allEditionNames = allEditions.map((e) => e.name);

  const setSelectedEditionByName = (name) => {
    const edition = allEditions.find((e) => e.name === name);
    if (edition) {
      setSelectedEdition(edition);
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
      className={"edition-picker"}
    />
  );
}
