// lib/ai/huggingface.ts
import "pdf-parse/worker";

import OpenAI from "openai";
import { PDFParse, VerbosityLevel } from "pdf-parse";

import env from "@/utils/env";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: env.OPENROUTER_API_KEY,
});

// 从 PDF URL 提取文本
export async function extractPdfText(pdfUrl: string): Promise<string> {
  try {
    const parser = await new PDFParse({
      url: pdfUrl,
      verbosity: VerbosityLevel.WARNINGS,
    });
    const result = await parser.getText();
    await parser.destroy();
    return result.text;
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    throw error;
  }
}

// 生成简历摘要
export async function generateResumeSummary(resumeText: string) {
  try {
    const userContent = `请分析以下简历内容,生成一个简洁专业的中文摘要(200-300字),包括:
1. 个人背景
2. 核心技能(3-5项)
3. 工作经验亮点
4. 教育背景

简历内容:
${resumeText}

请用简洁专业的语言总结,并最终给我一份Markdown格式的摘要。`;

    const response = await client.chat.completions.create({
      model: "xiaomi/mimo-v2-flash:free",
      messages: [
        {
          role: "system",
          content:
            "你是一个专业的简历摘要生成器，擅长提取关键信息并生成简洁的中文摘要。",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    return response.choices[0].message;
  } catch (error) {
    console.error("Error generating summary:", error);
    throw error;
  }
}
