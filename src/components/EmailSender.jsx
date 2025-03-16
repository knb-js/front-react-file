import { useState } from "react";

const EmailSender = ({ segments }) => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSendEmail = async () => {
    if (!email || segments.length === 0) {
      alert("Por favor, ingrese un correo y genere los archivos primero.");
      return;
    }

    setSending(true);

    try {
      const formData = new FormData();
      formData.append("email", email);

      for (const segment of segments) {
        const response = await fetch(`http://localhost:8080/api/files/download/${segment}`);
        
        if (!response.ok) throw new Error(`Error al descargar el segmento: ${segment}`);

        const blob = await response.blob();
        const file = new File([blob], segment, { type: "application/pdf" });
        formData.append("files", file);
      }

      const response = await fetch("http://localhost:8080/api/email/send-email", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Correo enviado correctamente con los archivos adjuntos");
      } else {
        alert("Error al enviar el correo");
      }
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      alert("Error al enviar el correo.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Enviar Archivos por Correo</h1>

      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        className="mb-3 p-2 border rounded w-full"
        placeholder="Correo electrónico del destinatario"
      />

      <button
        onClick={handleSendEmail}
        className="bg-green-500 text-white px-4 py-2 rounded w-full"
        disabled={sending}
      >
        {sending ? "Enviando..." : "Enviar Correo"}
      </button>
    </div>
  );
};

export default EmailSender;