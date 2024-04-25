"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = exports.getErrorInfo = void 0;
const axios_1 = require("axios");

// the main chat action
const chat = async (input, options) => {
    const groq = axios_1.default.create({
        baseURL: options.apiUrl,
        headers: { Authorization: `Bearer ${options.apikey}` },
    });

    const message = [{role: "system", "content": options.prompt}, { role: "user", content: input.text }];
    try {
        const { data } = await groq.post("chat/completions", {
            model: options.model || "llama3-70b-8192",
            messages: message,
        });

        const response = data.choices[0].message.content.trim();

        popclip.showText(response, {preview: true});
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
