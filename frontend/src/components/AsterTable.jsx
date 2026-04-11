import "./AsterTable.css";

export default function AsterTable({
  columns,
  data,
  emptyMessage = "No data found.",
}) {
  if (data.length === 0) return <p className="table-empty">{emptyMessage}</p>;

  return (
    <table className="aster-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} style={{ width: col.width }}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={row.id ?? i}>
            {columns.map((col) => (
              <td key={col.key} style={{ width: col.width }}>
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
