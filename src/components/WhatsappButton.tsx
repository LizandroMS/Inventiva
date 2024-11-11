import React from "react";
import { FaWhatsapp } from "react-icons/fa";

interface WhatsappButtonProps {
  phoneNumber: string;
  message?: string;
}

const WhatsappButton: React.FC<WhatsappButtonProps> = ({ phoneNumber, message = "" }) => {
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition"
      aria-label="Contactar por WhatsApp"
    >
      <FaWhatsapp size={24} />
    </a>
  );
};

export default WhatsappButton;
