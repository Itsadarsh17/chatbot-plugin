(function () {
  // Check if chatbot is already added
  if (window.ChatbotLoaded) return;
  window.ChatbotLoaded = true;

  // Store JWT token
  let authToken = localStorage.getItem('jwt_token');

  // Create chatbot button
  let chatButton = document.createElement("div");
  chatButton.innerText = "💬 Chat";
  chatButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #007bff;
    color: white;
    padding: 12px 20px;
    border-radius: 50px;
    cursor: pointer;
    font-family: Arial, sans-serif;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 9999;
  `;
  
  // Create chatbot container
  let chatContainer = document.createElement("div");
  chatContainer.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 300px;
    height: 400px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    display: none;
    z-index: 9999;
    flex-direction: column;
  `;

  // Create chat messages container
  let messagesContainer = document.createElement("div");
  messagesContainer.style.cssText = `
    flex-grow: 1;
    overflow-y: auto;
    padding: 15px;
  `;

  // Create input container
  let inputContainer = document.createElement("div");
  inputContainer.style.cssText = `
    padding: 10px;
    border-top: 1px solid #eee;
    display: flex;
  `;

  // Create input field
  let input = document.createElement("input");
  input.style.cssText = `
    flex-grow: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-right: 8px;
  `;

  // Create send button
  let sendButton = document.createElement("button");
  sendButton.innerText = "Send";
  sendButton.style.cssText = `
    padding: 8px 16px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;

  // Function to add message to chat
  function addMessage(message, isUser = false) {
    const messageDiv = document.createElement("div");
    messageDiv.style.cssText = `
      margin: 8px 0;
      padding: 8px 12px;
      border-radius: 15px;
      max-width: 80%;
      ${isUser ? 
        'background: #007bff; color: white; margin-left: auto;' : 
        'background: #f0f0f0; margin-right: auto;'}
    `;
    messageDiv.innerText = message;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Function to send message to backend
  async function sendMessage(message) {
    try {
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ message: message })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error:', error);
      return 'Sorry, there was an error processing your message.';
    }
  }

  // Handle send button click
  async function handleSend() {
    const message = input.value.trim();
    if (message) {
      addMessage(message, true);
      input.value = '';
      input.disabled = true;
      sendButton.disabled = true;

      const response = await sendMessage(message);
      addMessage(response);

      input.disabled = false;
      sendButton.disabled = false;
      input.focus();
    }
  }

  // Add event listeners
  sendButton.addEventListener('click', handleSend);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  });

  // Toggle chatbot visibility
  chatButton.addEventListener("click", () => {
    chatContainer.style.display = chatContainer.style.display === "none" ? "flex" : "none";
    if (chatContainer.style.display === "flex") {
      input.focus();
    }
  });

  // Assemble the chat interface
  inputContainer.appendChild(input);
  inputContainer.appendChild(sendButton);
  chatContainer.appendChild(messagesContainer);
  chatContainer.appendChild(inputContainer);

  // Append chatbot elements to the body
  document.body.appendChild(chatButton);
  document.body.appendChild(chatContainer);
})();
