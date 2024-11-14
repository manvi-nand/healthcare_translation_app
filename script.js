// Initialize variables
const startButton = document.getElementById('startButton');
const speakButton = document.getElementById('speakButton');
const languageSelect = document.getElementById('languageSelect');
const originalText = document.getElementById('originalText');
const translatedText = document.getElementById('translatedText');

// Google Cloud Speech-to-Text API
let recognition;
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = async (event) => {
    const transcript = event.results[event.resultIndex][0].transcript;
    originalText.textContent = transcript;
    try {
      const translated = await translateText(transcript);
      translatedText.textContent = translated;
      speakButton.style.display = 'inline-block';
    } catch (error) {
      translatedText.textContent = "Error translating text. Please try again.";
      console.error('Error in translation:', error);
    }
  };

  recognition.onerror = (event) => {
    originalText.textContent = "Error recognizing speech. Please try again.";
    console.error('Speech recognition error:', event.error);
  };
} else {
  alert("Speech Recognition is not supported in this browser.");
}

startButton.addEventListener('click', () => {
  if (recognition) {
    recognition.start();
  }
});

// DeepL API for Translation
async function translateText(text) {
  const targetLang = languageSelect.value.toUpperCase(); // Get selected language
  const apiKey = 'a3ca00f8-8584-4b3f-b11f-97b56821698b:fx';  // Replace with your actual DeepL API Key

  try {
    const response = await fetch(`https://api-free.deepl.com/v2/translate?auth_key=${apiKey}&text=${encodeURIComponent(text)}&target_lang=${targetLang}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!response.ok) {
      throw new Error(`Translation failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error('Error in DeepL translation:', error);
    throw new Error('Translation API request failed');
  }
}

// Speak the translated text
speakButton.addEventListener('click', () => {
  const text = translatedText.textContent;

  if (!text) {
    alert("No translation available to speak.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);

  // Set the correct language for speech synthesis based on selected language
  switch (languageSelect.value) {
    case 'en':
      utterance.lang = 'en-US';
      break;
    case 'es':
      utterance.lang = 'es-ES';
      break;
    case 'fr':
      utterance.lang = 'fr-FR';
      break;
    case 'de':
      utterance.lang = 'de-DE';
      break;
    case 'ar':
      utterance.lang = 'ar-SA'; // Arabic
      break;
    case 'bg':
      utterance.lang = 'bg-BG'; // Bulgarian
      break;
    case 'cs':
      utterance.lang = 'cs-CZ'; // Czech
      break;
    case 'da':
      utterance.lang = 'da-DK'; // Danish
      break;
    case 'el':
      utterance.lang = 'el-GR'; // Greek
      break;
    case 'et':
      utterance.lang = 'et-EE'; // Estonian
      break;
    case 'fi':
      utterance.lang = 'fi-FI'; // Finnish
      break;
    case 'hi':
      utterance.lang = 'hi-IN'; // Hindi
      break;
    default:
      utterance.lang = 'en-US'; // Default to English if no match
  }

  // Speak the translated text
  speechSynthesis.speak(utterance);
});
