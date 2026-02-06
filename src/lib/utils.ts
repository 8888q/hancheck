import type { HSKWord } from "./interfaces";

export function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function evaluateAnswer(answer: string, word: HSKWord, method: "toneless" | "tones" = "toneless"): boolean {
    if (method === "toneless") {
        return answer.toLowerCase() === word.pinyin_toneless.toLowerCase();
    } else {
        return answer.toLowerCase() === word.pinyin_num.toLowerCase();
    }
}