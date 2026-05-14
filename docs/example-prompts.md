# Example Prompts

Use these prompts against the local mock server or the hosted CalmSEO MCP server.

Hosted Google Search Console prompts:

```text
Which Google Search Console sites do I have connected?
```

```text
Use gsc_top_queries for the last 28 days and group the queries by informational, commercial, and navigational intent.
```

```text
Use gsc_top_pages to find pages with high impressions and low CTR, then suggest better title tags.
```

```text
Use gsc_page_queries for https://example.com/blog/seo-checklist and identify queries where the page ranks on page one but underperforms on CTR.
```

```text
Use gsc_search_analytics to compare desktop and mobile performance over the last 90 days.
```

Local mock and hosted SEO data prompts:

```text
Run serp_search for "best seo reporting software" in the United States and summarize the top 10 ranking domains.
```

```text
Use keyword_search_volume for "seo audit", "technical seo audit", and "site audit checklist". Return the terms sorted by search volume.
```

```text
Use keyword_ideas with the seed keyword "local seo" and give me 25 ideas grouped by intent.
```

```text
Use ranked_keywords for calmseo.com with a limit of 20. Identify quick-win keywords where the rank is between 4 and 20.
```

```text
Use page_audit for https://example.com/blog/seo-checklist and list the failed checks, title, description, h1, and Core Web Vitals-like timing fields.
```
