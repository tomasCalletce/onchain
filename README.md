# Big Brain MCP - Mantle Network Stats Server

This repository contains an MCP server designed to read statistics from the top protocols in the Mantle Network. Use this tool to make more informed decisions about your investment strategies.

## Usage

Update `api/server.ts` with your tools, prompts, and resources following the [MCP TypeScript SDK documentation](https://github.com/modelcontextprotocol/typescript-sdk/tree/main?tab=readme-ov-file#server).

## Notes for Running on Vercel

- Requires a Redis instance attached to the project under `process.env.REDIS_URL`.
- Ensure you have [Fluid compute](https://vercel.com/docs/functions/fluid-compute) enabled for efficient execution.
- After enabling Fluid compute, open `vercel.json` and adjust the max duration to 800 if you are using a Vercel Pro or Enterprise account.
- [Deploy the MCP template](https://vercel.com/templates/other/model-context-protocol-mcp-with-vercel-functions).

## Sample Client

You can use the sample client located at `script/test-client.mjs` to test invocations.

```sh
node scripts/test-client.mjs
