import { useState } from "react";
import Swal from "sweetalert2";
import API_ENDPOINTS from "../services/api";

const FileUpload = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [segmentSize, setSegmentSize] = useState(80000);
  const [processing, setProcessing] = useState(false);
  const [uploadDisabled, setUploadDisabled] = useState(false);

  const handleFileChange = (event) => {
    if (processing || uploadDisabled) {
      Swal.fire({
        icon: "warning",
        title: "Proceso en curso",
        text: "Debe terminar el proceso para poder ingresar otro archivo.",
      });
      return;
    }
    setFile(event.target.files[0]);
  };

  const handleSegmentSizeChange = (event) => {
    if (!processing && !uploadDisabled) {
      setSegmentSize(event.target.value);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "Archivo no seleccionado",
        text: "Por favor, seleccione un archivo antes de continuar.",
      });
      return;
    }

    if (segmentSize <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Tamaño de segmento inválido",
        text: "El tamaño del segmento debe ser mayor a 0.",
      });
      return;
    }

    setProcessing(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("segmentSize", segmentSize);

    try {
      const response = await fetch(API_ENDPOINTS.UPLOAD_FILE, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const segmentNames = await response.json();
        onUploadComplete(segmentNames);
        setTimeout(() => {
          Swal.fire({
            icon: "success",
            title: "Archivo Dividido",
            text: "El archivo se ha dividido correctamente.",
          });
          setUploadDisabled(true);
        }, 1000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al subir el archivo.",
        });
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      Swal.fire({
        icon: "error",
        title: "Error de red",
        text: "No se pudo conectar con el servidor.",
      });
    } finally {
      setTimeout(() => {
        setProcessing(false);
      }, 1000);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-xl shadow-lg w-full max-w-lg text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Dividir Archivo</h1>

      <input
        type="file"
        id="fileInput"
        onChange={handleFileChange}
        className="hidden"
        disabled={processing || uploadDisabled}
      />
      <label
        htmlFor="fileInput"
        className={`cursor-pointer px-4 py-2 rounded-lg w-full text-center block font-semibold transition duration-300 ${
          processing || uploadDisabled
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "bg-white text-indigo-600 hover:bg-indigo-100"
        }`}
        onClick={() => {
          if (processing || uploadDisabled) {
            Swal.fire({
              icon: "warning",
              title: "Proceso en curso",
              text: "Debe terminar el proceso para poder ingresar otro archivo.",
            });
          }
        }}
      >
        {file ? file.name : "Seleccionar Archivo 📂"}
      </label>

      <div className="mt-4 relative">
        <label htmlFor="segmentSize" className="block text-sm font-medium text-white mb-1">
          Tamaño del Segmento (bytes)
        </label>
        <div className="relative">
          <input
            id="segmentSize"
            type="number"
            value={segmentSize}
            onChange={handleSegmentSizeChange}
            className="w-full p-3 rounded-lg border border-white bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-300 disabled:text-gray-600"
            placeholder="Ej: 80000"
            disabled={processing || uploadDisabled}
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            bytes
          </span>
        </div>
      </div>

      <button
        onClick={() => {
          if (processing || uploadDisabled) {
            Swal.fire({
              icon: "warning",
              title: "Proceso en curso",
              text: "Debe terminar el proceso para poder ingresar otro archivo.",
            });
            return;
          }
          handleUpload();
        }}
        className={`px-4 py-2 rounded-lg w-full mt-4 font-bold transition duration-300 ${
          processing || uploadDisabled
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
        }`}
        disabled={processing || uploadDisabled}
      >
        {processing ? "⏳ Procesando Archivo..." : "🚀 Subir y Dividir"}
      </button>
    </div>
  );
};

export default FileUpload;