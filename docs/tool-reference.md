# Tool Reference

The local server returns deterministic mock data. Hosted CalmSEO responses may include account-specific fields such as credit usage.

## Hosted Google Search Console Tools

These tools are available on the hosted CalmSEO MCP server when the signed-in account has Google Search Console connected. They are documented here for the public hosted server surface, but they are not implemented by the local mock server in this repository.

### `gsc_list_sites`

List Google Search Console sites available to the connected CalmSEO account.

Common use:

```text
Which Search Console sites do I have connected?
```

### `gsc_search_analytics`

Query Google Search Console performance data for a site with date range, dimensions, filters, and row limits.

Typical dimensions include:

- `query`
- `page`
- `country`
- `device`
- `date`

Typical metrics include:

- `clicks`
- `impressions`
- `ctr`
- `position`

Common use:

```text
Show Search Console performance for the last 28 days by query and page.
```

### `gsc_top_queries`

Find top Search Console queries for a site, sorted by performance metric.

Common use:

```text
Show my top queries by impressions where average position is between 4 and 20.
```

### `gsc_top_pages`

Find top Search Console pages for a site, sorted by clicks, impressions, CTR, or position.

Common use:

```text
Find pages with high impressions and low CTR over the last 90 days.
```

### `gsc_page_queries`

Show Search Console queries driving traffic to a specific page.

Common use:

```text
For https://example.com/blog/seo-checklist, show the queries driving impressions and clicks.
```

### `gsc_list_sitemaps`

List submitted sitemaps for a Google Search Console site.

Common use:

```text
List the submitted sitemaps for my connected Search Console property.
```

## Local Mock Tools

## `serp_search`

Mock organic SERP search for Google or Bing.

Inputs:

- `search_engine`: `google` or `bing`, default `google`
- `keyword`: search query
- `location_name`: default `United States`
- `language_name`: default `English`
- `depth`: `10`, `20`, or `100`, default `10`
- `device`: `desktop` or `mobile`, default `desktop`

Example prompt:

```text
Use serp_search to find the top 10 Google results for "technical seo audit" in the United States.
```

## `keyword_search_volume`

Mock search volume, CPC, and competition for a batch of keywords.

Inputs:

- `keywords`: 1 to 1,000 keywords
- `location_name`: default `United States`
- `language_name`: default `English`
- `search_partners`: default `false`
- `include_monthly_searches`: default `false`

## `keyword_ideas`

Mock keyword expansion for seed terms.

Inputs:

- `keywords`: 1 to 50 seed keywords
- `location_name`: default `United States`
- `language_name`: default `English`
- `limit`: 1 to 1,000, default `50`
- `offset`: default `0`
- `closely_variants`: default `false`
- `include_serp_info`: default `false`

## `ranked_keywords`

Mock keywords a target ranks for in Google.

Inputs:

- `target`: domain, subdomain, or page URL
- `location_name`: default `United States`
- `language_name`: default `English`
- `limit`: 1 to 1,000, default `50`
- `offset`: default `0`
- `item_types`: one or more of `organic`, `paid`, `featured_snippet`, `local_pack`, `ai_overview_reference`
- `historical_serp_mode`: `live`, `lost`, or `all`, default `live`

## `page_audit`

Mock single-page SEO audit.

Inputs:

- `url`: absolute URL
- `enable_browser_rendering`: default `false`
- `enable_javascript`: default `false`
- `load_resources`: default `false`
- `accept_language`: optional language header

## `get_backlink_summary`

Mock backlink profile overview for a domain or page: rank, backlinks, referring domains, nofollow counts, spam score, broken backlinks, and top linking TLDs and countries. Rank is a 0-100 backlink strength score, not Domain Rating or Domain Authority.

Inputs:

- `target`: domain such as `example.com`, or a full page URL
- `include_subdomains`: default `true`

Hosted cost: 5 credits.

## `get_backlinks`

Mock backlinks pointing to a domain or page, with the linking URL, anchor text, dofollow status, linking site rank, first and last seen dates, and new or lost flags.

Inputs:

- `target`: domain such as `example.com`, or a full page URL
- `mode`: `one_per_domain`, `as_is`, or `one_per_anchor`, default `one_per_domain`
- `status`: `live` or `lost`, default `live`
- `dofollow_only`: default `false`
- `sort`: `rank` or `newest`, default `rank`
- `include_subdomains`: default `true`
- `limit`: 1 to 1,000, default `100`
- `offset`: 0 to 20,000, default `0`

Hosted cost: 5 credits for up to 100 rows, 15 for 101 to 1,000.

## `find_backlink_gaps`

Mock sites that link to all of the given competitors but not to your domain, ranked by linking site rank, with backlink counts per competitor. Fewer competitors give a broader list.

Inputs:

- `target`: your domain, such as `example.com`
- `competitors`: 1 to 20 competitor domains
- `dofollow_only`: default `false`
- `limit`: 1 to 1,000, default `100`
- `offset`: default `0`

Hosted cost: 5 credits for up to 100 rows, 15 for 101 to 1,000.

Example prompt:

```text
Use find_backlink_gaps with target example.com and competitors competitor-one.com and competitor-two.com to find link building prospects.
```
