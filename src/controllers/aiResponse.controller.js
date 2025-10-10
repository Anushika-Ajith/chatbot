import fetch from "node-fetch";

export async function streamAIResponse(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  const pythonApiBase = process.env.PYTHON_API_BASE || "http://127.0.0.1:8000";
  const targetUrl = `${pythonApiBase}/chat/stream?query=${encodeURIComponent(query)}`;

  try {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    console.log("🔁 Forwarding stream to:", targetUrl);

    const pythonResponse = await fetch(targetUrl);

    if (!pythonResponse.ok) {
      console.error(`Python stream failed: ${pythonResponse.status}`);
      return res.end(`data: [ERROR] AI Service failed (${pythonResponse.status})\n\n`);
    }

    const stream = pythonResponse.body;

    if (!stream) {
      return res.end("data: [ERROR] No stream body received from Python service\n\n");
    }

    stream.on("error", (err) => {
      console.error("❌ Python stream error:", err);
      res.end("data: [ERROR] Streaming failed\n\n");
    });

    stream.pipe(res);
  } catch (error) {
    console.error("🚫 Could not connect to Python service:", error.message);
    res.end("data: [ERROR] Could not connect to Python service\n\n");
  }
}
