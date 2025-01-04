document.getElementById("sendButton").addEventListener("click", function () {
  const chatInput = document.getElementById("chatInput");
  const messageText = chatInput.value;

  if (messageText.trim() !== "") {
    displayMessage("sent", messageText);
    chatInput.value = "";
    setTimeout(() => generateAIResponse(messageText), 1000);
  }
});

document
  .getElementById("chatInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      document.getElementById("sendButton").click();
    }
  });

function displayMessage(type, text) {
  const messagesContainer = document.getElementById("messages");

  const messageBubble = document.createElement("div");
  messageBubble.classList.add("message", type);
  messageBubble.textContent = text;

  messagesContainer.appendChild(messageBubble);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function generateAIResponse(userMessage) {
  const apiKey =
    "";
  const apiUrl = "";

  try {
    console.log("Sending request to OpenAI API...");
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: userMessage,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      console.log("Response status:", response.status);
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API response:", data);
    const aiMessage = data.choices[0].text.trim();

    displayMessage("received", aiMessage);
  } catch (error) {
    console.error("Error:", error);
    displayMessage(
      "received",
      "Sorry, something went wrong. Please try again later."
    );
  }
}
