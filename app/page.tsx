import React from "react";
import {
  Button,
  Card,
  CardBody,
  Spacer,
  Input,
  Tabs,
  Tab,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { SampleWorkflows } from "@/components/home/sample-workflows";
import { FlowchartAnimation } from "@/components/home/flowchart-animation";
import RouteLink from "next/link";



export default function App() {
  return (
    <div className="min-h-screen bg-background  max">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none -z-20"></div>
      <div className="absolute top-0 right-0 w-2/3 h-screen bg-gradient-to-bl from-primary-500/5 via-primary-400/2 to-transparent -z-10"></div>

      <header className="container mx-auto px-6 py-5 max-w-[1200px] mx-auto">
        <nav className="flex items-center justify-between border-b border-default-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg">
              <Icon icon="mdi:turtle" className="text-black text-2xl" />
            </div>
            <span className="font-semibold text-xl tracking-tight">
              KameChan<span className="text-primary font-bold"></span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              color="primary"
              variant="flat"
              className="px-5"
              as={RouteLink}
              href="/get-started"
            >
              <Icon icon="lucide:log-in" className="mr-2" />
              Get Start
            </Button>
          </div>
        </nav>
      </header>

      <main className="max-w-[1200px] mx-auto">
        <section className="container mx-auto px-6 pt-8 pb-16">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 max-w-xl">
              <div className="inline-block px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-medium mb-4">
              Zero-Code Blockchain Automation
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-8 leading-tight tracking-tight">
                Bridging <span className="text-primary font-medium">On-Chain & Off-Chain</span> Operations
              </h1>
              <p className="text-default-600 text-lg mb-12 leading-relaxed">
                KameChan is a natural language-powered automation platform that enables users to create and execute complex workflows without code. Simply describe your task in plain language, and our AI will generate executable processes that seamlessly connect on-chain transactions with off-chain applications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  color="primary"
                  variant="solid"
                  className="shadow-lg shadow-primary/20"
                  as={RouteLink}
                  href="/get-started"
                >
                  Get Started Free
                  <Icon icon="lucide:arrow-right" className="ml-2" />
                </Button>
                <Button size="lg" variant="bordered" className="border-default-200">
                  <Icon icon="lucide:play-circle" className="mr-2" />
                  Watch Demo
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-12">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Icon icon="lucide:code-x" className="text-primary text-xl" />
                  </div>
                  <p className="text-xs font-medium">Zero Code Required</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Icon icon="lucide:shield-check" className="text-primary text-xl" />
                  </div>
                  <p className="text-xs font-medium">Privacy Guaranteed</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Icon icon="lucide:link" className="text-primary text-xl" />
                  </div>
                  <p className="text-xs font-medium">Cross-Chain Integration</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Icon icon="lucide:zap" className="text-primary text-xl" />
                  </div>
                  <p className="text-xs font-medium">AI-Powered Precision</p>
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 to-secondary-500/5 rounded-2xl transform rotate-3 -z-10"></div>
              <FlowchartAnimation />
            </div>
          </div>
        </section>

        <Spacer y={12} />

        <section className="px-8 py-16 bg-gray-50/50 rounded-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-normal mb-4">Integrated Ecosystem</h2>
            <p className="text-default-600 max-w-xl mx-auto">
              Seamlessly connect blockchain operations with off-chain services using our comprehensive integration network
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border border-default-100 shadow-sm" disableRipple>
              <CardBody className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-md bg-primary/5">
                    <Icon icon="lucide:blocks" className="text-primary text-xl" />
                  </div>
                  <h3 className="text-xl font-medium">On-Chain Ecosystem</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="mt-1 text-primary">
                      <Icon icon="lucide:check" width={14} />
                    </div>
                    <p className="text-sm">Major exchanges (Binance, Uniswap) and cross-chain protocols</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-1 text-primary">
                      <Icon icon="lucide:check" width={14} />
                    </div>
                    <p className="text-sm">Multiple blockchains including Sui, Ethereum and DeFi applications</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-1 text-primary">
                      <Icon icon="lucide:check" width={14} />
                    </div>
                    <p className="text-sm">Arbitrage strategies, asset portfolio rebalancing, and risk management</p>
                  </div>
                </div>
              </CardBody>
            </Card>
            
            <Card className="border border-default-100 shadow-sm" disableRipple>
              <CardBody className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-md bg-primary/5">
                    <Icon icon="lucide:cloud" className="text-primary text-xl" />
                  </div>
                  <h3 className="text-xl font-medium">Off-Chain Services</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="mt-1 text-primary">
                      <Icon icon="lucide:check" width={14} />
                    </div>
                    <p className="text-sm">Data analysis tools (Tableau, Dune Analytics) and visualization</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-1 text-primary">
                      <Icon icon="lucide:check" width={14} />
                    </div>
                    <p className="text-sm">Productivity suites (Google Sheets, Notion) for data management</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-1 text-primary">
                      <Icon icon="lucide:check" width={14} />
                    </div>
                    <p className="text-sm">API services and integration platforms (Zapier, Webhooks)</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </section>

        <Spacer y={12} />

        <section className="px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-normal mb-4">How It Works</h2>
            <p className="text-default-600 max-w-xl mx-auto">
              From natural language to executable workflows with AI-powered precision
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: "lucide:message-square-text",
                title: "Describe Your Workflow",
                description: "Use natural language to describe complex tasks in English or Chinese. For example: \"Every Friday, check BTC price on Coinbase, buy ETH on Uniswap if below $30K\""
              },
              {
                icon: "lucide:git-branch",
                title: "AI + Rules Engine",
                description: "Our dual verification system combines AI understanding with a rules engine to ensure precise execution matching your intent without ambiguity."
              },
              {
                icon: "lucide:terminal",
                title: "Secure Execution",
                description: "Deploy workflows with one click. Our decentralized architecture ensures privacy with zero data retention after execution."
              }
            ].map((step, index) => (
              <Card key={index} className="border-none shadow-none bg-transparent" disableRipple>
                <CardBody className="p-6">
                  <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                    <Icon icon={step.icon} className="text-primary text-xl" />
                  </div>
                  <h3 className="text-xl font-medium mb-3">{step.title}</h3>
                  <p className="text-default-600">{step.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
        <Spacer y={12} />
        
        <section className="px-8 py-16 bg-gray-50/50">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-normal mb-4">Sample Workflows</h2>
            <p className="text-default-600 max-w-xl mx-auto">
              Browse our collection of pre-built workflows designed for traders, analysts
            </p>
          </div>
          
          <SampleWorkflows />
        </section>

        <Spacer y={10} />

        <section className="container mx-auto px-8 py-16 relative overflow-hidden">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-normal mb-4">Share and Earn</h2>
            <p className="text-default-600 max-w-xl mx-auto">
              Create and share original workflows to earn platform credits on the SUI blockchain
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="w-full lg:w-1/2 flex justify-center">
              <Card
                className="w-full max-w-lg border-none shadow-md overflow-hidden"
                disableRipple
              >
                <CardBody className="p-0">
                  <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-10">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon
                          icon="lucide:share-2"
                          className="text-primary text-2xl"
                        />
                      </div>
                      <h3 className="text-2xl font-medium text-default-900">
                        Workflow Marketplace
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-8">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <Icon
                            icon="lucide:check-circle"
                            className="text-primary text-lg"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Publish and monetize your custom workflows
                          </p>
                          <p className="text-xs text-default-500 mt-1">
                            Set your own pricing or share for free
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <Icon
                            icon="lucide:check-circle"
                            className="text-primary text-lg"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Earn platform credits on SUI blockchain
                          </p>
                          <p className="text-xs text-default-500 mt-1">
                            Each download or usage generates rewards
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <Icon
                            icon="lucide:check-circle"
                            className="text-primary text-lg"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Build your professional reputation
                          </p>
                          <p className="text-xs text-default-500 mt-1">
                            Showcase your expertise and grow your network
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="py-4 border-t border-default-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-default-400">
                            Current marketplace stats
                          </p>
                          <div className="flex gap-3 mt-2">
                            <div>
                              <p className="text-sm font-semibold">1.2K+</p>
                              <p className="text-xs text-default-500">
                                Workflows
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold">8.5K+</p>
                              <p className="text-xs text-default-500">
                                Downloads
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold">350K+</p>
                              <p className="text-xs text-default-500">
                                Credits earned
                              </p>
                            </div>
                          </div>
                        </div>

                        <Button color="primary" variant="flat" size="sm">
                          <Icon
                            icon="lucide:external-link"
                            width={14}
                            height={14}
                            className="mr-1"
                          />
                          Visit marketplace
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            <div className="w-full lg:w-1/2 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon icon="lucide:globe" className="text-primary text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">
                    Expand Your Reach
                  </h3>
                  <p className="text-default-600 text-sm">
                    Share your workflows with a global community of
                    professionals. Gain visibility and recognition for your
                    innovative solutions while helping others optimize their
                    processes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon icon="lucide:wallet" className="text-primary text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">
                    Blockchain Rewards
                  </h3>
                  <p className="text-default-600 text-sm">
                    Earn platform credits on the SUI blockchain with each share,
                    download, or adoption of your workflows. Transparently track
                    all transactions and boost your earnings through community
                    engagement.
                  </p>
                </div>
              </div>

              {/* <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon icon="lucide:code" className="text-primary text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Developer-Friendly</h3>
                  <p className="text-default-600 text-sm">
                    Access detailed analytics on how your workflows are performing. Get insights on usage patterns and optimize your designs to maximize both utility and rewards.
                  </p>
                </div>
              </div> */}

              {/* <Button size="lg" color="primary" endContent={<Icon icon="lucide:arrow-up-right" />}>
                Start Sharing
              </Button> */}
            </div>
          </div>

          {/* <div className="mt-16 pt-8 border-t border-default-100 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-primary/5 rounded-full">
                <Icon icon="logos:sui" className="text-xl" />
              </div>
              <span className="text-sm text-default-500">Powered by SUI blockchain</span>
            </div>
            
            <div className="flex gap-2">
              <Button variant="flat" size="sm">Learn more</Button>
              <Button variant="bordered" size="sm">View documentation</Button>
            </div>
          </div> */}
          <div className="mt-16 pt-8 border-t border-default-100 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-primary/5 rounded-full">
                <Icon icon="logos:sui" className="text-xl" />
              </div>
              <span className="text-sm text-default-500">Powered by SUI blockchain</span>
            </div>
            
            <div className="flex gap-2">
              <Button variant="flat" size="sm">Learn more</Button>
              <Button variant="bordered" size="sm">View documentation</Button>
            </div>
          </div>
        </section>

        <Spacer y={12} />
      </main>
    </div>
  );
}
