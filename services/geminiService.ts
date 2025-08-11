import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// デバッグ用ログ
console.log("Environment variables check:");
console.log("VITE_GEMINI_API_KEY:", import.meta.env.VITE_GEMINI_API_KEY);
console.log("API_KEY value:", API_KEY);
console.log("import.meta.env keys:", Object.keys(import.meta.env));

if (!API_KEY) {
  console.warn("Gemini API Key is not set. AI features will be disabled or use mock data.");
}

// API_KEYが存在する場合のみGoogleGenAIを初期化
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;
const model = "gemini-2.5-flash";

// Updated to accept a pre-formatted string for user context
export const generateAiResponse = async (
  prompt: string,
  history: { role: 'user' | 'model', parts: { text: string }[] }[],
  userContextString: string // The formatted string from the User object
): Promise<string> => {
  if (!API_KEY || !ai) {
    return new Promise(resolve => setTimeout(() => resolve("こんにちは！今日はどんなお話をしましょうか？Gemini APIキーが設定されていないため、これはデモ用の返信です。"), 1000));
  }
  
  const systemInstruction = `あなたは、高齢者の話し相手となる、温かく忍耐強い対話パートナーです。あなたの名前は「ひなた」です。
セラピストではなく、優しい友人や家族のように振る舞ってください。
以下のユーザー情報を参考に、個人的で心に寄り添った対話を心がけてください。
---
${userContextString}
---
回想療法を促すため、上記の情報（特に家族の思い出や地域の経験）について、オープンエンドな質問（はい/いいえで答えられない質問）を優しく投げかけてください。
例：「お孫さんとの一番の思い出は何ですか？」「その地域で昔、特に好きだった場所はありますか？」
ユーザーの発言を肯定し、共感を示しながら、会話を自然に広げてください。

重要：あなたの返答は、常に短く、簡潔にしてください。基本的には1〜2文で答えるように心がけてください。
`;

  try {
    const chat = ai.chats.create({
      model: model,
      history: history,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    // This part is intentionally left unchanged as per user request to not alter the speaking mechanism
    const result: GenerateContentResponse = await chat.sendMessage({ message: prompt });
    return result.text;
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "申し訳ありません、通信中にエラーが発生しました。もう一度試してみてください。";
  }
};

export const extractReminderFromText = async (text: string): Promise<{ title: string; time: string }> => {
  if (!API_KEY || !ai) {
    console.warn("Gemini API Key is not set. Reminder extraction will use mock data.");
    const timeMatch = text.match(/(\d{1,2}:\d{2}|\d{1,2}時\d{1,2}分|\d{1,2}時)/);
    const mockTime = timeMatch ? (timeMatch[0].replace('時', ':').replace('分', '').padStart(5, '0')) : '時刻未設定';
    return { title: text.substring(0, 20), time: mockTime };
  }

  const systemInstruction = `You are a text analysis expert. Your task is to extract a short, concise reminder title and a time from the user's spoken text.
- The title should be a brief summary of the activity.
- The time should be in HH:MM format (24-hour clock).
- If the user mentions "朝" (morning), assume 08:00. If "昼" (noon/daytime), assume 12:00. If "夜" (evening/night), assume 19:00.
- If no specific time is mentioned, the time should be the exact string "時刻未設定".
- Respond ONLY with the JSON object. Do not add any conversational text or markdown formatting.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `以下の文章から、予定のタイトルと時刻を抽出してください。\n\n「${text}」`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "The concise title of the reminder."
            },
            time: {
              type: Type.STRING,
              description: "The time for the reminder in HH:MM format or '時刻未設定'."
            }
          },
          required: ["title", "time"]
        }
      }
    });

    const jsonText = response.text.trim();
    if (jsonText.startsWith('{') && jsonText.endsWith('}')) {
        const parsed = JSON.parse(jsonText);
        return {
            title: parsed.title || '名称不明の予定',
            time: parsed.time || '時刻未設定'
        };
    }
    console.error("Failed to parse JSON from AI response:", jsonText);
    return { title: text.substring(0, 20), time: '時刻未設定' };

  } catch (error) {
    console.error("Error extracting reminder:", error);
    return { title: "AIでの処理に失敗しました", time: "エラー" };
  }
};
