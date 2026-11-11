import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import {
  buildBacklinkGaps,
  buildBacklinks,
  buildBacklinkSummary,
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

const backlinkTargetSchema = z
  .string()
  .min(1)
  .describe("Domain such as example.com, or a full page URL such as https://example.com/blog/post for one page.");

const includeSubdomainsSchema = z.boolean().default(true).describe("Count links to subdomains of the target too.");

const backlinkLimitSchema = z
  .number()
  .int()
  .min(1)
  .max(1000)
  .default(100)
  .describe("Rows to return. Up to 100 costs 5 credits, 101-1,000 costs 15 credits on the hosted server.");

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

  server.registerTool(
    "get_backlink_summary",
    {
      title: "Backlink Summary",
      description:
        "Mock backlink profile overview for a domain or page: rank (0-100), backlinks, referring domains, nofollow counts, spam score, broken backlinks, and top linking TLDs and countries.",
      inputSchema: {
        target: backlinkTargetSchema,
        include_subdomains: includeSubdomainsSchema,
      },
    },
    async (args) => jsonToolResult(buildBacklinkSummary(args)),
  );

  server.registerTool(
    "get_backlinks",
    {
      title: "Backlinks",
      description:
        "Mock list of backlinks pointing to a domain or page, with the linking URL, anchor text, dofollow status, linking site rank (0-100), first and last seen dates, and new or lost flags.",
      inputSchema: {
        target: backlinkTargetSchema,
        mode: z
          .enum(["one_per_domain", "as_is", "one_per_anchor"])
          .default("one_per_domain")
          .describe(
            "one_per_domain returns the strongest link from each linking site. as_is returns every link. one_per_anchor returns one link per anchor text.",
          ),
        status: z
          .enum(["live", "lost"])
          .default("live")
          .describe("live returns links that exist now. lost returns links that were removed."),
        dofollow_only: z.boolean().default(false).describe("Return only dofollow links."),
        sort: z
          .enum(["rank", "newest"])
          .default("rank")
          .describe("rank puts links from the strongest sites first. newest puts recently found links first."),
        include_subdomains: includeSubdomainsSchema,
        limit: backlinkLimitSchema,
        offset: z.number().int().min(0).max(20000).default(0),
      },
    },
    async (args) => jsonToolResult(buildBacklinks(args)),
  );

  server.registerTool(
    "find_backlink_gaps",
    {
      title: "Backlink Gaps",
      description:
        "Mock list of sites that link to all of the given competitors but not to your domain, ranked by linking site rank (0-100), with backlink counts per competitor. Use it to find link building prospects.",
      inputSchema: {
        target: z
          .string()
          .min(1)
          .describe("Your domain, such as example.com. Sites that already link to it are left out."),
        competitors: z
          .array(z.string().min(1))
          .min(1)
          .max(20)
          .describe(
            "Competitor domains. Results are sites that link to every competitor listed, so 1-3 competitors gives the broadest list.",
          ),
        dofollow_only: z.boolean().default(false).describe("Count only dofollow links."),
        limit: backlinkLimitSchema,
        offset: z.number().int().min(0).default(0),
      },
    },
    async (args) => jsonToolResult(buildBacklinkGaps(args)),
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
