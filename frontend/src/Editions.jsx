import React, { useState, useEffect } from "react";

export default function Editions() {
  const API_URL = import.meta.env.VITE_API_URL
  const [editions, setEditions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    year: "",
    shortDescription: "",
    longDescription: "",
    catalog: "",
    isVisible: true,
  });

  const fetchEditions = async () => {
    await fetch(`${API_URL}/editions`)
    .then((response) => response.json())
    .then((data) => setEditions(data))
    .catch((error) => console.error("Error fetching editions:", error));
  }

  useEffect(() => {
    fetchEditions()
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formData.year = Number(formData.year);
    fetch(`${API_URL}/editions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        return response.json();
      })
      .then(() => {
        fetchEditions()
        setFormData({
          name: "",
          logo: "",
          year: "",
          shortDescription: "",
          longDescription: "",
          catalog: "",
          isVisible: true,
        });
      })
      .catch((error) => console.error("Error creating edition:", error));
  };

  return (
    <div style={{ flex: 1, height: "100%" }}>
      <h2>Editions</h2>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ flex: 1 }}>
          <h3>List of Editions</h3>
          <ul>
            {editions.map((edition) => (
              <li key={edition.id}>
                <strong>{edition.name}</strong> ({edition.year})
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1, paddingRight: '10vh' }}>
          <h3>Create a New Edition</h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="logo"
              placeholder="Logo URL"
              value={formData.logo}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="year"
              placeholder="Year"
              value={formData.year}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="shortDescription"
              placeholder="Short Description"
              value={formData.shortDescription}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="longDescription"
              placeholder="Long Description"
              value={formData.longDescription}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="catalog"
              placeholder="Catalog URL"
              value={formData.catalog}
              onChange={handleInputChange}
              required
            />
            <label>
              Visible:
              <input
                type="checkbox"
                name="isVisible"
                checked={formData.isVisible}
                onChange={(e) =>
                  setFormData({ ...formData, isVisible: e.target.checked })
                }
              />
            </label>
            <button type="submit">Create Edition</button>
          </form>
        </div>
      </div>
    </div>
  );
}