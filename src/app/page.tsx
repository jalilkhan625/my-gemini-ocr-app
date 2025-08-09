"use client";

import { useState, ChangeEvent } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

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

    // Simulated progress bar animation
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
        toast.success("Text extracted successfully!");
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file?.name || "");
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      //toast.success("Image selected successfully!");
    } else {
      setPreviewUrl("");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Toast Container */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          🖼️ Gemini OCR Tool
        </h1>
        <p className="text-gray-600 mb-6">
          Upload an image and extract text instantly using Google Gemini 1.5.
        </p>

        {/* File Upload */}
        <label
          htmlFor="imageInput"
          className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-blue-500 transition"
        >
          {fileName || "Click or drag an image here"}
        </label>
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Image Preview */}
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="mt-4 max-h-64 w-full object-contain rounded-lg border"
          />
        )}

        {/* Progress Bar */}
        {loading && (
          <div className="w-full bg-gray-200 rounded-full h-3 mt-4 overflow-hidden">
            <div
              className="bg-blue-600 h-3 transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Extract Button */}
        <button
          onClick={handleExtract}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl mt-4 transition disabled:opacity-50"
        >
          {loading ? "Extracting..." : "Extract Text"}
        </button>

        {/* Extracted Text */}
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
    </main>
  );
}
