import { NextRequest, NextResponse } from "next/server";

const RISK_KEYWORDS = [
  { keyword: "单方面解除", level: "高", reason: "可能剥夺对方权利" },
  { keyword: "无限责任", level: "高", reason: "风险不可控" },
  { keyword: "违约金过高", level: "中", reason: "可能被法院调整" },
  { keyword: "不可抗力", level: "低", reason: "合理免责条款" },
  { keyword: "违约", level: "中", reason: "违约责任条款" },
  { keyword: "赔偿", level: "中", reason: "赔偿责任" },
  { keyword: "罚款", level: "中", reason: "罚款条款" },
  { keyword: "仲裁", level: "低", reason: "争议解决方式" },
  { keyword: "诉讼", level: "中", reason: "可能导致诉讼" },
  { keyword: "保密", level: "低", reason: "保密义务" },
  { keyword: "知识产权", level: "中", reason: "知识产权保护" },
  { keyword: "管辖", level: "低", reason: "管辖地约定" },
  { keyword: "终止", level: "中", reason: "合同终止条件" },
  { keyword: "变更", level: "中", reason: "合同变更条款" },
  { keyword: "保密协议", level: "低", reason: "保密协议" },
  { keyword: "非竞争", level: "中", reason: "竞业限制" },
  { keyword: "竞业限制", level: "中", reason: "竞业限制条款" },
  { keyword: "赔偿责任", level: "中", reason: "赔偿责任" },
  { keyword: "免责条款", level: "低", reason: "免责条款" },
  { keyword: "担保", level: "中", reason: "担保条款" },
  { keyword: "抵押", level: "高", reason: "抵押担保" },
  { keyword: "质押", level: "高", reason: "质押担保" },
  { keyword: "优先权", level: "中", reason: "优先权条款" },
  { keyword: "不可撤销", level: "高", reason: "不可撤销承诺" },
  { keyword: "排他性", level: "中", reason: "排他性条款" },
  { keyword: "自动续约", level: "中", reason: "自动续约条款" },
  { keyword: "违约责任", level: "中", reason: "违约责任" },
  { keyword: "损失赔偿", level: "中", reason: "损失赔偿" },
  { keyword: "民事责任", level: "中", reason: "民事责任条款" },
  { keyword: "诉讼时效", level: "低", reason: "诉讼时效规定" },
  { keyword: "物权", level: "中", reason: "物权相关条款" },
  { keyword: "合同效力", level: "高", reason: "合同效力问题" },
  { keyword: "意思表示", level: "中", reason: "意思表示条款" },
  { keyword: "代理", level: "中", reason: "代理关系" },
  { keyword: "期间计算", level: "低", reason: "期间计算规则" },
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
📊 合同风险分析报告（参考《中华人民共和国民法典》）：

- 高风险条款：${highRiskCount} 条
- 中风险条款：${mediumRiskCount} 条
- 低风险条款：${findings.length - highRiskCount - mediumRiskCount} 条

📌 详细风险点：
${findings
    .map(
      (f) => `- [${f.level.toUpperCase()}] ${f.keyword}：${f.reason}\n  上下文：${f.context}`
    )
    .join("\n\n")}

📖 法律参考：
- 请对照《中华人民共和国民法典》相关条款检查合同合规性
- 重点关注民事法律行为效力、合同订立与履行、违约责任等章节
- 建议咨询专业律师进行全面审查
  `;

  return NextResponse.json({ report });
}
