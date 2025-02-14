(function () {
  class Chatbot {
    constructor(options) {
      this.apiUrl = options.apiUrl || "https://your-rails-app.com/api/v1/chat";
      this.userToken = options.token || localStorage.getItem("chatbot_token"); // ✅ Allow dynamic token
      this.theme = options.theme || "#007bff"; // Allow color customization
      this.position = options.position || "bottom-right"; // Allow positioning
      this.init();
    }

    init() {
      this.createChatUI();
    }

    createChatUI() {
      // Chat button
      this.chatButton = document.createElement("div");
      this.chatButton.innerText = "💬 Chat";
      this.chatButton.style.cssText = `
        position: fixed; right: 20px; bottom: 20px; background: ${this.theme};
        color: white; padding: 12px 20px; border-radius: 50px; cursor: pointer;
      `;
      document.body.appendChild(this.chatButton);

      // Chat container
      this.chatContainer = document.createElement("div");
      this.chatContainer.style.cssText = `
        position: fixed; right: 20px; bottom: 80px; width: 300px; height: 400px;
        background: white; border-radius: 10px; display: none;
        padding: 10px; overflow-y: auto;
      `;
      document.body.appendChild(this.chatContainer);

      this.chatButton.addEventListener("click", () => {
        this.chatContainer.style.display = this.chatContainer.style.display === "none" ? "block" : "none";
      });

      this.createInputUI();
    }

    createInputUI() {
      this.input = document.createElement("input");
      this.input.placeholder = "Type a message...";
      this.sendButton = document.createElement("button");
      this.sendButton.innerText = "Send";

      this.sendButton.onclick = () => {
        this.sendMessage(this.input.value);
        this.input.value = "";
      };

      this.chatContainer.appendChild(this.input);
      this.chatContainer.appendChild(this.sendButton);
    }

    sendMessage(message) {
      fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.userToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: message })
      })
      .then(response => response.json())
      .then(data => {
        this.chatContainer.innerHTML += `<p><strong>Bot:</strong> ${data.response}</p>`;
      })
      .catch(error => console.error("Error:", error));
    }
  }

  // ✅ Expose Chatbot as a global variable for easy usage
  window.ChatbotSDK = Chatbot;
})();
