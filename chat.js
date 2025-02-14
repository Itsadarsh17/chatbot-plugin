(function () {
  let userToken = localStorage.getItem("chatbot_token"); // Store Bearer token here

  let chatButton = document.createElement("div");
  chatButton.innerText = "💬 Chat";
  chatButton.style.cssText = `
    position: fixed; right: 20px; bottom: 20px; background: #007bff;
    color: white; padding: 12px 20px; border-radius: 50px; cursor: pointer;
    font-weight: bold;
  `;

  let chatContainer = document.createElement("div");
  chatContainer.style.cssText = `
    position: fixed; right: 20px; bottom: 80px; width: 320px; height: 400px;
    background: white; border-radius: 10px; display: none;
    padding: 10px; overflow-y: auto; border: 1px solid #ccc;
    box-shadow: 0px 4px 10px rgba(0,0,0,0.2);
  `;

  let chatMessages = document.createElement("div");
  chatMessages.style.cssText = "height: 350px; overflow-y: auto; padding: 5px;";

  let inputContainer = document.createElement("div");
  inputContainer.style.cssText = "display: flex; padding: 5px; border-top: 1px solid #ccc;";

  let input = document.createElement("input");
  input.placeholder = "Type a message...";
  input.style.cssText = "flex: 1; padding: 5px; border: 1px solid #ccc; border-radius: 5px;";

  let sendButton = document.createElement("button");
  sendButton.innerText = "Send";
  sendButton.style.cssText = `
    margin-left: 5px; background: #007bff; color: white;
    border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;
  `;

  chatButton.addEventListener("click", () => {
    chatContainer.style.display = chatContainer.style.display === "none" ? "block" : "none";
  });

  sendButton.onclick = function () {
    let message = input.value.trim();
    if (message === "") return;

    appendMessage("You", message);
    sendMessage(message);
    input.value = "";
  };

  document.body.appendChild(chatButton);
  document.body.appendChild(chatContainer);
  chatContainer.appendChild(chatMessages);
  chatContainer.appendChild(inputContainer);
  inputContainer.appendChild(input);
  inputContainer.appendChild(sendButton);

  function appendMessage(sender, message) {
    let msgElement = document.createElement("p");
    msgElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    msgElement.style.cssText = sender === "You" ? "text-align: right;" : "text-align: left;";
    chatMessages.appendChild(msgElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function sendMessage(message) {
    if (!userToken) {
      appendMessage("Bot", "You need to log in to use the chatbot.");
      return;
    }

    fetch("https://your-rails-app.com/api/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${userToken}`, // Only Bearer token is used
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
      appendMessage("Bot", data.response);
    })
    .catch(error => {
      console.error("Error:", error);
      appendMessage("Bot", "Sorry, something went wrong.");
    });
  }
})();
