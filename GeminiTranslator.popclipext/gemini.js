"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = exports.getErrorInfo = void 0;
const axios = require("axios");

// the main chat action
const chat = async (input, options) => {
    const gemini = axios.default.create({
        headers: { 'Content-Type': 'application/json' },
    });

    const url =  `https://generativelanguage.googleapis.com/v1beta/models/${options.model}:generateContent?key=${options.apikey}`
    const message = {
    "contents": [
        {
            "role": "user",
            "parts": [{"text": options.prompt + input.text}]
        }
    ],
    "safetySettings": [
        {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_ONLY_HIGH"
        }
    ],
    "generationConfig": {
      "temperature": 1.0,
      "maxOutputTokens": 8192,
      "topP": 0.95,
      "topK": 64
    }
  };
    try {
        const { data } = await gemini.post(url, message);

        const response = data.candidates[0].content.parts.map(part => part.text).join('\n');

        if (options.useTot) {
            var encodedContent = encodeURIComponent('\n-----------------------\n\n' + response + '\n');
            var totURL = `tot://${options.totPage}/append?text=${encodedContent}`;
            popclip.openUrl(totURL);
        } else {
            popclip.showText(response, {preview: true});
        }
    }
    catch (e) {
        popclip.showText(getErrorInfo(e));
    }
};
function getErrorInfo(error) {
    if (typeof error === "object" && error !== null && "response" in error) {
        const response = error.response;
        //return JSON.stringify(response);
        return `Message from API Endpoint (code ${response.status}): ${response.data.error.message}`;
    }
    else {
        return String(error);
    }
}
exports.getErrorInfo = getErrorInfo;
exports.action = chat
