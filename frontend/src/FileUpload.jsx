import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8000/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Upload failed.");
      console.error(err);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>
    </div>
  );
}

export default FileUpload;