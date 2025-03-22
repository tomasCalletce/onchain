import { z } from "zod";
import { initializeMcpApiHandler } from "../lib/mcp-api-handler";
import { getTokenPrice } from "../lib/get-token-price";

const handler = initializeMcpApiHandler(
  (server) => {
    // Add more tools, resources, and prompts here
    server.tool("echo", { message: z.string() }, async ({ message }) => ({
      content: [{ type: "text", text: `Tool echo: ${message}` }],
    }));
    server.tool(
      "token_prices",
      { address: z.string() },
      async ({ address }) => {
        const price = await getTokenPrice(address);

        console.log(price);

        return {
          content: [{ type: "text", text: `Price: ${price}` }],
        };
      }
    );
  },
  {
    capabilities: {
      tools: {
        echo: {
          description: "Echo a message",
        },
      },
    },
  }
);

export default handler;
