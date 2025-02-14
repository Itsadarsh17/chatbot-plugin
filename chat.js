(function () {
  // Check if chatbot is already added
  if (window.ChatbotLoaded) return;
  window.ChatbotLoaded = true;

  // Create login container
  let loginContainer = document.createElement("div");
  loginContainer.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 300px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    padding: 20px;
    display: none;
    z-index: 9999;
  `;

  // Create login form elements
  let emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.placeholder = "Email";
  emailInput.style.cssText = `
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  `;

  let passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.placeholder = "Password";
  passwordInput.style.cssText = emailInput.style.cssText;

  let loginButton = document.createElement("button");
  loginButton.innerText = "Login";
  loginButton.style.cssText = `
    width: 100%;
    padding: 10px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;

  // Add login elements to container
  loginContainer.appendChild(emailInput);
  loginContainer.appendChild(passwordInput);
  loginContainer.appendChild(loginButton);

  // Create chat button
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

  // Create chat container
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
    flex-direction: column;
    z-index: 9999;
  `;

  // Create messages container
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

  let messageInput = document.createElement("input");
  messageInput.placeholder = "Type a message...";
  messageInput.style.cssText = `
    flex-grow: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-right: 8px;
  `;

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

  // Add chat elements to container
  inputContainer.appendChild(messageInput);
  inputContainer.appendChild(sendButton);
  chatContainer.appendChild(messagesContainer);
  chatContainer.appendChild(inputContainer);

  // Handle login
  async function handleLogin() {
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const response = await fetch('http://localhost:3000/api/v1/authentication/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('jwt_token', data.token);
        loginContainer.style.display = 'none';
        chatContainer.style.display = 'flex';
        addMessage("Welcome! How can I help you today?");
      } else {
        alert('Login failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Network error occurred');
      console.error('Login error:', error);
    }
  }

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
    const token = localStorage.getItem('jwt_token');
    try {
      const response = await fetch('http://localhost:3000/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          showLogin();
          throw new Error('Please login again');
        }
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error:', error);
      return 'Sorry, there was an error processing your message.';
    }
  }

  // Handle send message
  async function handleSend() {
    const message = messageInput.value.trim();
    if (message) {
      addMessage(message, true);
      messageInput.value = '';
      messageInput.disabled = true;
      sendButton.disabled = true;

      const response = await sendMessage(message);
      addMessage(response);

      messageInput.disabled = false;
      sendButton.disabled = false;
      messageInput.focus();
    }
  }

  // Function to show login
  function showLogin() {
    chatContainer.style.display = 'none';
    loginContainer.style.display = 'block';
  }

  // Check authentication and show appropriate container
  function checkAuth() {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      chatContainer.style.display = 'flex';
    } else {
      showLogin();
    }
  }

  // Add event listeners
  loginButton.addEventListener('click', handleLogin);
  sendButton.addEventListener('click', handleSend);
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  });

  chatButton.addEventListener("click", () => {
    const isLoggedIn = localStorage.getItem('jwt_token');
    if (isLoggedIn) {
      chatContainer.style.display = chatContainer.style.display === "none" ? "flex" : "none";
      if (chatContainer.style.display === "flex") {
        messageInput.focus();
      }
    } else {
      loginContainer.style.display = loginContainer.style.display === "none" ? "block" : "none";
      if (loginContainer.style.display === "block") {
        emailInput.focus();
      }
    }
  });

  // Append elements to body
  document.body.appendChild(chatButton);
  document.body.appendChild(loginContainer);
  document.body.appendChild(chatContainer);

  // Check auth on load
  checkAuth();
})();
