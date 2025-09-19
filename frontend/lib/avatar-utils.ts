const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

/**
 * Constructs the proper avatar URL based on the stored avatarUrl value
 * @param avatarUrl - The avatar URL from the user object
 * @returns The properly formatted avatar URL or undefined if no avatar
 */
export function getAvatarUrl(avatarUrl?: string): string | undefined {
  if (!avatarUrl) return undefined;
  
  // If it's already a data URL (base64 encoded), return as is
  if (avatarUrl.startsWith('data:')) {
    return avatarUrl;
  }
  
  // If it's already a full URL (http/https), return as is
  if (avatarUrl.startsWith('http')) {
    return avatarUrl;
  }
  
  // Otherwise, prepend the API base URL
  return `${API_BASE_URL}${avatarUrl}`;
}
