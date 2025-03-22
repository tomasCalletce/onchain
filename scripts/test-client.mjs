import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

const origin = process.argv[2] || "https://onchain-beryl.vercel.app/";

async function main() {
  const transport = new SSEClientTransport(new URL(`${origin}/sse`));

  const client = new Client(
    {
      name: "example-client",
      version: "1.0.0",
    },
    {
      capabilities: {
        prompts: {},
        resources: {},
        tools: {
          token_prices: {
            description: "Get the price of a token",
            parameters: {
              address: {
                type: "string",
                description: "The address of the token",
              },
            },
          },
        },
      },
    }
  );

  await client.connect(transport);

  console.log("Connected", client.getServerCapabilities());

  const result = await client.listTools();
  console.log(result);

  const price = await client.callTool("token_prices", {
    address: "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9",
  });
  console.log(price);
}

main();
