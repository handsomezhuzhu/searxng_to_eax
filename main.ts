import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const EXA_API_KEY = Deno.env.get("EXA_API_KEY");

serve(async (req: Request) => {
  const url = new URL(req.url);
  
  // ✅ 兼容 /search 路径，读取 q 参数
  if (url.pathname !== "/search") {
    return new Response("Not found", { status: 404 });
  }

  const query = url.searchParams.get("q");
  if (!query) {
    return new Response(JSON.stringify({ error: "Missing query 'q'" }), {
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
    body: JSON.stringify({
      query,
      numResults: 5,
      contents: { text: true },
    }),
  });

  const exaJson = await res.json();

  const results = (exaJson.results ?? []).map((r: any) => ({
    title: r.title ?? "No title",
    url: r.url ?? "",
    content: r.text ?? r.snippet ?? `${r.title ?? ""} - ${r.url ?? ""}`,
  }));

  return new Response(JSON.stringify({ results }), {
    headers: { "Content-Type": "application/json" },
  });
});
