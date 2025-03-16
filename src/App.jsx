import { useState } from "react";
import FileUpload from "./components/FileUpload";
import SegmentList from "./components/SegmentList";
import EmailSender from "./components/EmailSender";

export default function App() {
  const [segments, setSegments] = useState([]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <FileUpload onUploadComplete={setSegments} />
      <SegmentList segments={segments} />
      <EmailSender segments={segments} />
    </div>
  );
}
