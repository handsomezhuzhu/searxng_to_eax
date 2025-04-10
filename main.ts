import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const EXA_API_KEY = Deno.env.get("EXA_API_KEY");

if (!EXA_API_KEY) {
  console.error("❌ ERROR: EXA_API_KEY 环境变量未设置！");
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
        numResults: 5,
        contents: {
          text: true,
        },
      }),
    });

    const exaJson = await exaRes.json();

    console.log("EXA 返回：", JSON.stringify(exaJson, null, 2));

    // ✅ 正确提取 results（顶层）
    const results = (exaJson.results ?? []).map((r: any) => ({
      title: r.title ?? "No title",
      url: r.url ?? "",
      content:
        r.text?.trim() ??
        r.snippet?.trim() ??
        r.description?.trim() ??
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
