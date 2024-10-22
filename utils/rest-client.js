import { server_domain } from "@/constants";
import axios from "axios";
import Swal from "sweetalert2";

export async function httpPost(url, body, config = {}) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  console.log(`[${url}] method: POST`);
  console.log(`[${url}] config: ${JSON.stringify(config)}`);
  console.log(`[${url}] body: ${JSON.stringify(body)}`);
  console.log(`[${url}] headers: ${JSON.stringify(headers)}`);
  const res = await axios.post(`${server_domain}${url}`, body, {
    headers,
    ...config,
  });
  console.log(`[${url}] response: ${JSON.stringify(res.data)}`);
  return res;
}

export async function httpPut(url, body, config = {}) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  console.log(`[${url}] method: PUT`);
  console.log(`[${url}] config: ${JSON.stringify(config)}`);
  console.log(`[${url}] body: ${JSON.stringify(body)}`);
  console.log(`[${url}] headers: ${JSON.stringify(headers)}`);
  const res = await axios.put(`${server_domain}${url}`, body, {
    headers,
    ...config,
  });
  console.log(`[${url}] response: ${JSON.stringify(res.data)}`);
  return res;
}

export async function httpPatch(url, body, config = {}) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  console.log(`[${url}] method: PATCH`);
  console.log(`[${url}] config: ${JSON.stringify(config)}`);
  console.log(`[${url}] body: ${JSON.stringify(body)}`);
  console.log(`[${url}] headers: ${JSON.stringify(headers)}`);
  const res = await axios.patch(`${server_domain}${url}`, body, {
    headers,
    ...config,
  });
  console.log(`[${url}] response: ${JSON.stringify(res.data)}`);
  return res;
}

export async function httpGet(url, config = {}) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  console.log(`[${url}] method: GET`);
  console.log(`[${url}] config: ${JSON.stringify(config)}`);
  console.log(`[${url}] headers: ${JSON.stringify(headers)}`);
  const res = await axios.get(`${server_domain}${url}`, {
    headers,
    ...config,
  });
  console.log(`[${url}] response: ${JSON.stringify(res.data)}`);
  return res;
}

export async function httpDelete(url, config = {}) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  console.log(`[${url}] method: DELETE`);
  console.log(`[${url}] config: ${JSON.stringify(config)}`);
  console.log(`[${url}] headers: ${JSON.stringify(headers)}`);
  const res = await axios.delete(`${server_domain}${url}`, {
    headers,
    ...config,
  });
  console.log(`[${url}] response: ${JSON.stringify(res.data)}`);
  return res;
}

export const handleError = (err, router) => {
  console.log(err);
  if (err.response && err.response.data && err.response.data.message) {
    const message = err.response.data.message.toLowerCase();
    if (
      message == "invalid token" ||
      message == "invalid authorization header format"
    ) {
      localStorage.setItem("token", "");
      router.push("/login");
      Swal.fire({
        title: "Session Expired",
        text: "Your session has ended due to inactivity. For your security, we've logged you out. Please log in again to continue.",
        showConfirmButton: false,
        timer: 5000,
      });
    } else {
      Swal.fire({
        icon: "error",
        text: err.response.data.message,
        showConfirmButton: false,
        timer: 5000,
      });
    }
  } else {
    Swal.fire({
      icon: "error",
      text: err.message,
      showConfirmButton: false,
      timer: 5000,
    });
  }
};

export const uploadFile = async (url, file) => {
  // Create a new FormData object
  const formData = new FormData();

  // Append the file to the FormData object
  formData.append("file", file);

  // Additional fields can be appended if needed
  // formData.append('fieldName', 'fieldValue');

  // Make the request
  const res = await axios.post(`${server_domain}${url}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(`[${url}] response: ${JSON.stringify(res.data)}`);
  return res;
};

// Usage example (assuming you have an input element with the id "fileInput")
// document.getElementById('fileInput').addEventListener('change', (event) => {
//   const file = event.target.files[0];
//   if (file) {
//     uploadFile(file);
//   }
// });
