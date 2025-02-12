(function () {
  // Check if chatbot is already added
  if (window.ChatbotLoaded) return;
  window.ChatbotLoaded = true;

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
  `;

  // Create chatbot iframe (You can replace this with your chatbot API)
  let iframe = document.createElement("iframe");
  iframe.src = "https://your-chatbot-url.com"; // Replace with your chatbot URL
  iframe.style.cssText = "width: 100%; height: 100%; border: none;";
  
  chatContainer.appendChild(iframe);

  // Toggle chatbot visibility
  chatButton.addEventListener("click", () => {
    chatContainer.style.display = chatContainer.style.display === "none" ? "block" : "none";
  });

  // Append chatbot elements to the body
  document.body.appendChild(chatButton);
  document.body.appendChild(chatContainer);
})();
