(function () {
  class Chatbot {
    constructor(options) {
      this.apiUrl = options.apiUrl || "https://your-rails-app.com/api/v1/chat";
      this.licenseKey = options.licenseKey;
      this.theme = options.theme || "#007bff";
      this.position = options.position || "bottom-right";
      this.messages = [];
      this.recaptchaSiteKey = options.recaptchaSiteKey;
      this.init();
    }

    async init() {
  if (!this.licenseKey) {
    console.error("License key is required!");
    return;
  }
  if (!this.recaptchaSiteKey) {
    console.error("reCAPTCHA site key is required!");
    return;
  }
  
  const script = document.createElement('script');
  script.src = `https://www.google.com/recaptcha/api.js?render=${this.recaptchaSiteKey}`;
  document.head.appendChild(script);

  await new Promise(resolve => script.onload = resolve);
  this.createChatUI();
}

    createChatUI() {
      // Chat button
      this.chatButton = document.createElement("div");
      this.chatButton.innerText = "💬 Chat";
      this.chatButton.style.cssText = `
        position: fixed;
        ${this.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        ${this.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
        background: ${this.theme};
        color: white;
        padding: 12px 20px;
        border-radius: 50px;
        cursor: pointer;
        box-shadow: 0 2px 12px rgba(0,0,0,0.15);
        z-index: 10000;
      `;

      // Chat container
      this.chatContainer = document.createElement("div");
      this.chatContainer.style.cssText = `
        position: fixed;
        ${this.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        ${this.position.includes('bottom') ? 'bottom: 80px;' : 'top: 80px;'}
        width: 300px;
        height: 400px;
        background: white;
        border-radius: 10px;
        display: none;
        box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        flex-direction: column;
      `;

      // Messages container
      this.messagesContainer = document.createElement("div");
      this.messagesContainer.style.cssText = `
        flex-grow: 1;
        overflow-y: auto;
        padding: 15px;
      `;

      // Input container
      this.inputContainer = document.createElement("div");
      this.inputContainer.style.cssText = `
        padding: 15px;
        border-top: 1px solid #eee;
        display: flex;
        gap: 10px;
      `;

      document.body.appendChild(this.chatButton);
      document.body.appendChild(this.chatContainer);
      this.chatContainer.appendChild(this.messagesContainer);
      this.chatContainer.appendChild(this.inputContainer);

      this.chatButton.addEventListener("click", () => {
        this.chatContainer.style.display = 
          this.chatContainer.style.display === "none" ? "flex" : "none";
      });

      this.createInputUI();
    }

    createInputUI() {
      this.input = document.createElement("input");
      this.input.style.cssText = `
        flex-grow: 1;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        outline: none;
      `;
      this.input.placeholder = "Type a message...";

      this.sendButton = document.createElement("button");
      this.sendButton.style.cssText = `
        background: ${this.theme};
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 4px;
        cursor: pointer;
      `;
      this.sendButton.innerText = "Send";

      this.input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.sendMessage(this.input.value);
          this.input.value = "";
        }
      });

      this.sendButton.addEventListener("click", () => {
        this.sendMessage(this.input.value);
        this.input.value = "";
      });

      this.inputContainer.appendChild(this.input);
      this.inputContainer.appendChild(this.sendButton);
    }

    addMessage(message, isBot = false) {
      const messageElement = document.createElement("div");
      messageElement.style.cssText = `
        margin-bottom: 10px;
        ${isBot ? '' : 'text-align: right;'}
      `;
      
      const bubble = document.createElement("div");
      bubble.style.cssText = `
        display: inline-block;
        padding: 8px 12px;
        border-radius: 15px;
        max-width: 80%;
        word-wrap: break-word;
        ${isBot ? 
          'background: #f0f0f0; border-bottom-left-radius: 5px;' : 
          `background: ${this.theme}; color: white; border-bottom-right-radius: 5px;`}
      `;
      bubble.textContent = message;
      
      messageElement.appendChild(bubble);
      this.messagesContainer.appendChild(messageElement);
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    async sendMessage(message) {
      if (!message.trim()) return;

      this.addMessage(message, false);

      try {
        const token = await grecaptcha.execute(this.recaptchaSiteKey, {
          action: 'submit_chat'
        });

        const response = await fetch(this.apiUrl, {
          method: "POST",
          headers: {
            "X-License-Key": this.licenseKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ 
            message,
            recaptcha_token: token
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.addMessage(data.response, true);
      } catch (error) {
        console.error("Error sending message:", error);
        this.addMessage("Sorry, there was an error sending your message.", true);
      }
    }
  }

  window.ChatbotSDK = Chatbot;
})();
