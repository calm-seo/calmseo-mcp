import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { createCalmSeoMockServer } from "./tools.js";

const server = createCalmSeoMockServer();
const transport = new StdioServerTransport();

await server.connect(transport);
