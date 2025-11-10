import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Masks the first 8 digits of an Aadhaar number with 'x' characters
 * @param aadhaar - The Aadhaar number to mask
 * @returns Masked Aadhaar number (xxxxxxxx1234) or "Not provided" if invalid
 */
export function maskAadhaar(aadhaar: string | null | undefined): string {
  if (!aadhaar) {
    return "Not provided";
  }

  // Remove any spaces or special characters and keep only digits
  const cleanAadhaar = aadhaar.replace(/\D/g, "");

  // Check if it's a valid 12-digit Aadhaar number
  if (cleanAadhaar.length !== 12) {
    return "Invalid Aadhaar";
  }

  // Mask first 8 digits with 'x' and show last 4 digits
  return "XXXXXXXX" + cleanAadhaar.slice(-4);
}
