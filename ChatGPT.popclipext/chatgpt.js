"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = exports.getErrorInfo = void 0;
const axios_1 = require("axios");

// the main chat action
const chat = async (input, options) => {
    const openai = axios_1.default.create({
        baseURL: options.apiUrl,
        headers: { Authorization: `Bearer ${options.apikey}` },
    });

    const message = [{role: "system", "content": options.prompt}, { role: "user", content: input.text }];
    try {
        const { data } = await openai.post("chat/completions", {
            model: options.model || "gpt-3.5-turbo",
            messages: message,
        });

        const response = data.choices[0].message.content.trim();

        if (options.useTot) {
            const now = new Date();
            var encodedContent = encodeURIComponent('\n-----------' + now.toLocaleString("zh-CN", {hour12: false}) + '------------\n\n' + response + '\n');            
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
