import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// ✅ 使用 Deno.env 获取密钥（从环境变量 EXA_API_KEY 中读取）
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
          text: true, // ✅ 启用返回正文内容
        },
      }),
    });

    const exaJson = await exaRes.json();

    // ✅ 日志输出（调试用，可在 Deno Deploy 控制台查看）
    console.log("EXA 返回：", JSON.stringify(exaJson, null, 2));

    // ✅ 读取 data.results，避免返回空
    const results = (exaJson.data?.results ?? []).map((r: any) => ({
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
