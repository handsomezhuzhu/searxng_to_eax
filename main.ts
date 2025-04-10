// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const EXA_API_KEY = "你的_EXA_API_KEY"; // 替换成你自己的 key

serve(async (req: Request) => {
  const url = new URL(req.url);
  const query = url.searchParams.get("q");

  if (!query) {
    return new Response(JSON.stringify({ error: "Missing query" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const res = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${EXA_API_KEY}`,
    },
    body: JSON.stringify({ query, numResults: 5 }),
  });

  const json = await res.json();

  const results = json.results.map((r: any) => ({
    title: r.title,
    url: r.url,
    content: r.text,
  }));

  return new Response(JSON.stringify({ results }), {
    headers: { "Content-Type": "application/json" },
  });
});
