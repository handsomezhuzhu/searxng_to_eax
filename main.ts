import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const EXA_API_KEY = Deno.env.get("EXA_API_KEY");

if (!EXA_API_KEY) {
  console.error("❌ 未设置 EXA_API_KEY 环境变量！");
}

serve(async (req: Request) => {
  const url = new URL(req.url);
  const query = url.searchParams.get("q");

  if (!query) {
    return new Response(JSON.stringify({ error: "Missing query 'q'" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const exaRes = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${EXA_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        contents: {
          text: true, // ✅ 启用正文摘要提取
        },
        numResults: 5,
      }),
    });

    const exaJson = await exaRes.json();

    const results = (exaJson.data?.results ?? []).map((r: any) => ({
      title: r.title ?? "No title",
      url: r.url ?? "",
      content:
        r.text?.trim() ||
        r.snippet?.trim() ||
        `${r.title ?? ""} - ${r.url ?? ""}`,
    }));

    return new Response(JSON.stringify({ results }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Server error", detail: String(e) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});
