# Handscribe

**Clear and simple: handwriting to text**

Handscribe is a lightweight tool that converts handwritten notes, forms, and documents into editable digital text using advanced OCR powered by Google Gemini.

---

## Author
👨‍💻 **Jalil Khan**  

If you like my work, **please leave a ⭐ on this repository**.

---

## Features
- 🖋 Extracts text from handwritten and printed images
- 📄 Works with notes, forms, and mixed content
- ⚡ Fast and accurate recognition
- 🖼 Image preview and progress tracking
- 🔔 Success, error, and validation toasts

---

## Project Structure
```
MY-GEMINI-OCR-APP/
│
├── public/                 # Public assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── ocr/
│   │   │       └── route.ts   # API route for OCR processing
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Layout component
│   │   ├── page.tsx           # Main page with OCR UI
│   ├── favicon.ico
│
├── .env.local               # Environment variables (API keys, etc.)
├── package.json
├── README.md
└── tsconfig.json
```

---

## How It Works
1. Upload or drag-and-drop your handwritten image.
2. The system processes the image using Gemini OCR.
3. Extracted text is displayed and ready to copy.

---

## Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS
- **OCR Engine:** Google Gemini 1.5
- **Notifications:** react-hot-toast

---

## Installation
```bash
# Clone the repo
git clone https://github.com/jalilkhan625/handscribe.git
cd handscribe

# Install dependencies
npm install

# Run the development server
npm run dev
```

---

## Usage
- Select an image file containing handwriting.
- Click **Extract Text**.
- View and copy your extracted text.

---

## License
MIT License
