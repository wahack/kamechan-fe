The web interface section of [https://app.kamechan.xyz]

This is a small part of the code open for hackerson and has not yet been fully open-sourced.

The workflow engine part is under heavy development, and not open sourced yet 

**Architecture**

```mermaid
graph TD
    A[Frontend] -->|User Input| B(Frontend Server)
    subgraph Frontend Server
        B --> C{AI Agent}
    end
    C -->|Analyze needs| D[(Pre-trained DB Service)]
    D -->|Node usage docs| C
    C -->|Build workflow data| E[Hybrid Workflow Engine]
    
    subgraph F["Web2/Web3 Service Nodes"]
        F1[Web2 Services]
        F2[Web3 Services]
    end

    E -->|Orchestrate| F
    F -->|Results| E
    E -->|Execution output| B
    B -->|Final results| A
```
