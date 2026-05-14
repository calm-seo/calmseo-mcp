import { URL } from "node:url";

type SearchEngine = "google" | "bing";
type Device = "desktop" | "mobile";
type HistoricalSerpMode = "live" | "lost" | "all";

interface SerpSearchInput {
  search_engine: SearchEngine;
  keyword: string;
  location_name: string;
  language_name: string;
  depth: number;
  device: Device;
}

interface KeywordSearchVolumeInput {
  keywords: string[];
  location_name: string;
  language_name: string;
  search_partners: boolean;
  include_monthly_searches: boolean;
}

interface KeywordIdeasInput {
  keywords: string[];
  location_name: string;
  language_name: string;
  limit: number;
  offset: number;
  closely_variants: boolean;
  include_serp_info: boolean;
}

interface RankedKeywordsInput {
  target: string;
  location_name: string;
  language_name: string;
  limit: number;
  offset: number;
  item_types: Array<"organic" | "paid" | "featured_snippet" | "local_pack" | "ai_overview_reference">;
  historical_serp_mode: HistoricalSerpMode;
}

interface PageAuditInput {
  url: string;
  enable_browser_rendering: boolean;
  enable_javascript: boolean;
  load_resources: boolean;
  accept_language?: string;
}

const SAMPLE_DOMAINS = [
  "calmseo.com",
  "searchengineland.com",
  "moz.com",
  "ahrefs.com",
  "semrush.com",
  "backlinko.com",
  "hubspot.com",
  "developers.google.com",
  "example.com",
  "wikipedia.org",
];

const IDEA_MODIFIERS = [
  "tool",
  "software",
  "checklist",
  "template",
  "examples",
  "pricing",
  "strategy",
  "audit",
  "comparison",
  "best practices",
  "for startups",
  "for ecommerce",
];

export function buildSerpSearch(input: SerpSearchInput): Record<string, unknown> {
  const keyword = normalizeText(input.keyword);
  const items = Array.from({ length: input.depth }, (_, index) => {
    const rank = index + 1;
    const domain = SAMPLE_DOMAINS[(hashString(`${keyword}:${rank}`) + rank) % SAMPLE_DOMAINS.length]!;
    const type = rank === 1 && input.search_engine === "google" ? "featured_snippet" : "organic";

    return compactObject({
      type,
      rank_group: rank,
      rank_absolute: rank,
      page: Math.ceil(rank / 10),
      domain,
      title: titleCase(`${keyword} ${rank === 1 ? "guide" : "resource"}`),
      url: `https://${domain}/${slugify(keyword)}-${rank}`,
      breadcrumb: `${domain} > ${slugify(keyword)}`,
      description: `Mock ${input.search_engine} result for ${keyword} in ${normalizeText(input.location_name)}.`,
      is_malicious: false,
      is_web_story: false,
    });
  });

  return {
    mock: true,
    task_id: taskId("serp", keyword),
    status: "Ok.",
    keyword,
    location_code: locationCode(input.location_name),
    language_code: languageCode(input.language_name),
    check_url: searchUrl(input.search_engine, keyword),
    total_count: 100000 + hashString(keyword) * 13,
    items_count: items.length,
    serp_features: countBy(items.map((item) => String(item.type))),
    results: items,
    request: {
      search_engine: input.search_engine,
      location_name: normalizeText(input.location_name),
      language_name: normalizeText(input.language_name),
      depth: input.depth,
      device: input.device,
    },
  };
}

export function buildKeywordSearchVolume(input: KeywordSearchVolumeInput): Record<string, unknown> {
  const keywords = normalizeKeywords(input.keywords);

  return {
    mock: true,
    task_id: taskId("volume", keywords.join(",")),
    status: "Ok.",
    results: keywords.map((keyword) => {
      const hash = hashString(keyword);

      return compactObject({
        keyword,
        location_code: locationCode(input.location_name),
        language_code: languageCode(input.language_name),
        search_volume: roundTo((hash % 90000) + 500, 10),
        competition: competitionLabel(hash),
        competition_index: hash % 100,
        cpc: dollars((hash % 2400) / 100 + 0.4),
        low_top_of_page_bid: dollars((hash % 800) / 100 + 0.2),
        high_top_of_page_bid: dollars((hash % 3200) / 100 + 1.2),
        monthly_searches: input.include_monthly_searches ? monthlySearches(keyword) : undefined,
      });
    }),
    request: {
      location_name: normalizeText(input.location_name),
      language_name: normalizeText(input.language_name),
      search_partners: input.search_partners,
    },
  };
}

