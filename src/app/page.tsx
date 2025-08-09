"use client";

import { useState, ChangeEvent, DragEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next"; // Vercel Analytics import

export default function Home() {
  // Application states
  const [text, setText] = useState<string>(""); // Extracted text
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [fileName, setFileName] = useState<string>(""); // Uploaded file name
  const [previewUrl, setPreviewUrl] = useState<string>(""); // Image preview URL
  const [progress, setProgress] = useState<number>(0); // Progress bar value

  /**
   * Handle the OCR extraction process
   */
  const handleExtract = async () => {
    const fileInput = document.getElementById("imageInput") as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) {
      toast.error("Please select an image before extracting text");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    setText("");
    setProgress(0);

    // Simulated progress bar increment while waiting for response
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 300);

    try {
      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("OCR API request failed");

      const data = await res.json();
      if (data.text) {
        setText(data.text);
        setProgress(100);
        toast.success("Text extracted successfully");
      } else {
        toast.error("No text found in the image");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error extracting text. Please try again.");
    } finally {
      clearInterval(interval);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 800);
    }
  };

  /**
   * Handle file selection from input or drag-and-drop
   */
  const handleFileChange = (file?: File) => {
    if (file) {
      setFileName(file.name);
      setPreviewUrl(URL.createObjectURL(file));

      // Set file into the hidden input so it can be read by handleExtract
      const fileInput = document.getElementById("imageInput") as HTMLInputElement;
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInput.files = dt.files;
    } else {
      setPreviewUrl("");
      setFileName("");
    }
  };

  /**
   * Handle file drop event
   */
  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  /**
   * Prevent default behavior to allow dropping
   */
  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Toast container for notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Gemini OCR Tool
        </h1>
        <p className="text-gray-600 mb-6">
          Upload an image and extract text instantly using Google Gemini 1.5.
        </p>

        {/* File upload with drag-and-drop support */}
        <label
          htmlFor="imageInput"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-blue-500 transition"
        >
          {fileName || "Click or drag an image here"}
        </label>
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0])}
        />

        {/* Image preview */}
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="mt-4 max-h-64 w-full object-contain rounded-lg border"
          />
        )}

        {/* Progress bar */}
        {loading && (
          <div className="w-full bg-gray-200 rounded-full h-3 mt-4 overflow-hidden">
            <div
              className="bg-blue-600 h-3 transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Extract button */}
        <button
          onClick={handleExtract}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl mt-4 transition disabled:opacity-50"
        >
          {loading ? "Extracting..." : "Extract Text"}
        </button>

        {/* Extracted text display */}
        <h2 className="text-lg font-semibold text-gray-700 mt-6">
          Extracted Text:
        </h2>
        <textarea
          rows={8}
          className="w-full p-3 border border-gray-300 rounded-xl mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={text}
          readOnly
        ></textarea>
      </div>

      {/* Vercel Analytics for usage tracking */}
      <Analytics />
    </main>
  );
}
