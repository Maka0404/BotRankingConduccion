const TablaRanking = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No hay datos disponibles.</p>;
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ccc",
        }}
      >
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th
                key={key}
                style={{
                  borderBottom: "2px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                  backgroundColor: "#f5f5f5",
                }}
              >
                {key.replace(/_/g, " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, i) => (
                <td
                  key={i}
                  style={{
                    padding: "8px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaRanking;
