import { z } from "zod";
import { initializeMcpApiHandler } from "../lib/mcp-api-handler";

const handler = initializeMcpApiHandler(
  (server) => {
    // Add more tools, resources, and prompts here
    server.tool("echo", { message: z.string() }, async ({ message }) => ({
      content: [{ type: "text", text: `Tool echo: ${message}` }],
    }));

    // Static resource
    server.resource("config", "config://app", async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: "App configuration here",
        },
      ],
    }));
  },
  {
    capabilities: {
      tools: {
        echo: {
          description: "Echo a message",
        },
      },
      resources: {
        config: {
          description: "Application configuration resource",
          uriScheme: "config",
        },
      },
    },
  }
);

export default handler;
