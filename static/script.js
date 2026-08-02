async function typeText(element , text) {
    element.innerHTML = "";
    for(let i = 0; i < text.length; i++){
        element.innerHTML += text.charAt(i);
        await new Promise(resolve => setTimeout(resolve , 15));
    }
}

function startThinkingAnimation(element){
    let dots = 0;
    return setInterval(()=>{
        dots++;
        if(dots>3){
            dots = 1;
        }

        element.innerHTML = "🤖 Thinking" + ".".repeat(dots);
    },400);
}
// PDF Upload
document.getElementById("pdfFile").addEventListener("change" , function (){
    if(this.files.length>0){
        document.getElementById("fileName").textContent=this.files[0].name;
    }
});
document.getElementById("uploadBtn").addEventListener("click" , async () => {
    const file = document.getElementById("pdfFile").files[0];
    if (!file) {
        document.getElementById("uploadStatus").innerHTML = "❌ Please select a PDF first.";
        return;
    }

    const progressContainer = document.getElementById("progressBar");

    document.querySelector(".progress-container").style.display = "block";

    progressContainer.style.width = "10%";

    const formData = new FormData();
    formData.append("pdf" , file);

    try{
        const response = await fetch("/upload", {
            method : "POST",
            body : formData
        });

        const data = await response.json();

        progressContainer.style.width = "100%";

        document.getElementById("uploadStatus").innerHTML = "✅ " + data.message;

        setTimeout(() => {
            document.querySelector(".progress-container").style.display = "none";
            progressContainer.style.width = "0%";
        },1000);

    } catch (err) {
        console.log(err);
        document.getElementById("uploadStatus").innerHTML = "❌ Upload Failed";
    }
});

// ==========================
// Ask Question
// ==========================

document.getElementById("sendBtn").addEventListener("click", async () => {

    const input = document.getElementById("question");
    const question = input.value.trim();

    if(question==="") return;

    const chatWindow = document.getElementById("chatWindow");

    // User Message

    const userMessage = document.createElement("div");

    userMessage.className = "user-message";

    userMessage.innerHTML = `
        <div class="user-bubble">
            ${question}
        </div>
    `;

    chatWindow.appendChild(userMessage);

    // AI Message

    const aiMessage = document.createElement("div");

    aiMessage.className = "ai-message";

    const bubbleId = "bubble_" + Date.now();

    aiMessage.innerHTML = `
        <div class="avatar">
            🤖
        </div>

        <div class="bubble" id="${bubbleId}">
            <span class="thinking">
                Thinking...
            </span>
        </div>
    `;

    chatWindow.appendChild(aiMessage);

    chatWindow.scrollTop = chatWindow.scrollHeight;

    input.value="";

    const sendBtn = document.getElementById("sendBtn");

    sendBtn.disabled = true;

    sendBtn.innerHTML = `<div class="loader"></div>`;

    let thinkingInterval;

    try{

        const bubble = document.getElementById(bubbleId);

// Animation pehle start hogi
thinkingInterval = startThinkingAnimation(bubble);

// Ab request bhejo
const response = await fetch("/chat", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        question: question
    })
});

if (!response.ok) {
    throw new Error("Server Error");
}

const data = await response.json();

// Response aane ke baad animation band
clearInterval(thinkingInterval);

// Typing effect
await typeText(bubble, data.answer);

const pageTag = document.createElement("div");

pageTag.className = "page-tag";

pageTag.innerHTML = `📄 Source: Page ${data.page}`;

bubble.appendChild(document.createElement("br"));
bubble.appendChild(pageTag);

const copyBtn = document.createElement("button");

copyBtn.className = "copy-btn";
copyBtn.innerHTML = "📋 Copy";

copyBtn.onclick = () => {
    navigator.clipboard.writeText(data.answer);
    copyBtn.innerHTML = "✅ Copied";
    
    setTimeout(() => {
        copyBtn.innerHTML = "📋 Copy";
    },2000);
};

bubble.appendChild(document.createElement("br"));
bubble.appendChild(copyBtn);

const speakerBtn = document.createElement("button"); 
speakerBtn.className = "speaker-btn";
speakerBtn.innerHTML = "🔊";
speakerBtn.title = "Listen";
speakerBtn.onclick = () => {
    speechSynthesis.cancel(); // Stop any ongoing speech
    const speech = new SpeechSynthesisUtterance(data.answer);
    speech.lang = "en-US";
    speech.rate = 1; // Adjust the rate as needed
    speech.pitch = 1; // Adjust the pitch as needed

    speechSynthesis.speak(speech);
};

bubble.appendChild(speakerBtn);
const feedbackDiv = document.createElement("div");

feedbackDiv.className = "feedback-box";

feedbackDiv.innerHTML = `
    <button class="feedback-btn">👍</button>
    <button class = "feedback-btn">👎</button>
    `;
bubble.appendChild(document.createElement("br"));
bubble.appendChild(feedbackDiv);
}

catch(err){

    clearInterval(thinkingInterval);

    console.error(err);

    console.error(err);

    document.getElementById(bubbleId).innerHTML ="❌ Unable to get response.";

}

    finally{

        sendBtn.disabled = false;

        sendBtn.innerHTML = "➜";

        chatWindow.scrollTop = chatWindow.scrollHeight;

    }

});

document.getElementById("clearChatBtn").addEventListener("click", () => {

    const modal = document.getElementById("deleteModal");

document.getElementById("clearChatBtn").onclick = () => {
    modal.style.display = "flex";
};

document.getElementById("cancelDeleteBtn").onclick = () => {
    modal.style.display = "none";
};

document.getElementById("confirmDelete").onclick = () => {

    modal.style.display = "none";

    document.getElementById("chatWindow").innerHTML = `
        <div class="ai-message">
            <div class="avatar">🤖</div>
            <div class="bubble">
                Hello 👋<br><br>
                Upload a PDF and ask me anything.
            </div>
        </div>
    `;
};

});
const micBtn = document.getElementById("micBtn");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if(SpeechRecognition){
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    micBtn.addEventListener("click" , () => {
        recognition.start();
        micBtn.classList.add("listening");
    });
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById("question").value = transcript;
    };
    recognition.onend = () => {
        micBtn.classList.remove("listening");
    };

}