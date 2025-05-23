import React from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import RouteLink from "next/link";

export const SampleWorkflows: React.FC = () => {
  // const workflows = [
  //   {
  //     title: "Cross-Exchange Arbitrage",
  //     description: "Monitors price differences between exchanges and executes trades automatically when profitable",
  //     tags: ["trading", "arbitrage"],
  //     steps: 7,
  //     complexity: "medium",
  //     icon: "lucide:bar-chart-2",
  //     colorClass: "text-primary",
  //     bgClass: "bg-primary/10",
  //     userType: "Trader"
  //   },
  //   {
  //     title: "Blockchain Data Analytics",
  //     description: "Extracts on-chain data, processes it, and generates reports in BI tools on a scheduled basis",
  //     tags: ["data", "analytics"],
  //     steps: 6,
  //     complexity: "medium",
  //     icon: "lucide:pie-chart",
  //     colorClass: "text-warning",
  //     bgClass: "bg-warning/10",
  //     userType: "Analyst"
  //   },
  //   {
  //     title: "Customer Behavior Analysis",
  //     description: "Correlates off-chain user behavior with on-chain addresses to trigger targeted marketing campaigns",
  //     tags: ["marketing", "analytics"],
  //     steps: 8,
  //     complexity: "complex",
  //     icon: "lucide:users",
  //     colorClass: "text-success",
  //     bgClass: "bg-success/10",
  //     userType: "Enterprise"
  //   },
  //   {
  //     title: "DAO Treasury Management",
  //     description: "Monitors multi-sig wallet fund movements and initiates governance votes when thresholds are exceeded",
  //     tags: ["governance", "monitoring"],
  //     steps: 5,
  //     complexity: "medium",
  //     icon: "lucide:landmark",
  //     colorClass: "text-secondary",
  //     bgClass: "bg-secondary/10",
  //     userType: "DAO"
  //   }
  const workflows = [
    {
      "title": "AMM Position Rebalancing Workflow",
      "description": "maintains optimal liquidity exposure by recalculating positions when prices move beyond `currentPrice ± ATR` threshold, with Telegram notifications for significant protocol changes.",
      "id": "22eb2285-984b-4f8a-ad62-ec4c2ee63664",
      "nodes": [
        {
          "nodeName": "bluefin",
          "logoUrl": "https://kamechanai.s3.ap-northeast-1.amazonaws.com/bluefin.svg"
        },
        {
          "nodeName": "cetus",
          "logoUrl": "https://archive.cetus.zone/assets/image/sui/cetus.png"
        },
        {
          "nodeName": "sui",
          "logoUrl": "https://kamechanai.s3.ap-northeast-1.amazonaws.com/sui.svg"
        },
        {
          "nodeName": "telegramSdk",
          "logoUrl": "https://kamechanai.s3.ap-northeast-1.amazonaws.com/telegram.svg"
        }
      ],
      icon: "mdi:scale-balance",
      colorClass: "text-primary",
      bgClass: "bg-primary/10",
      "user": {
        "name": "wahack"
      }
    },
    {
      "title": "Navi Health Factor Maintenance ",
      "description": "monitors Navi Protocol's health factor, triggers cross-protocol collateral rebalancing using AlphaLend liquidity when falling below 1.2 threshold, executes secured transactions on Sui blockchain, and sends email confirmations for risk-managed position maintenance.",
      "id": "be166250-3923-4b53-bba9-62d51dc296b8",
      "nodes": [
        {
          "nodeName": "sui",
          "logoUrl": "https://kamechanai.s3.ap-northeast-1.amazonaws.com/sui.svg"
        },
        {
          "nodeName": "navi",
          "logoUrl": "https://kamechanai.s3.ap-northeast-1.amazonaws.com/navx.svg"
        },
        {
          "nodeName": "alphaLend",
          "logoUrl": "https://kamechanai.s3.ap-northeast-1.amazonaws.com/alphafi.svg"
        },
        {
          "nodeName": "sendMail",
          "logoUrl": "https://kamechanai.s3.ap-northeast-1.amazonaws.com/email.svg"
        }
      ],
      icon: "mdi:heart-pulse",
      colorClass: "text-warning",
      bgClass: "bg-warning/10",
      "user": {
        "name": "wahack"
      }
    },
    {
      "title": "Cross-Exchange Arbitrage System",
      "description": "monitors Binance-Cetus price spreads, executes cross-market SUI/USDC trades when exceeding 0.01 USDC differential, and settles via encrypted API transactions on Sui blockchain with non-custodial asset management for secure profit capture.",
      "id": "803889ed-ccaa-4137-bd2c-8542add0c08a",
      "nodes": [
        {
          "nodeName": "cetus",
          "logoUrl": "https://archive.cetus.zone/assets/image/sui/cetus.png"
        },
        {
          "nodeName": "binance",
          "logoUrl": "https://kamechanai.s3.ap-northeast-1.amazonaws.com/binanceApi.svg"
        },
        {
          "nodeName": "sui",
          "logoUrl": "https://kamechanai.s3.ap-northeast-1.amazonaws.com/sui.svg"
        }
      ],
      icon: "carbon:arrows-horizontal",
      colorClass: "text-success",
      bgClass: "bg-success/10",
      "user": {
        "name": "wahack"
      }
    },
    {
      "title": "Cross-Platform Leveraged Loop Strategy",
      "description": "This cross-protocol leverage system orchestrates dual 70% LTV collateralization across AlphaLend (coinA→coinB) and Navi (coinB→coinA) using Sui SDK's BCS transaction packaging and cryptographic signing to achieve 2.89× leveraged exposure while maintaining risk-controlled positions through automated protocol-layer calculations.",
      "id": "6b85ac75-5ba3-41e1-b5f7-3d80d9a1ac90",
      "nodes": [
        {
          "nodeName": "alphaLend",
          "logoUrl": "https://kamechanai.s3.ap-northeast-1.amazonaws.com/alphafi.svg"
        },
        {
          "nodeName": "navi",
          "logoUrl": "https://kamechanai.s3.ap-northeast-1.amazonaws.com/navx.svg"
        },
        {
          "nodeName": "sui",
          "logoUrl": "https://kamechanai.s3.ap-northeast-1.amazonaws.com/sui.svg"
        }
      ],
      icon: "mdi:rocket-launch",
      colorClass: "text-secondary",
      bgClass: "bg-secondary/10",
      "user": {
        "name": "wahack"
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {workflows.map((workflow, index) => (
        <Card key={index} disableRipple isPressable>
          <CardBody className="p-6">
            <div className={`w-12 h-12 rounded-full ${workflow.bgClass} flex items-center justify-center mb-4`}>
              <Icon icon={workflow.icon} className={`${workflow.colorClass} text-2xl`} />
            </div>

            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{workflow.title}</h3>
            </div>

            <p className="text-default-500 text-sm mb-4 line-clamp-4">{workflow.description}</p>

            <div className="flex flex-wrap gap-1 mb-4">
              {workflow.nodes.map(node => (
                <div key={node.nodeName} className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
                  <img src={node.logoUrl} alt={node.nodeName} className="w-5 h-5 object-cover rounded-full" />
                </div>
              ))}
            </div>

            {/* <div className="flex justify-between items-center text-sm text-default-500 mb-4">
              <div className="flex items-center gap-1">
                <Icon icon="lucide:git-branch" width={14} />
                <span>{workflow.steps} steps</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon icon="lucide:layers" width={14} />
                <span>Complexity: {workflow.complexity}</span>
              </div>
            </div> */}

            <div className="mt-auto text-right">
              {/* <Button size="sm" variant="flat">
                <Icon icon="lucide:eye" className="mr-1" width={14} />
                Preview
              </Button> */}
              <Button size="sm" color="primary" as={RouteLink} href={"/workflow/"+workflow.id}>
                <Icon icon="lucide:copy" className="mr-1" width={14} />
                Use
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}

      <Card className="border border-dashed border-default-200 shadow-none bg-transparent">
        <CardBody className="p-8 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center mb-6">
            <Icon icon="lucide:plus" className="text-primary text-xl" />
          </div>

          <h3 className="text-xl font-medium mb-2">Create Custom</h3>
          <p className="text-default-600 text-sm mb-8">
            Build a workflow with AI
          </p>

          <Button color="primary" variant="flat" size="sm" as={RouteLink} href={"/workflow/build"}>
            Create New
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};