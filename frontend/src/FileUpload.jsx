import { useState, useEffect } from "react";

export default function FileUpload({
    file,
    setFile,
    isButtonClicked,
    setIsButtonClicked,
}) {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0];
            if (selectedFile.type === "application/pdf") {
                setFile(selectedFile);
            } else {
                alert("Please upload a valid PDF file.");
            }
        }
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
        } else {
            alert("Please upload a valid PDF file.");
            setFile(null);
        }
    };

    const handleUpload = () => {
        if (file) {
            setIsButtonClicked(1);
            console.log("File uploaded:", file);
            // alert(`Uploaded: ${file.name}`); // Removed alert for cleaner UX
        } else {
            alert("No file selected!");
        }
    };

    return (
        <div className="flex items-center gap-3 w-full">
            <div
                className={`relative flex-1 flex items-center justify-center h-12 rounded-lg border border-dashed transition-all duration-200 ease-in-out
                    ${dragActive ? "border-[#C5A059] bg-[#C5A059]/5" : "border-gray-300 bg-gray-50 hover:border-[#C5A059] hover:bg-white"}
                    ${file ? "border-[#C5A059] bg-[#C5A059]/5" : ""}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <label className="w-full h-full flex items-center justify-center cursor-pointer">
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600 px-4 truncate">
                        {file ? (
                            <>
                                <span className="text-[#C5A059] font-bold">✓</span>
                                <span className="truncate max-w-[150px] text-black">{file.name}</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span>Upload PDF</span>
                            </>
                        )}
                    </div>
                </label>
            </div>

            <button
                onClick={handleUpload}
                disabled={!file}
                className={`h-12 px-6 rounded-lg font-bold text-sm transition-all duration-200 shadow-sm
                    ${file
                        ? "bg-[#C5A059] text-white hover:bg-[#b08d4b] hover:shadow-md active:transform active:scale-95"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"}
                `}
            >
                Analyze
            </button>
        </div>
    );
}
