import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../lib/prisma";

export async function suggestRecipes() {
    const data = await prisma.item.findMany({
        orderBy: { createdAt: "asc" }
    });


    const items = data.map(item => item.name);
    const itemList = items.join(",");

    const prompt = `以下の食材があります：${itemList}
これらを使って作れる料理を3つ提案してください。
料理名と簡単な作り方を教えてください。`

    const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return text;
}

