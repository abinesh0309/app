const micButton = document.getElementById('voice-toggle-button');
const userConvoDiv = document.querySelector('.userconvo');
const aiConvoDiv = document.querySelector('.aiconvo');
const convoDiv = document.querySelector('.convo');
const micDiv = document.querySelector('.mic');  // Reference to the mic div
let isListening = false;  // Keeps track of whether the mic is listening or not

// Your API Key and API URL
const API_KEY = "AIzaSyD6BHGLVrojHn4gY2SaMNQvlEgrciPoKKM"; // Your actual API key
const API_URL = `https://generativelanguage.googleapis.com/v1/tunedModels/speachmodel-d4okdqq4swas:generateContent?key=${API_KEY}`;

// Speech recognition setup
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;

// Event listener for the microphone button
micButton.addEventListener('click', () => {
  if (!isListening) {
    micDiv.style.backgroundColor = '#34ae12';  // Green when listening
    userConvoDiv.innerHTML = '<h4>YOU: <span class="usermsg">Hearing...</span></h4>';  // Show "Hearing..."
    userConvoDiv.style.opacity = 1; // Show the "hearing..." message
    recognition.start();  // Start recognition
    isListening = true;
  }
});

// Handle speech recognition results
recognition.addEventListener('result', async (event) => {
  const userSpeech = event.results[0][0].transcript;

  // Display the user's speech in the conversation
  userConvoDiv.innerHTML = `<h4>YOU: <span class="usermsg">${userSpeech}</span></h4>`;
  userConvoDiv.style.opacity = 1; // Fade in the user message

  // Display "Recognizing..." while waiting for AI response
  aiConvoDiv.innerHTML = `<h4>A.I: <span class="usermsg">Recognizing...</span></h4>`;
  aiConvoDiv.style.opacity = 1; // Fade in the AI message for "Recognizing..."

  // Scroll the conversation window to the bottom
  convoDiv.scrollTop = convoDiv.scrollHeight;

  // Send the user's input to the Gemini API and get the response
  const aiResponse = await getAIResponse(userSpeech);

  // Display the AI's actual response in the conversation
  aiConvoDiv.innerHTML = `<h4>A.I: <span class="usermsg">${aiResponse}</span></h4>`;
  aiConvoDiv.style.opacity = 1; // Fade in the AI message

  // Optionally, use text-to-speech for the AI response
  speakText(aiResponse);

  // Disable mic button while AI is speaking
  micButton.disabled = true;

  // Reset mic color after AI response
  resetMicColor();
});

// Fetch AI response from the Gemini API
async function getAIResponse(userInput) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: userInput }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Error communicating with the Gemini API. Status: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not process your request.';
    return aiResponse;
  } catch (error) {
    console.error('Error:', error);
    return 'An error occurred while communicating with the AI.';
  }
}

// Text-to-speech function
function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.onend = function () {
    // Re-enable the mic button after AI finishes speaking
    micButton.disabled = false;
  };
  window.speechSynthesis.speak(utterance);
}

// Handle recognition errors
recognition.addEventListener('error', (event) => {
  console.error('Speech recognition error:', event.error);
});

// End recognition session when finished
recognition.addEventListener('end', () => {
  console.log('Speech recognition session ended.');
  micButton.innerHTML = '<img src="/icons/microphone.png" height="45px" style="margin-top: -px" alt="mic">';  // Reset mic button text
});

// Event listener for the microphone button to change color while listening
micButton.addEventListener('click', () => {
  if (!isListening) {
    // Change mic color to green when it's listening
    micDiv.style.backgroundColor = '#34ae12';  // Green when listening
    isListening = true;  // Set the mic to be in the listening state
  }
});

// Function to reset the mic color after AI response
function resetMicColor() {
  micDiv.style.backgroundColor = '#D714D1';  // Reset to default color (purple)
  isListening = false;  // Set the mic to inactive state after AI reply
}
