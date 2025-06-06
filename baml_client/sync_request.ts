/*************************************************************************************************

Welcome to Baml! To use this generated code, please run one of the following:

$ npm install @boundaryml/baml
$ yarn add @boundaryml/baml
$ pnpm add @boundaryml/baml

*************************************************************************************************/

// This file was generated by BAML: do not edit it. Instead, edit the BAML
// files and re-generate this code.
//
/* eslint-disable */
// tslint:disable
// @ts-nocheck
// biome-ignore format: autogenerated code
import type { BamlRuntime, BamlCtxManager, ClientRegistry, Image, Audio } from "@boundaryml/baml"
import { toBamlError, HTTPRequest } from "@boundaryml/baml"
import type { Checked, Check } from "./types"
import type * as types from "./types"
import type {BCon, BNodeConnection, BNodeConnectionNode, BWorkflowNodes, BWorkflowNodesParams, ChatClassification, DynamicData, LookupNodeDocTool, Message, N8nWorkflow, NodeExecuteTool, RequirementsNodesResult, Role, ThinkTool, WorkflowBuilt, WorkflowIntention, WorkflowNodeDocs} from "./types"
import type TypeBuilder from "./type_builder"

type BamlCallOptions = {
  tb?: TypeBuilder
  clientRegistry?: ClientRegistry
}

export class HttpRequest {
  constructor(private runtime: BamlRuntime, private ctxManager: BamlCtxManager) {}

  
  ClassifyMessage(
      messages: Message[],
      __baml_options__?: BamlCallOptions
  ): HTTPRequest {
    try {
      return this.runtime.buildRequestSync(
        "ClassifyMessage",
        {
          "messages": messages
        },
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        false,
      )
    } catch (error) {
      throw toBamlError(error);
    }
  }
  
  FixdWorkflow(
      messages: Message[],outputExamples: string[],workflow: string,errorMessage: string,services: WorkflowNodeDocs[],nodesDoc: string,
      __baml_options__?: BamlCallOptions
  ): HTTPRequest {
    try {
      return this.runtime.buildRequestSync(
        "FixdWorkflow",
        {
          "messages": messages,"outputExamples": outputExamples,"workflow": workflow,"errorMessage": errorMessage,"services": services,"nodesDoc": nodesDoc
        },
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        false,
      )
    } catch (error) {
      throw toBamlError(error);
    }
  }
  
  GenerateN8n(
      messages: Message[],services: WorkflowNodeDocs[],shots: string[],
      __baml_options__?: BamlCallOptions
  ): HTTPRequest {
    try {
      return this.runtime.buildRequestSync(
        "GenerateN8n",
        {
          "messages": messages,"services": services,"shots": shots
        },
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        false,
      )
    } catch (error) {
      throw toBamlError(error);
    }
  }
  
  ParseN8n(
      str: string,
      __baml_options__?: BamlCallOptions
  ): HTTPRequest {
    try {
      return this.runtime.buildRequestSync(
        "ParseN8n",
        {
          "str": str
        },
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        false,
      )
    } catch (error) {
      throw toBamlError(error);
    }
  }
  
  RequirementsFlowchart(
      messages: Message[],services: WorkflowNodeDocs[],outputExamples: string[],
      __baml_options__?: BamlCallOptions
  ): HTTPRequest {
    try {
      return this.runtime.buildRequestSync(
        "RequirementsFlowchart",
        {
          "messages": messages,"services": services,"outputExamples": outputExamples
        },
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        false,
      )
    } catch (error) {
      throw toBamlError(error);
    }
  }
  
  RequirementsNodes(
      messages: Message[],services: WorkflowNodeDocs[],
      __baml_options__?: BamlCallOptions
  ): HTTPRequest {
    try {
      return this.runtime.buildRequestSync(
        "RequirementsNodes",
        {
          "messages": messages,"services": services
        },
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        false,
      )
    } catch (error) {
      throw toBamlError(error);
    }
  }
  
}

export class HttpStreamRequest {
  constructor(private runtime: BamlRuntime, private ctxManager: BamlCtxManager) {}

  
  ClassifyMessage(
      messages: Message[],
      __baml_options__?: BamlCallOptions
  ): HTTPRequest {
    try {
      return this.runtime.buildRequestSync(
        "ClassifyMessage",
        {
          "messages": messages
        },
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        true,
      )
    } catch (error) {
      throw toBamlError(error);
    }
  }
  
  FixdWorkflow(
      messages: Message[],outputExamples: string[],workflow: string,errorMessage: string,services: WorkflowNodeDocs[],nodesDoc: string,
      __baml_options__?: BamlCallOptions
  ): HTTPRequest {
    try {
      return this.runtime.buildRequestSync(
        "FixdWorkflow",
        {
          "messages": messages,"outputExamples": outputExamples,"workflow": workflow,"errorMessage": errorMessage,"services": services,"nodesDoc": nodesDoc
        },
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        true,
      )
    } catch (error) {
      throw toBamlError(error);
    }
  }
  
  GenerateN8n(
      messages: Message[],services: WorkflowNodeDocs[],shots: string[],
      __baml_options__?: BamlCallOptions
  ): HTTPRequest {
    try {
      return this.runtime.buildRequestSync(
        "GenerateN8n",
        {
          "messages": messages,"services": services,"shots": shots
        },
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        true,
      )
    } catch (error) {
      throw toBamlError(error);
    }
  }
  
  ParseN8n(
      str: string,
      __baml_options__?: BamlCallOptions
  ): HTTPRequest {
    try {
      return this.runtime.buildRequestSync(
        "ParseN8n",
        {
          "str": str
        },
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        true,
      )
    } catch (error) {
      throw toBamlError(error);
    }
  }
  
  RequirementsFlowchart(
      messages: Message[],services: WorkflowNodeDocs[],outputExamples: string[],
      __baml_options__?: BamlCallOptions
  ): HTTPRequest {
    try {
      return this.runtime.buildRequestSync(
        "RequirementsFlowchart",
        {
          "messages": messages,"services": services,"outputExamples": outputExamples
        },
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        true,
      )
    } catch (error) {
      throw toBamlError(error);
    }
  }
  
  RequirementsNodes(
      messages: Message[],services: WorkflowNodeDocs[],
      __baml_options__?: BamlCallOptions
  ): HTTPRequest {
    try {
      return this.runtime.buildRequestSync(
        "RequirementsNodes",
        {
          "messages": messages,"services": services
        },
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        true,
      )
    } catch (error) {
      throw toBamlError(error);
    }
  }
  
}