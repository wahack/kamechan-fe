import { jsonrepair } from "jsonrepair";
import dirtyJson from 'dirty-json';

// parse json from llm
export function parseJson(str: string) {
  if (typeof(str) !== 'string') return str;
  try {
    str = jsonrepair(str);
    
    return JSON.parse(str);
  }catch(e) {
    return dirtyJson.parse(str)
  }
}

// console.log(parseJson("{nodes: [{parameters: {inputSource: passthrough}, type: n8n-nodes-base.executeWorkflowTrigger, name: Start, typeVersion: 1.1}, {parameters: {params: {\"walletAddress\":{\"type\":\"string\"},\"action\":\"userConfig\"}}, type: n8n-nodes-kamechan.userInteraction, name: config, notes: Prompt user for wallet address}, {parameters: {params: ={\n  \"action\": \"getAllTokenBalances\",\n  \"accountAddress\": \"{{ $('config').item.json.result.walletAddress }}\"\n}}, type: n8n-nodes-kamechan.sui, name: get_balances, notes: Query balances for specified address}, {parameters: {functionCode: return [{\n  json: {\n    formattedBalances: $items('get_balances')[0].json.result.map(balance => ({\n      coinType: balance.coinType,\n      balance: balance.balance,\n      symbol: balance.metadata.symbol,\n      name: balance.metadata.name,\n      decimals: balance.metadata.decimals\n    }))\n  }\n}];}, type: n8n-nodes-base.function, name: output, notes: Format balances with metadata}], connections: {Start: {main: [[{node: config, type: main, index: 0}]]}, config: {main: [[{node: get_balances, type: main, index: 0}]]}, get_balances: {main: [[{node: output, type: main, index: 0}]]}}}"))

