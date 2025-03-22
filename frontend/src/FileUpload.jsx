import { useState, useEffect } from "react";

export default function FileUpload() {
    const [file, setFile] = useState(null);

	useEffect(() => {
		if (file != null){
			fetch("http://localhost:3000/", 
				{
					method: "POST",
					body: JSON.stringify({file: file})
				}
			)
            .then((response) => console.log(response))
            .catch((error) => console.error(error));
		}
	}, [file])

    // Handle file selection
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
        } else {
            alert("Please upload a valid PDF file.");
            setFile(null);
        }
    };

    // Handle file upload (example: console logging)
    const handleUpload = () => {
        if (file) {
            console.log("File uploaded:", file);
            alert(`Uploaded: ${file.name}`);
			
        } else {
            alert("No file selected!");
        }
    };

    return (
        <div className="file-upload-box">
            <label className="file-input-label">
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                />
                <div className="upload-box">📄 Click or Drag to Upload PDF</div>
            </label>

            {file && <p>Selected File: {file.name}</p>}

            <button onClick={handleUpload} className="upload-button">
                Upload
            </button>
        </div>
    );
}