export function buildKeywordIdeas(input: KeywordIdeasInput): Record<string, unknown> {
  const seeds = normalizeKeywords(input.keywords);
  const allIdeas = seeds.flatMap((seed) =>
    IDEA_MODIFIERS.map((modifier) => (input.closely_variants ? `${seed} ${modifier}` : `${modifier} ${seed}`)),
  );
  const totalCount = allIdeas.length;
  const ideas = allIdeas.slice(input.offset, input.offset + input.limit).map((keyword) => {
    const hash = hashString(keyword);

    return compactObject({
      keyword,
      search_volume: roundTo((hash % 70000) + 250, 10),
      cpc: dollars((hash % 1800) / 100 + 0.3),
      competition: competitionLabel(hash),
      competition_index: hash % 100,
      keyword_difficulty: hash % 90,
      daily_impressions_average: roundTo((hash % 1800) + 40, 1),
      daily_clicks_average: roundTo((hash % 260) + 5, 1),
      cpc_average: dollars((hash % 1300) / 100 + 0.5),
      serp_item_types: input.include_serp_info ? ["organic", "people_also_ask", "images"] : undefined,
      se_results_count: input.include_serp_info ? 100000 + hash * 7 : undefined,
    });
  });

  return {
    mock: true,
    task_id: taskId("ideas", seeds.join(",")),
    status: "Ok.",
    total_count: totalCount,
    items_count: ideas.length,
    offset: input.offset,
    offset_token: input.offset + ideas.length < totalCount ? `mock-offset-${input.offset + ideas.length}` : undefined,
    ideas,
    request: {
      keywords: seeds,
      location_name: normalizeText(input.location_name),
      language_name: normalizeText(input.language_name),
      closely_variants: input.closely_variants,
      include_serp_info: input.include_serp_info,
    },
  };
}

export function buildRankedKeywords(input: RankedKeywordsInput): Record<string, unknown> {
  const target = normalizeTarget(input.target);
  const itemTypes = [...input.item_types].sort();
  const totalCount = 600 + (hashString(target) % 4000);
  const keywords = Array.from({ length: Math.min(input.limit, Math.max(totalCount - input.offset, 0)) }, (_, index) => {
    const rank = input.offset + index + 1;
    const keyword = `${target.replace(/\W+/g, " ")} ${IDEA_MODIFIERS[index % IDEA_MODIFIERS.length]}`.trim();
    const hash = hashString(`${target}:${rank}`);
    const itemType = itemTypes[index % itemTypes.length] ?? "organic";

    return compactObject({
      keyword,
      location_code: locationCode(input.location_name),
      language_code: languageCode(input.language_name),
      search_volume: roundTo((hash % 85000) + 150, 10),
      cpc: dollars((hash % 2100) / 100 + 0.25),
      competition: competitionLabel(hash),
      competition_index: hash % 100,
      keyword_difficulty: hash % 90,
      item_type: itemType,
      rank_group: (hash % 10) + 1,
      rank_absolute: (hash % 30) + 1,
      url: `https://${target}/${slugify(keyword)}`,
      title: titleCase(keyword),
      domain: target,
      etv: dollars((hash % 5000) / 10),
      estimated_paid_traffic_cost: dollars((hash % 25000) / 10),
    });
  });

  return {
    mock: true,
    task_id: taskId("ranked", target),
    status: "Ok.",
    target,
    total_count: totalCount,
    items_count: keywords.length,
    metrics: {
      organic: {
        count: totalCount,
        etv: dollars(totalCount * 1.7),
      },
      paid: {
        count: Math.floor(totalCount * 0.08),
        estimated_paid_traffic_cost: dollars(totalCount * 2.4),
      },
    },
    keywords,
    request: {
      location_name: normalizeText(input.location_name),
      language_name: normalizeText(input.language_name),
      item_types: itemTypes,
      historical_serp_mode: input.historical_serp_mode,
      offset: input.offset,
      limit: input.limit,
    },
  };
}

