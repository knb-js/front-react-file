export default function SegmentList({ segments }) {
  if (segments.length === 0) return null;

  const handleDownload = async (segment) => {
    try {
      const response = await fetch(`http://localhost:8080/api/files/download/${segment}`);

      if (!response.ok) {
        throw new Error("Error al descargar el archivo");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = segment; // Nombre del archivo
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error en la descarga:", error);
      alert("Error al descargar el archivo.");
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-lg font-bold">Segmentos Generados</h2>
      <ul className="mt-2">
        {segments.map((segment, index) => (
          <li key={index} className="mt-1">
            <button
              onClick={() => handleDownload(segment)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Descargar {segment}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
