# 🤖 AI RAG Chatbot

An AI-powered Retrieval-Augmented Generation (RAG) chatbot that allows users to upload PDF documents and ask questions based on their content.

The application uses document processing, semantic search, vector embeddings, FAISS, and the Groq LLM API to generate answers from the uploaded PDF.

---

## 🚀 Features

- 📄 Upload and process PDF documents
- 🤖 Ask questions based on uploaded PDF content
- 🔍 Semantic similarity search
- 🧠 Retrieval-Augmented Generation (RAG)
- ✂️ Document chunking using Recursive Character Text Splitter
- 🔢 Vector embeddings using Hugging Face
- 📚 FAISS vector database
- ⚡ Fast AI responses using Groq
- 📍 Displays the source page number for the retrieved answer
- 🌐 Interactive web application built with Flask

---

## 🛠️ Tech Stack

- Python
- Flask
- Groq API
- LangChain
- FAISS
- Hugging Face Embeddings
- PyPDF
- Sentence Transformers
- Llama 3.1
- HTML5
- CSS3
- JavaScript

---

## 🧠 How It Works

1. The user uploads a PDF document.
2. PyPDFLoader extracts the text from the PDF.
3. The document is divided into smaller text chunks.
4. Hugging Face creates vector embeddings for the text.
5. FAISS stores the embeddings in a vector database.
6. The user asks a question.
7. The system finds the most relevant content using similarity search.
8. The retrieved PDF content is sent as context to the Groq LLM.
9. The AI generates an answer based only on the uploaded PDF.
10. The application displays the answer and source page number.

---

## ⚙️ Installation

### 1. Clone the repository

git clone https://github.com/mosahil-dev/AI-RAG-Chatbot.git

### 2. Navigate to the project folder

cd AI-RAG-Chatbot

### 3. Install dependencies

pip install -r requirements.txt

### 4. Create a `.env` file

GROQ_API_KEY=your_groq_api_key

### 5. Run the application

python app.py

### 6. Open in your browser

http://127.0.0.1:5000/

---

## 📂 Project Structure

- `app.py` – Main Flask application
- `templates/` – HTML templates
- `static/` – CSS and JavaScript files
- `uploads/` – Uploaded PDF files
- `.env` – Stores the Groq API key locally
- `requirements.txt` – Project dependencies

---

## 🔐 Important

Do not upload your `.env` file or Groq API key to GitHub. Keep your API key private.

---

## 🎯 Future Improvements

- Support multiple PDF documents
- Improve document retrieval accuracy
- Add chat history
- Add support for additional file formats
- Improve retrieval using advanced RAG techniques
- Add authentication and user accounts
- Deploy the application online

---

## 👨‍💻 Author

**Mo.Sahil**

GitHub: https://github.com/mosahil-dev

LinkedIn: https://www.linkedin.com/in/mo-sahil-bca

---

⭐ If you found this project useful, consider giving it a star!
