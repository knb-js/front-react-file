import API_ENDPOINTS from "../services/api";

export default function SegmentList({ segments }) {
  if (segments.length === 0) return null;

  const handleDownload = async (segment) => {
    try {
      const response = await fetch(API_ENDPOINTS.DOWNLOAD_FILE(segment));

      if (!response.ok) {
        throw new Error("Error al descargar el archivo");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = segment;
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
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg w-full max-w-lg text-white">
      <h2 className="text-2xl font-bold text-center mb-4">📄 Segmentos Generados</h2>
      <ul className="space-y-2">
        {segments.map((segment, index) => (
          <li key={index} className="flex justify-between items-center bg-white text-indigo-600 p-3 rounded-lg shadow">
            <span className="font-semibold truncate w-4/5">{segment}</span>
            <button
              onClick={() => handleDownload(segment)}
              className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-lg font-bold transition duration-300 hover:bg-yellow-500"
            >
              ⬇ Descargar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}