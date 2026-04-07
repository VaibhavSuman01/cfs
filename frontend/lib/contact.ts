export const OFFICE_LANDLINE_DISPLAY = "Office landline: +91 612-4575362";
export const OFFICE_LANDLINE_TEL = "+916124575362";

function digitsOnly(value: string): string {
  return value.replace(/[^\d]/g, "");
}

/**
 * WhatsApp number should be digits only, country code included.
 * Configure with `NEXT_PUBLIC_WHATSAPP_NUMBER` (e.g. "9198XXXXXXXX").
 */
export function getWhatsAppNumber(): string {
  const raw =
    (typeof process.env.NEXT_PUBLIC_WHATSAPP_NUMBER === "string" &&
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) ||
    "";

  // Fallback: if not configured, use office landline digits (can be overridden via env).
  // Note: WhatsApp may not work on landlines in all cases—set `NEXT_PUBLIC_WHATSAPP_NUMBER`
  // to a WhatsApp-enabled mobile number for best results.
  return raw ? digitsOnly(raw) : digitsOnly(OFFICE_LANDLINE_TEL);
}

export function getWhatsAppHref(message: string): string {
  const number = getWhatsAppNumber();
  const text = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${text}`;
}

