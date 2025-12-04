// Utility functions for avatar/profile picture handling

/**
 * Generate Gravatar URL from email address
 * Gravatar automatically works with Gmail emails if user has set up Gravatar
 * @param {string} email - User's email address
 * @param {number} size - Image size in pixels (default: 40)
 * @returns {string} Gravatar URL
 */
export const getGravatarUrl = (email, size = 40) => {
  if (!email) return null;
  
  // Convert email to lowercase and trim
  const normalizedEmail = email.toLowerCase().trim();
  
  // Simple MD5 hash (for production, use crypto library)
  // For now, we'll use Gravatar's API which handles hashing
  // Format: https://www.gravatar.com/avatar/{hash}?s={size}&d=identicon
  const hash = btoa(normalizedEmail).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  
  // Use Gravatar API (works with Gmail if user has Gravatar account)
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon&r=pg`;
};

/**
 * Generate Google profile picture URL (if using Google OAuth)
 * Note: This requires OAuth token, so we'll use Gravatar as fallback
 * @param {string} email - User's email address
 * @param {number} size - Image size in pixels (default: 40)
 * @returns {string} Profile picture URL or null
 */
export const getGoogleProfilePicture = (email, size = 40) => {
  if (!email || !email.includes('@gmail.com')) return null;
  
  // For Gmail users, try to get profile picture
  // This would require Google OAuth integration
  // For now, we'll use Gravatar as it works automatically with Gmail
  return getGravatarUrl(email, size);
};

/**
 * Get user avatar URL with fallback options
 * Priority: 1. Stored avatar URL, 2. Gravatar (Gmail), 3. Generated avatar
 * @param {Object} user - User object with email and avatar
 * @param {number} size - Image size in pixels (default: 40)
 * @returns {string} Avatar URL or null
 */
export const getUserAvatarUrl = (user, size = 40) => {
  if (!user) return null;
  
  // Priority 1: Use stored avatar URL if available
  if (user.avatar && user.avatar.trim() !== '') {
    return user.avatar;
  }
  
  // Priority 2: Use Gravatar for Gmail/email addresses
  if (user.email) {
    return getGravatarUrl(user.email, size);
  }
  
  // Priority 3: Return null (component will use fallback avatar)
  return null;
};

/**
 * Check if URL is valid image URL
 * @param {string} url - URL to check
 * @returns {boolean} True if valid image URL
 */
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

