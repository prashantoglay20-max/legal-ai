import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_URL = "https://api.deepseek.ai/v1/chat/completions";
const DEEPSEEK_MODEL = "deepseek-chat";

async function queryDeepseek(contractText: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error("Deepseek API key 未配置，请设置环境变量 DEEPSEEK_API_KEY。");
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: [
        {
          role: "system",
          content:
            "你是一个专业的中文合同审查助手，擅长根据合同文本识别高风险、中风险和低风险条款，并给出简洁明了的审查结论。",
        },
        {
          role: "user",
          content: `请根据以下合同文本进行风险分析，输出中文审查报告。报告应包含高风险、中风险、低风险条款，并参考《中华人民共和国民法典》相关法律要求。

合同内容：\n${contractText}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 1500,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error?.message || JSON.stringify(result));
  }

  const report =
    result.choices?.[0]?.message?.content || result.choices?.[0]?.text || "";

  return report.trim();
}

export async function POST(req: NextRequest) {
  const { contractText } = await req.json();

  if (!contractText) {
    return NextResponse.json({ error: "合同文本不能为空" }, { status: 400 });
  }

  try {
    const report = await queryDeepseek(contractText);
    return NextResponse.json({ report });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `模型分析失败：${error.message}`
            : "模型分析失败",
      },
      { status: 500 }
    );
  }
}
