import { NextRequest, NextResponse } from "next/server";

const RISK_KEYWORDS = [
  { keyword: "单方面解除", level: "高", reason: "可能剥夺对方权利" },
  { keyword: "无限责任", level: "高", reason: "风险不可控" },
  { keyword: "违约金过高", level: "中", reason: "可能被法院调整" },
  { keyword: "不可抗力", level: "低", reason: "合理免责条款" },
];

export async function POST(req: NextRequest) {
  const { contractText } = await req.json();

  if (!contractText) {
    return NextResponse.json({ error: "合同文本不能为空" }, { status: 400 });
  }

  const findings = RISK_KEYWORDS.filter((item) =>
    contractText.includes(item.keyword)
  ).map((item) => ({
    ...item,
    context: contractText.substring(
      Math.max(0, contractText.indexOf(item.keyword) - 20),
      Math.min(contractText.length, contractText.indexOf(item.keyword) + item.keyword.length + 20)
    ),
  }));

  const highRiskCount = findings.filter((f) => f.level === "高").length;
  const mediumRiskCount = findings.filter((f) => f.level === "中").length;

  const report = `
📊 合同风险分析报告：

- 高风险条款：${highRiskCount} 条
- 中风险条款：${mediumRiskCount} 条
- 低风险条款：${findings.length - highRiskCount - mediumRiskCount} 条

📌 详细风险点：
${findings
    .map(
      (f) => `- [${f.level.toUpperCase()}] ${f.keyword}：${f.reason}\n  上下文：${f.context}`
    )
    .join("\n\n")}
  `;

  return NextResponse.json({ report });
}
