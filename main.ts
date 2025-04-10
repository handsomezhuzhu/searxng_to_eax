import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// 从环境变量获取 EXA API 密钥
const EXA_API_KEY = Deno.env.get("EXA_API_KEY");

if (!EXA_API_KEY) {
  console.error("❌ ERROR: EXA_API_KEY 环境变量未设置！");
}

serve(async (req: Request) => {
  const url = new URL(req.url);

  // ✅ 只支持 /search 路径
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
          text: true, // ✅ 请求 EXA 返回正文摘要
        },
      }),
    });

    const exaJson = await exaRes.json();

    const results = (exaJson.results ?? []).map((r: any) => ({
      title: r.title ?? "No title",
      url: r.url ?? "",
      content:
        r.text?.trim() ??
        r.snippet?.trim() ??
        `${r.title ?? ""} - ${r.url ?? ""}`,
    }));

    return new Response(JSON.stringify({ results }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("❌ EXA 请求错误：", e);
    return new Response(
      JSON.stringify({ error: "EXA API 调用失败", detail: String(e) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});
