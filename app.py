from flask import Flask, render_template,request,jsonify
from dotenv import load_dotenv
import os

from groq import Groq

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document

load_dotenv()

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER,exist_ok=True)

#Groq Client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

#Embedding Model
embeddings = HuggingFaceEmbeddings(
    model_name = "sentence-transformers/all-MiniLM-L6-v2"
)

vector_db = None

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
def upload_pdf():
    global vector_db

    if "pdf" not in request.files:
        return jsonify({"error": "No file uploaded"})

    file = request.files["pdf"]

    if file.filename == "":
        return jsonify({"error": "No file selected"})

    filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(filepath)

    # Load PDF
    loader = PyPDFLoader(filepath)
    documents = loader.load()

    # Split text
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    docs = splitter.split_documents(documents)

    # Create Vector Database
    vector_db = FAISS.from_documents(
        docs,
        embeddings
    )

    return jsonify({
        "message": "PDF uploaded and processed successfully!"
    })

@app.route("/chat" , methods=["POST"])
def chat():
    global vector_db

    data = request.get_json()
    question = data.get("question")

    if vector_db is None:
        return jsonify({"answer": "Please upload a PDF first."})

    docs = vector_db.similarity_search(question, k=1)

    context = "\n\n".join([doc.page_content for doc in docs])

    page = docs[0].metadata.get("page", 0) + 1

    prompt = f"""
    Answer only from the given PDF.
    Context:
    {context}

    Question: 
    {question}
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant" ,
        messages=[
            {
                "role" : "user" ,
                "content" : prompt
            }
        ]
    )

    answer = response.choices[0].message.content
    return jsonify({
        "answer" : answer , 
        "page" : page
    })
    
if __name__ == "__main__":
    app.run(debug=True)