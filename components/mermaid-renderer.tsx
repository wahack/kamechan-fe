import React from "react";
import mermaid from "mermaid";
import panzoom from "panzoom";

interface MermaidRendererProps {
  chart: string;
}

export const MermaidRenderer: React.FC<MermaidRendererProps> = ({ chart }) => {
  const [renderResult, setRenderResult] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const panzoomRef = React.useRef<ReturnType<typeof panzoom> | null>(null);

  React.useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      look: "handDrawn",
      securityLevel: "loose", // 必须宽松模式
      theme: "neutral",
      flowchart: {
        useMaxWidth: false, // 禁用自动宽度限制
      },
      er: {
        useMaxWidth: false,
      },
    });

    const renderChart = async () => {
      if (!chart) return;

      try {
        setError(null);
        const { svg } = await mermaid.render("mermaid-graph", chart);
        setRenderResult(svg);
      } catch (e) {
        console.error("Failed to render mermaid chart:", e);
        setError("Failed to render flowchart. Please check your syntax.");
      }
    };

    renderChart();
  }, [chart]);
  // 初始化缩放功能
  React.useEffect(() => {
    if (!containerRef.current || !renderResult) return;

    const container = containerRef.current;
    const svgElement = container.querySelector("svg");

    if (svgElement) {
      // 清除旧实例
      if (panzoomRef.current) {
        panzoomRef.current.dispose();
      }

      // 初始化新实例
      panzoomRef.current = panzoom(container, {
        maxZoom: 5,
        minZoom: 0.5,
        bounds: true,
        initialX: 300,
        initialY: 500,
        initialZoom: 0.8,
        beforeWheel: (e) => {
          // 允许 Ctrl + 滚轮缩放
          return e.ctrlKey;
        },
      });

      // 添加光标样式切换
      const handleMouseDown = () => (container.style.cursor = "grabbing");
      const handleMouseUp = () => (container.style.cursor = "grab");

      container.addEventListener("mousedown", handleMouseDown);
      container.addEventListener("mouseup", handleMouseUp);

      return () => {
        panzoomRef.current?.dispose();
        container.removeEventListener("mousedown", handleMouseDown);
        container.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [renderResult]);

  if (error) {
    return (
      <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
        {error}
      </div>
    );
  }

  return (
    <div className="mermaid-container pt-30  h-full">
      {renderResult ? (
        <div
          ref={containerRef}
          className="mermaid-svg-container"
          style={{
            overflow: "auto",
            cursor: "grab",
          }}
          dangerouslySetInnerHTML={{ __html: renderResult }}
        />
      ) : (
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-400">Loading flowchart...</div>
        </div>
      )}
    </div>
  );
};
