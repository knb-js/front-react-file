import { useState } from "react";
import FileUpload from "./components/FileUpload";
import SegmentList from "./components/SegmentList";
import EmailSender from "./components/EmailSender";

export default function App() {
  const [segments, setSegments] = useState([]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6 text-white">
      {/* TÍTULO PRINCIPAL */}
      <div className="text-center mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold text-white">
          📂 Divisor de Archivos Inteligente
        </h1>
        <p className="text-lg text-gray-200 mt-2">
          Sube tu archivo y divídelo en segmentos fácilmente.
        </p>
      </div>

      {/* COMPONENTES */}
      <FileUpload onUploadComplete={setSegments} />
      <div className="mt-6 w-full max-w-lg">
        <SegmentList segments={segments} />
      </div>
      <div className="mt-6 w-full max-w-lg">
        <EmailSender segments={segments} />
      </div>
    </div>
  );
}
