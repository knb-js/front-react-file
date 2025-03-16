const BASE_URL = "http://localhost:8080/api";

const API_ENDPOINTS = {
  UPLOAD_FILE: `${BASE_URL}/files/upload`,
  DOWNLOAD_FILE: (filename) => `${BASE_URL}/files/download/${filename}`,
  SEND_EMAIL: `${BASE_URL}/email/send-email`,
};

export default API_ENDPOINTS;
