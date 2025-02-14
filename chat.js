(function () {
  let userToken = localStorage.getItem("chatbot_token");
  let chatButton = document.createElement("div");
  chatButton.innerText = "💬 Chat";
  chatButton.style.cssText = 
    position: fixed; right: 20px; bottom: 20px; background: #007bff;
    color: white; padding: 12px 20px; border-radius: 50px; cursor: pointer;
  ;
  let chatContainer = document.createElement("div");
  chatContainer.style.cssText = 
    position: fixed; right: 20px; bottom: 80px; width: 300px; height: 400px;
    background: white; border-radius: 10px; display: none;
    padding: 10px; overflow-y: auto;
  ;
  chatButton.addEventListener("click", () => {
    chatContainer.style.display = chatContainer.style.display === "none" ? "block" : "none";
  });
  document.body.appendChild(chatButton);
  document.body.appendChild(chatContainer);
  function sendMessage(message) {
    fetch("https://your-rails-app.com/api/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": Bearer ${userToken},  // ✅ Send JWT Token
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
      chatContainer.innerHTML += 

Bot: ${data.response}

;
    })
    .catch(error => console.error("Error:", error));
  }
  let input = document.createElement("input");
  input.placeholder = "Type a message...";
  let sendButton = document.createElement("button");
  sendButton.innerText = "Send";
  sendButton.onclick = function () {
    sendMessage(input.value);
    input.value = "";
  };
  chatContainer.appendChild(input);
  chatContainer.appendChild(sendButton);
})();