export function buildPageAudit(input: PageAuditInput): Record<string, unknown> {
  const url = new URL(input.url);
  const hash = hashString(url.href);
  const hasPath = url.pathname !== "/";
  const checks = {
    duplicate_title: hash % 7 === 0,
    duplicate_description: hash % 11 === 0,
    no_h1: !hasPath && hash % 3 === 0,
    low_content_rate: hash % 5 === 0,
    high_loading_time: input.load_resources || hash % 13 === 0,
    is_4xx_code: false,
    is_5xx_code: false,
    is_https: url.protocol === "https:",
  };
  const failedChecks = Object.entries(checks)
    .filter(([key, value]) => key !== "is_https" && value === true)
    .map(([key]) => key);
  const score = Math.max(58, 97 - failedChecks.length * 7 - (input.enable_javascript ? 2 : 0));

  return {
    mock: true,
    task_id: taskId("audit", url.href),
    status: "Ok.",
    audit: {
      url: url.href,
      resource_type: "html",
      status_code: 200,
      location: null,
      size: 42000 + hash,
      encoded_size: 18000 + (hash % 20000),
      total_transfer_size: 25000 + (hash % 30000),
      fetch_time: new Date("2026-01-01T00:00:00.000Z").toISOString(),
      onpage_score: score,
      title: titleCase(`${url.hostname} ${hasPath ? url.pathname.split("/").filter(Boolean).at(-1) : "home"}`),
      description: `Mock on-page audit result for ${url.hostname}.`,
      canonical: url.href,
      h1: titleCase(url.hostname.replace(/\./g, " ")),
      meta_robots: "index,follow",
      internal_links_count: 22 + (hash % 80),
      external_links_count: 2 + (hash % 18),
      images_count: 3 + (hash % 24),
      content_encoding: "br",
      page_timing: {
        time_to_interactive: 600 + (hash % 1800),
        largest_contentful_paint: 900 + (hash % 2200),
        first_input_delay: 5 + (hash % 90),
        cumulative_layout_shift: Number(((hash % 20) / 100).toFixed(2)),
        waiting_time: 100 + (hash % 700),
        duration_time: 900 + (hash % 2600),
      },
      failed_checks: failedChecks,
      checks,
    },
    request: {
      enable_browser_rendering: input.enable_browser_rendering,
      enable_javascript: input.enable_javascript,
      load_resources: input.load_resources,
      accept_language: input.accept_language,
    },
  };
}

function normalizeText(value: string): string {
  return value.trim();
}

function normalizeKeywords(keywords: string[]): string[] {
  return [...new Set(keywords.map((keyword) => keyword.trim().toLowerCase()).filter(Boolean))].sort();
}

function normalizeTarget(value: string): string {
  const trimmed = normalizeText(value).replace(/^https?:\/\//, "").replace(/^www\./, "");
  return trimmed.split("/")[0]?.toLowerCase() ?? trimmed.toLowerCase();
}

function taskId(prefix: string, value: string): string {
  return `mock-${prefix}-${hashString(value).toString(16).padStart(6, "0")}`;
}

function hashString(value: string): number {
  let hash = 2166136261;

  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return Math.abs(hash >>> 0);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function titleCase(value: string): string {
  return value
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function locationCode(locationName: string): number {
  return normalizeText(locationName).toLowerCase() === "united states" ? 2840 : 1000000 + (hashString(locationName) % 900000);
}

function languageCode(languageName: string): string {
  return normalizeText(languageName).toLowerCase().startsWith("english") ? "en" : "mock";
}

function searchUrl(searchEngine: SearchEngine, keyword: string): string {
  const query = encodeURIComponent(keyword);
  return searchEngine === "google" ? `https://www.google.com/search?q=${query}` : `https://www.bing.com/search?q=${query}`;
}

function countBy(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function competitionLabel(hash: number): "LOW" | "MEDIUM" | "HIGH" {
  if (hash % 100 < 35) {
    return "LOW";
  }

  if (hash % 100 < 70) {
    return "MEDIUM";
  }

  return "HIGH";
}

function monthlySearches(keyword: string): Array<{ year: number; month: number; search_volume: number }> {
  const base = hashString(keyword) % 90000;

  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const seasonal = Math.round(Math.sin((month / 12) * Math.PI * 2) * 0.18 * base);

    return {
      year: 2025,
      month,
      search_volume: roundTo(Math.max(100, base + seasonal), 10),
    };
  });
}

function roundTo(value: number, increment: number): number {
  return Math.round(value / increment) * increment;
}

function dollars(value: number): number {
  return Number(value.toFixed(2));
}

function compactObject(record: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined && value !== null));
}
