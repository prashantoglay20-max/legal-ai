"use client";

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import FileUploader from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const [contractText, setContractText] = useState<string>("");
  const [region, setRegion] = useState("CN");
  const [file, setFile] = useState<File | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [riskReport, setRiskReport] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (riskReport) {
      const history = JSON.parse(localStorage.getItem("contractHistory") || "[]");
      history.unshift({
        id: Date.now(),
        date: new Date().toLocaleString(),
        report: riskReport,
      });
      localStorage.setItem("contractHistory", JSON.stringify(history.slice(0, 5)));
    }
  }, [riskReport]);

  const handleAnalyze = async () => {
    if (!contractText.trim()) {
      alert("请先上传合同文件");
      return;
    }

    setIsLoading(true);
    setRiskReport("");
    setError("");

    try {
      const response = await fetch("/api/analyze-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractText, region }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "分析失败");
      }

      const data = await response.json();
      setRiskReport(data.report);
    } catch (err) {
      setError("❌ 分析出错：" + (err instanceof Error ? err.message : "未知错误"));
    } finally {
      setIsLoading(false);
    }
  };

  const exportToPdf = () => {
    const element = document.getElementById("report-content");
    if (!element) return;

    const doc = new jsPDF();
    const text = element.innerText || "";
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 10, 10);
    doc.save("合同风险报告.pdf");
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      {/* 导航栏 */}
      <div className="mb-8 pb-6 border-b border-gray-300">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">合同风险审查助手</h1>
          <a
            href="/health-diary"
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
          >
            📔 健康日记
          </a>
        </div>
        <p className="text-gray-600 mt-2">专业的智能合同分析与风险评估平台</p>
      </div>

      <FileUploader
        key={resetKey}
        onFileSelect={(text, file) => {
          setContractText(text);
          setFile(file);
        }}
      />

      {contractText && (
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="min-w-fit"
          >
            {isLoading ? "分析中..." : "开始审查"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setContractText("");
              setRiskReport("");
              setFile(null);
              setError("");
              setResetKey((prev) => prev + 1);
            }}
          >
            重新上传
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="mt-4 flex items-center text-blue-600">
          <Spinner className="mr-2" /> 正在分析合同，请稍候...
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
          ❌ {error}
        </div>
      )}

      {riskReport && (
        <Card className="mt-6 p-6 shadow-lg">
          <div id="report-content">
            <h2 className="text-xl font-bold mb-4">风险审查报告</h2>
            <Accordion type="single" collapsible>
              {riskReport.split("\n").map((item, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger>{item.slice(0, 30)}...</AccordionTrigger>
                  <AccordionContent>{item}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="destructive">高风险</Badge>
            <Badge variant="warning">中风险</Badge>
            <Badge variant="outline">低风险</Badge>
            <Button type="button" variant="outline" onClick={exportToPdf}>
              导出 PDF
            </Button>
          </div>
        </Card>
      )}
    </main>
  );
}
