import { useState } from "react";
import Swal from "sweetalert2";
import API_ENDPOINTS from "../services/api";

const EmailSender = ({ segments }) => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSendEmail = async () => {
    if (!email || segments.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "Por favor, ingrese un correo y genere los archivos primero.",
      });
      return;
    }

    setSending(true);

    try {
      const formData = new FormData();
      formData.append("email", email);

      for (const segment of segments) {
        const response = await fetch(API_ENDPOINTS.DOWNLOAD_FILE(segment));
      
        if (!response.ok) throw new Error(`Error al descargar el segmento: ${segment}`);
      
        const blob = await response.blob();
        const file = new File([blob], segment, { type: "application/pdf" });
        formData.append("files", file);
      }
      
      const response = await fetch(API_ENDPOINTS.SEND_EMAIL, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Correo enviado correctamente con los archivos adjuntos.",
        }).then(() => {
          setFadeOut(true);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al enviar el correo.",
        });
      }
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo enviar el correo.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-xl shadow-lg w-full max-w-lg text-white transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
      <h1 className="text-2xl font-bold mb-4 text-center">📧 Enviar Archivos por Correo</h1>
      <div className="mt-4 relative">
        <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
          Correo Electrónico
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          className="w-full p-3 rounded-lg border border-white bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Ej: usuario@email.com"
        />
      </div>
      <button
        onClick={handleSendEmail}
        className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg w-full mt-4 font-bold transition duration-300 hover:bg-yellow-500"
        disabled={sending}
      >
        {sending ? "📤 Enviando..." : "📨 Enviar Correo"}
      </button>
    </div>
  );
};

export default EmailSender;