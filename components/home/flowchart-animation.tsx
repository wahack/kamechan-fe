"use client";
import React, { useEffect } from "react";
import { Card } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Node {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  size: number;
  isMain?: boolean;
  isOnChain?: boolean;
  category?: string;
}

interface Connection {
  from: string;
  to: string;
  isCrossChain?: boolean;
  isKeyFlow?: boolean;
}

export const FlowchartAnimation: React.FC = () => {
  const [animationProgress, setAnimationProgress] = React.useState(0);
  const [highlightedFlow, setHighlightedFlow] = React.useState<string | null>(
    null,
  );

  const nodes: Node[] = [
    {
      id: "center",
      label: "Workflow Engine",
      icon: "lucide:cpu",
      x: 50,
      y: 50,
      size: 60,
      isMain: true,
    },

    {
      id: "data-source",
      label: "Data Sources",
      icon: "lucide:database",
      x: 25,
      y: 30,
      size: 45,
      category: "off-chain",
    },
    {
      id: "ai-service",
      label: "AI Services",
      icon: "lucide:brain",
      x: 25,
      y: 70,
      size: 45,
      category: "off-chain",
    },
    {
      id: "api-gateway",
      label: "API Gateway",
      icon: "lucide:settings",
      x: 15,
      y: 50,
      size: 40,
      category: "off-chain",
    },

    {
      id: "smart-contracts",
      label: "Smart Contracts",
      icon: "lucide:file-code",
      x: 75,
      y: 30,
      size: 45,
      isOnChain: true,
      category: "on-chain",
    },
    {
      id: "defi-protocols",
      label: "DeFi Protocols",
      icon: "lucide:landmark",
      x: 75,
      y: 70,
      size: 45,
      isOnChain: true,
      category: "on-chain",
    },
    {
      id: "wallet-bridge",
      label: "Wallet Bridge",
      icon: "lucide:wallet",
      x: 85,
      y: 50,
      size: 40,
      isOnChain: true,
      category: "on-chain",
    },
  ];

  const connections: Connection[] = [
    { from: "center", to: "data-source" },
    { from: "center", to: "ai-service" },
    { from: "center", to: "api-gateway" },
    { from: "center", to: "smart-contracts" },
    { from: "center", to: "defi-protocols" },
    { from: "center", to: "wallet-bridge" },

    { from: "data-source", to: "ai-service" },
    { from: "api-gateway", to: "data-source" },

    { from: "smart-contracts", to: "defi-protocols" },
    { from: "wallet-bridge", to: "smart-contracts" },

    {
      from: "data-source",
      to: "smart-contracts",
      isCrossChain: true,
      isKeyFlow: true,
    },
    {
      from: "ai-service",
      to: "defi-protocols",
      isCrossChain: true,
      isKeyFlow: true,
    },
    {
      from: "api-gateway",
      to: "wallet-bridge",
      isCrossChain: true,
      isKeyFlow: true,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationProgress((prev) => {
        const newValue = prev + 1.5;
        return newValue > 100 ? 0 : newValue;
      });
    }, 50);

    const highlightInterval = setInterval(() => {
      const crossChainFlows = connections.filter((c) => c.isCrossChain);
      const randomFlow =
        crossChainFlows[Math.floor(Math.random() * crossChainFlows.length)];
      setHighlightedFlow(`${randomFlow.from}-${randomFlow.to}`);

      setTimeout(() => {
        setHighlightedFlow(null);
      }, 1500);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(highlightInterval);
    };
  }, []);

  const getPosition = (node: Node) => {
    return {
      x: node.x * 5,
      y: node.y * 5,
    };
  };

  return (
    <Card
      className="border border-default-100 shadow-sm bg-background"
      disableRipple
    >
      <div className="p-4 overflow-hidden">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full"
          style={{ minHeight: "400px" }}
        >
          <defs>
            <linearGradient
              id="dividerGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="45%" stopColor="#ffffff" />
              <stop offset="55%" stopColor="#f8fafc" />
            </linearGradient>
          </defs>
          <rect
            x="0"
            y="0"
            width="500"
            height="500"
            fill="url(#dividerGradient)"
            opacity="0.8"
          />

          <line
            x1="250"
            y1="100"
            x2="250"
            y2="400"
            stroke="#e2e8f0"
            strokeWidth="1"
            strokeDasharray="5,5"
          />

          <text
            x="125"
            y="80"
            fontSize="14"
            textAnchor="middle"
            fill="#64748b"
            fontWeight="500"
          >
            Off-Chain Services
          </text>
          <text
            x="375"
            y="80"
            fontSize="14"
            textAnchor="middle"
            fill="#64748b"
            fontWeight="500"
          >
            On-Chain Services
          </text>

          {connections.map((connection, index) => {
            const fromNode = nodes.find((n) => n.id === connection.from)!;
            const toNode = nodes.find((n) => n.id === connection.to)!;
            const fromPos = getPosition(fromNode);
            const toPos = getPosition(toNode);

            const isHighlighted =
              highlightedFlow === `${connection.from}-${connection.to}`;
            const isCrossChain = connection.isCrossChain;

            const strokeColor = isHighlighted
              ? "#f97316"
              : isCrossChain
                ? "#8b5cf6"
                : connection.isKeyFlow
                  ? "#F2C94C"
                  : fromNode.isMain || toNode.isMain
                    ? "#94a3b8"
                    : "#e2e8f0";

            const strokeWidth = isHighlighted
              ? 3
              : isCrossChain || connection.isKeyFlow
                ? 2
                : 1.5;

            const strokeOpacity = isHighlighted
              ? 1
              : isCrossChain
                ? 0.8
                : fromNode.isMain || toNode.isMain
                  ? 0.6
                  : 0.4;

            const dashSize = 6;
            const gapSize = 9;

            return (
              <g key={`${connection.from}-${connection.to}`}>
                <path
                  d={`M${fromPos.x},${fromPos.y} L${toPos.x},${toPos.y}`}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  fill="none"
                  opacity={strokeOpacity * 0.4}
                />

                <path
                  d={`M${fromPos.x},${fromPos.y} L${toPos.x},${toPos.y}`}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth * 1.2}
                  fill="none"
                  strokeDasharray={`${dashSize},${gapSize}`}
                  strokeDashoffset={-animationProgress * 2}
                  opacity={strokeOpacity * 1.2}
                  style={{
                    filter: isHighlighted
                      ? "drop-shadow(0 0 3px rgba(249, 115, 22, 0.5))"
                      : "none",
                  }}
                />
              </g>
            );
          })}

          {nodes.map((node) => {
            const pos = getPosition(node);

            const fillColor = node.isMain
              ? "#FEF9E7"
              : node.isOnChain
                ? "#eff6ff"
                : "#ffffff";

            const strokeColor = node.isMain
              ? "#F2C94C"
              : node.isOnChain
                ? "#3b82f6"
                : "#94a3b8";

            const iconColor = node.isMain
              ? "text-yellow-500"
              : node.isOnChain
                ? "text-blue-500"
                : "text-slate-500";

            return (
              <g key={node.id} className="group">
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={node.size / 2}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={node.isMain ? 2.5 : 2}
                  className={node.isMain ? "animate-pulse" : ""}
                />

                <foreignObject
                  x={pos.x - node.size / 4}
                  y={pos.y - node.size / 4}
                  width={node.size / 2}
                  height={node.size / 2}
                  className="pointer-events-none"
                >
                  <div className="h-full flex items-center justify-center">
                    <Icon
                      icon={node.icon}
                      className={`${iconColor} text-2xl`}
                    />
                  </div>
                </foreignObject>

                <foreignObject
                  x={pos.x - 70}
                  y={pos.y + node.size / 2 + 5}
                  width={140}
                  height={40}
                  className={`pointer-events-none ${node.isMain ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}
                >
                  <div
                    className={`text-center text-xs ${node.isOnChain ? "text-blue-600" : node.isMain ? "text-amber-600" : "text-slate-600"} bg-white bg-opacity-90 px-3 py-2 rounded-md`}
                  >
                    {node.label}
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>
    </Card>
  );
};
