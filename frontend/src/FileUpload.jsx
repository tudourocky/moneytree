import { useState, useEffect } from "react";

export default function FileUpload() {
    const [file, setFile] = useState(null);
    const [isButtonClicked, setIsButtonClicked] = useState(0);

    useEffect(() => {
        if (isButtonClicked) {
            if (file == null) {
                alert("file not uploaded!");
            } else {
const formData = new FormData();
                formData.append('file', file);
                fetch("http://localhost:8000/getdatafromfile", {
                    method: "POST",
                    body: formData,
                })
                    .then((response) => 
response.json()
)
.then((data) => {
console.log(data)
})
                    .catch((error) => console.error(error));
            }
        }
    }, [isButtonClicked, file]);

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
            setIsButtonClicked(1);
            console.log("File uploaded:", file);
            alert(`Uploaded: ${file.name}`);
        } else {
            alert("No file selected!");
        }
    };

    return (
        <div className="">
            <label className="">
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