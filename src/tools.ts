import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import {
  buildKeywordIdeas,
  buildKeywordSearchVolume,
  buildPageAudit,
  buildRankedKeywords,
  buildSerpSearch,
} from "./mock-data.js";

const locationNameSchema = z
  .string()
  .min(1)
  .default("United States")
  .describe("Search location name, for example 'United States'.");

const languageNameSchema = z
  .string()
  .min(1)
  .default("English")
  .describe("Search language name, for example 'English'.");

export function createCalmSeoMockServer(): McpServer {
  const server = new McpServer({
    name: "calmseo-mcp-mock",
    version: "0.1.0",
  });

  server.registerTool(
    "serp_search",
    {
      title: "SERP Search",
      description:
        "Mock Google or Bing organic SERP search. Returns compact ranking results for a keyword, location, language, and depth.",
      inputSchema: {
        search_engine: z.enum(["google", "bing"]).default("google"),
        keyword: z.string().min(1).describe("Search query to run in organic SERP."),
        location_name: locationNameSchema,
        language_name: languageNameSchema,
        depth: z
          .number()
          .int()
          .refine((value) => [10, 20, 100].includes(value), {
            message: "Depth must be 10, 20, or 100.",
          })
          .default(10)
          .describe("Number of results to request. Supported values: 10, 20, 100."),
        device: z.enum(["desktop", "mobile"]).default("desktop"),
      },
    },
    async (args) => jsonToolResult(buildSerpSearch(args)),
  );

  server.registerTool(
    "keyword_search_volume",
    {
      title: "Keyword Search Volume",
      description:
        "Mock Google Ads keyword search volume, CPC, and competition for a batch of keywords.",
      inputSchema: {
        keywords: z
          .array(z.string().min(1).max(80))
          .min(1)
          .max(1000)
          .describe("Keywords to check."),
        location_name: locationNameSchema,
        language_name: languageNameSchema,
        search_partners: z.boolean().default(false),
        include_monthly_searches: z.boolean().default(false),
      },
    },
    async (args) => jsonToolResult(buildKeywordSearchVolume(args)),
  );

  server.registerTool(
    "keyword_ideas",
    {
      title: "Keyword Ideas",
      description: "Mock keyword ideas for expanding seed keywords into a research set.",
      inputSchema: {
        keywords: z.array(z.string().min(3)).min(1).max(50),
        location_name: locationNameSchema,
        language_name: languageNameSchema,
        limit: z.number().int().min(1).max(1000).default(50),
        offset: z.number().int().min(0).default(0),
        closely_variants: z.boolean().default(false),
        include_serp_info: z.boolean().default(false),
      },
    },
    async (args) => jsonToolResult(buildKeywordIdeas(args)),
  );

  server.registerTool(
    "ranked_keywords",
    {
      title: "Ranked Keywords",
      description: "Mock keywords a domain, subdomain, or URL ranks for in Google.",
      inputSchema: {
        target: z
          .string()
          .min(1)
          .describe("Domain, subdomain, or page URL. Domains should be provided without https:// or www."),
        location_name: locationNameSchema,
        language_name: languageNameSchema,
        limit: z.number().int().min(1).max(1000).default(50),
        offset: z.number().int().min(0).default(0),
        item_types: z
          .array(z.enum(["organic", "paid", "featured_snippet", "local_pack", "ai_overview_reference"]))
          .min(1)
          .default(["organic"]),
        historical_serp_mode: z.enum(["live", "lost", "all"]).default("live"),
      },
    },
    async (args) => jsonToolResult(buildRankedKeywords(args)),
  );

  server.registerTool(
    "page_audit",
    {
      title: "Page Audit",
      description: "Mock single URL on-page SEO audit.",
      inputSchema: {
        url: z.string().url(),
        enable_browser_rendering: z
          .boolean()
          .default(false)
          .describe("Enable browser rendering and Core Web Vitals."),
        enable_javascript: z.boolean().default(false).describe("Load JavaScript."),
        load_resources: z.boolean().default(false).describe("Load resources like images, CSS, and scripts."),
        accept_language: z.string().optional(),
      },
    },
    async (args) => jsonToolResult(buildPageAudit(args)),
  );

  return server;
}

function jsonToolResult(value: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(value, null, 2),
      },
    ],
  };
}
