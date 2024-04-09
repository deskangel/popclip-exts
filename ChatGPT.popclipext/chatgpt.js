"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = exports.getErrorInfo = void 0;
const axios_1 = require("axios");
// the extension keeps the message history in memory
const messages = [];
// the last chat date
let lastChat = new Date();
// reset the history
function reset() {
    print("Resetting chat history");
    messages.length = 0;
}
// get the content of the last `n` messages from the chat, trimmed and separated by double newlines
function getTranscript(n) {
    return messages.slice(-n).map((m) => m.content.trim()).join("\n\n");
}
// the main chat action
const chat = async (input, options) => {
    const openai = axios_1.default.create({
        baseURL: options.apiUrl,
        headers: { Authorization: `Bearer ${options.apikey}` },
    });
    // if the last chat was long enough ago, reset the history
    if (options.resetMinutes.length > 0) {
        const resetInterval = parseInt(options.resetMinutes) * 1000 * 60;
        if (new Date().getTime() - lastChat.getTime() > resetInterval) {
            reset();
        }
    }
    // const message = [{role: "system", "content": "You are translator. Please translate English to Chinese and vice versa."}, { role: "user", content: input.text }];
    // // add the new message to the history
    messages.push({role: "system", "content": "你是一位翻译家。请把给你的文字翻译成中文。如果给你的文字是中文，则翻译成英语。"}, { role: "user", content: input.text });
    // // send the whole message history to OpenAI
    try {
        const { data } = await openai.post("chat/completions", {
            model: options.model || "gpt-3.5-turbo",
            messages,
        });
        // add the response to the history
        // console.log(data.choices[0].message);
        messages.push(data.choices[0].message);
        popclip.showText(getTranscript(1), {preview: true});

        reset();
        // return getTranscript(1);
        // lastChat = new Date();
        // // if holding shift and alt, pasye just the responsw.
        // // if holding shift, copy just the response.
        // // else, paste the last input and response.
        // if (popclip.modifiers.shift && popclip.modifiers.option) {
        //     popclip.pasteText(getTranscript(1));
        // }
        // else if (popclip.modifiers.shift) {
        //     popclip.copyText(getTranscript(1));
        // }
        // else {
        //     popclip.pasteText(getTranscript(2));
        //     popclip.showSuccess();
        // }
    }
    catch (e) {
        popclip.showText(getErrorInfo(e));
    }
};
function getErrorInfo(error) {
    if (typeof error === "object" && error !== null && "response" in error) {
        const response = error.response;
        //return JSON.stringify(response);
        return `Message from OpenAI (code ${response.status}): ${response.data.error.message}`;
    }
    else {
        return String(error);
    }
}
exports.getErrorInfo = getErrorInfo;
exports.action = chat
// export the actions
// exports.actions = [{
//         title: "ChatGPT: Chat",
//         code: chat
//     }, {
//         title: "ChatGPT: Reset",
//         icon: "broom-icon.svg",
//         requirements: ["option-showReset=1"],
//         code: reset,
//     }];
