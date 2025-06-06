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
import type { BamlRuntime, FunctionResult, BamlCtxManager, Image, Audio, ClientRegistry, Collector } from "@boundaryml/baml"
import { toBamlError, type HTTPRequest } from "@boundaryml/baml"
import type { Checked, Check, RecursivePartialNull as MovedRecursivePartialNull } from "./types"
import type * as types from "./types"
import type {BCon, BNodeConnection, BNodeConnectionNode, BWorkflowNodes, BWorkflowNodesParams, ChatClassification, DynamicData, LookupNodeDocTool, Message, N8nWorkflow, NodeExecuteTool, RequirementsNodesResult, Role, ThinkTool, WorkflowBuilt, WorkflowIntention, WorkflowNodeDocs} from "./types"
import type TypeBuilder from "./type_builder"
import { HttpRequest, HttpStreamRequest } from "./sync_request"
import { LlmResponseParser, LlmStreamParser } from "./parser"
import { DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX, DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_RUNTIME } from "./globals"

/**
 * @deprecated Use RecursivePartialNull from 'baml_client/types' instead.
 * Example:
 * ```ts
 * import { RecursivePartialNull } from './baml_client/types'
 * ```
 */
export type RecursivePartialNull<T> = MovedRecursivePartialNull<T>;

type BamlCallOptions = {
  tb?: TypeBuilder
  clientRegistry?: ClientRegistry
  collector?: Collector | Collector[]
}

export class BamlSyncClient {
  private httpRequest: HttpRequest
  private httpStreamRequest: HttpStreamRequest
  private llmResponseParser: LlmResponseParser
  private llmStreamParser: LlmStreamParser
  private bamlOptions: BamlCallOptions

  constructor(private runtime: BamlRuntime, private ctxManager: BamlCtxManager, private bamlOptions?: BamlCallOptions) {
    this.httpRequest = new HttpRequest(runtime, ctxManager)
    this.httpStreamRequest = new HttpStreamRequest(runtime, ctxManager)
    this.llmResponseParser = new LlmResponseParser(runtime, ctxManager)
    this.llmStreamParser = new LlmStreamParser(runtime, ctxManager)
    this.bamlOptions = bamlOptions || {}
  }

  withOptions(bamlOptions: BamlCallOptions) {
    return new BamlSyncClient(this.runtime, this.ctxManager, bamlOptions)
  }

  /*
  * @deprecated NOT IMPLEMENTED as streaming must by async. We
  * are not providing an async version as we want to reserve the
  * right to provide a sync version in the future.
  */
  get stream() {
    throw new Error("stream is not available in BamlSyncClient. Use `import { b } from 'baml_client/async_client")
  }

  get request() {
    return this.httpRequest
  }

  get streamRequest() {
    return this.httpStreamRequest
  }

  get parse() {
    return this.llmResponseParser
  }

  get parseStream() {
    return this.llmStreamParser
  }

  
  ClassifyMessage(
      messages: Message[],
      __baml_options__?: BamlCallOptions
  ): ChatClassification {
    try {
      const options = { ...this.bamlOptions, ...(__baml_options__ || {}) }
      const collector = options.collector ? (Array.isArray(options.collector) ? options.collector : [options.collector]) : [];
      const raw = this.runtime.callFunctionSync(
        "ClassifyMessage",
        {
          "messages": messages
        },
        this.ctxManager.cloneContext(),
        options.tb?.__tb(),
        options.clientRegistry,
        collector,
      )
      return raw.parsed(false) as ChatClassification
    } catch (error: any) {
      throw toBamlError(error);
    }
  }
  
