import React, { useState } from "react";
import { useEffect } from "react";
import useFetcher from "../../utils/useFetcher";

export default function SeedCollection() {
  const [error, setError] = useState(null);
  const { fetcher } = useFetcher(error, setError);
  const mockEditionId = "9a1b5c10-1c11-4a4f-a25e-aaa111000100";

  useEffect(() => {
    fetcher({
      url: `seeds?editionId=${mockEditionId}`,
      onSuccess: (data) => {
        console.log(data);
      },
    });
  }, []);

  return (
    <div>
      <h1>Seed Collection</h1>
      <p>This is a placeholder for the Seed Collection component.</p>
    </div>
  );
}
