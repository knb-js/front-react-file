import { useState } from "react";

const FileUpload = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [segmentSize, setSegmentSize] = useState(50000);
  const [processing, setProcessing] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSegmentSizeChange = (event) => {
    setSegmentSize(event.target.value);
  };

  const handleUpload = async () => {
    if (!file || segmentSize <= 0) return;

    setProcessing(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("segmentSize", segmentSize);

    try {
      const response = await fetch("http://localhost:8080/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const segmentNames = await response.json();
        onUploadComplete(segmentNames); // Guarda los segmentos en el estado
      } else {
        console.error("Error al subir archivo");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Dividir Archivo</h1>

      <input
        type="file"
        onChange={handleFileChange}
        className="mb-3 p-2 border rounded w-full"
      />

      <input
        type="number"
        value={segmentSize}
        onChange={handleSegmentSizeChange}
        className="mb-3 p-2 border rounded w-full"
        placeholder="Tamaño del segmento en bytes"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        disabled={processing}
      >
        {processing ? "Procesando..." : "Subir y Dividir"}
      </button>
    </div>
  );
};

export default FileUpload;
