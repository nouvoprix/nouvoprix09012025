import axios from 'axios';

export const TranslateText = async (text, targetLanguage) => {
  const apiKey = 'AIzaSyCdx6W3QLTKq8l4tEsirmAO_-Y7ysy5Bp8';
  const apiUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLanguage,
      }),
    });
    let json = await response.json();
    console.log("json_google",json)
    const translation = json?.data?.translations[0]?.translatedText;
    return translation;
  } catch (e) {
    console.error('There was a problem with the fetch operation:', e);
    return null;
  }
};

export const GetSelectedLanguage = languageObject => {
  if (languageObject?.language == 'English') return 'en';
  if (languageObject?.language == 'French') return 'fr';
  if (languageObject?.language == 'Spanish') return 'es';
  if (languageObject?.language == 'HaitianCreole') return 'ht';
};