  FixdWorkflow(
      messages: Message[],outputExamples: string[],workflow: string,errorMessage: string,services: WorkflowNodeDocs[],nodesDoc: string,
      __baml_options__?: BamlCallOptions
  ): LookupNodeDocTool | NodeExecuteTool | WorkflowBuilt {
    try {
      const options = { ...this.bamlOptions, ...(__baml_options__ || {}) }
      const collector = options.collector ? (Array.isArray(options.collector) ? options.collector : [options.collector]) : [];
      const raw = this.runtime.callFunctionSync(
        "FixdWorkflow",
        {
          "messages": messages,"outputExamples": outputExamples,"workflow": workflow,"errorMessage": errorMessage,"services": services,"nodesDoc": nodesDoc
        },
        this.ctxManager.cloneContext(),
        options.tb?.__tb(),
        options.clientRegistry,
        collector,
      )
      return raw.parsed(false) as LookupNodeDocTool | NodeExecuteTool | WorkflowBuilt
    } catch (error: any) {
      throw toBamlError(error);
    }
  }
  
  GenerateN8n(
      messages: Message[],services: WorkflowNodeDocs[],shots: string[],
      __baml_options__?: BamlCallOptions
  ): LookupNodeDocTool | NodeExecuteTool | N8nWorkflow {
    try {
      const options = { ...this.bamlOptions, ...(__baml_options__ || {}) }
      const collector = options.collector ? (Array.isArray(options.collector) ? options.collector : [options.collector]) : [];
      const raw = this.runtime.callFunctionSync(
        "GenerateN8n",
        {
          "messages": messages,"services": services,"shots": shots
        },
        this.ctxManager.cloneContext(),
        options.tb?.__tb(),
        options.clientRegistry,
        collector,
      )
      return raw.parsed(false) as LookupNodeDocTool | NodeExecuteTool | N8nWorkflow
    } catch (error: any) {
      throw toBamlError(error);
    }
  }
  
  ParseN8n(
      str: string,
      __baml_options__?: BamlCallOptions
  ): N8nWorkflow {
    try {
      const options = { ...this.bamlOptions, ...(__baml_options__ || {}) }
      const collector = options.collector ? (Array.isArray(options.collector) ? options.collector : [options.collector]) : [];
      const raw = this.runtime.callFunctionSync(
        "ParseN8n",
        {
          "str": str
        },
        this.ctxManager.cloneContext(),
        options.tb?.__tb(),
        options.clientRegistry,
        collector,
      )
      return raw.parsed(false) as N8nWorkflow
    } catch (error: any) {
      throw toBamlError(error);
    }
  }
  
  RequirementsFlowchart(
      messages: Message[],services: WorkflowNodeDocs[],outputExamples: string[],
      __baml_options__?: BamlCallOptions
  ): ThinkTool | LookupNodeDocTool | NodeExecuteTool | WorkflowIntention {
    try {
      const options = { ...this.bamlOptions, ...(__baml_options__ || {}) }
      const collector = options.collector ? (Array.isArray(options.collector) ? options.collector : [options.collector]) : [];
      const raw = this.runtime.callFunctionSync(
        "RequirementsFlowchart",
        {
          "messages": messages,"services": services,"outputExamples": outputExamples
        },
        this.ctxManager.cloneContext(),
        options.tb?.__tb(),
        options.clientRegistry,
        collector,
      )
      return raw.parsed(false) as ThinkTool | LookupNodeDocTool | NodeExecuteTool | WorkflowIntention
    } catch (error: any) {
      throw toBamlError(error);
    }
  }
  
  RequirementsNodes(
      messages: Message[],services: WorkflowNodeDocs[],
      __baml_options__?: BamlCallOptions
  ): RequirementsNodesResult {
    try {
      const options = { ...this.bamlOptions, ...(__baml_options__ || {}) }
      const collector = options.collector ? (Array.isArray(options.collector) ? options.collector : [options.collector]) : [];
      const raw = this.runtime.callFunctionSync(
        "RequirementsNodes",
        {
          "messages": messages,"services": services
        },
        this.ctxManager.cloneContext(),
        options.tb?.__tb(),
        options.clientRegistry,
        collector,
      )
      return raw.parsed(false) as RequirementsNodesResult
    } catch (error: any) {
      throw toBamlError(error);
    }
  }
  
}

export const b = new BamlSyncClient(DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_RUNTIME, DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX)