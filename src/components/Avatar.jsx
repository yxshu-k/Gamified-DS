import React, { useState } from 'react';

// Get avatar color based on username (fallback)
const getAvatarColor = (username) => {
  const colors = [
    'bg-gradient-to-br from-purple-400 to-pink-400',
    'bg-gradient-to-br from-blue-400 to-cyan-400',
    'bg-gradient-to-br from-green-400 to-emerald-400',
    'bg-gradient-to-br from-yellow-400 to-orange-400',
    'bg-gradient-to-br from-indigo-400 to-purple-400',
    'bg-gradient-to-br from-red-400 to-pink-400',
  ];
  if (!username) return colors[0];
  const index = username.charCodeAt(0) % colors.length;
  return colors[index];
};

/**
 * Generate Gravatar URL from email (works with Gmail)
 * Uses MD5 hash of email (Gravatar standard)
 * For simplicity, we'll use a CDN-based MD5 or async load
 */
const getGravatarUrl = async (email, size = 40) => {
  if (!email) return null;
  
  // Normalize email (lowercase, trim)
  const normalizedEmail = email.toLowerCase().trim();
  
  // Use a simple approach: try to use MD5 via a CDN or use Gravatar's email lookup
  // For now, we'll use a synchronous MD5 implementation
  try {
    // Try to use Web Crypto API for MD5 (though it doesn't support MD5 directly)
    // Fallback to a simple hash that works with Gravatar
    const hash = await hashEmail(normalizedEmail);
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=404&r=pg`;
  } catch (e) {
    return null;
  }
};

/**
 * Hash email using MD5 (simplified approach)
 * Uses a lightweight MD5 implementation
 */
const hashEmail = async (email) => {
  // Use a simple MD5 implementation
  // For production, consider using crypto-js or similar library
  const md5 = (str) => {
    // Simple MD5 hash function
    function md5cycle(x, k) {
      let a = x[0], b = x[1], c = x[2], d = x[3];
      a = ff(a, b, c, d, k[0], 7, -680876936);
      d = ff(d, a, b, c, k[1], 12, -389564586);
      c = ff(c, d, a, b, k[2], 17, 606105819);
      b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897);
      d = ff(d, a, b, c, k[5], 12, 1200080426);
      c = ff(c, d, a, b, k[6], 17, -1473231341);
      b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7, 1770035416);
      d = ff(d, a, b, c, k[9], 12, -1958414417);
      c = ff(c, d, a, b, k[10], 17, -42063);
      b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7, 1804603682);
      d = ff(d, a, b, c, k[13], 12, -40341101);
      c = ff(c, d, a, b, k[14], 17, -1502002290);
      b = ff(b, c, d, a, k[15], 22, 1236535329);
      a = gg(a, b, c, d, k[1], 5, -165796510);
      d = gg(d, a, b, c, k[6], 9, -1069501632);
      c = gg(c, d, a, b, k[11], 14, 643717713);
      b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691);
      d = gg(d, a, b, c, k[10], 9, 38016083);
      c = gg(c, d, a, b, k[15], 14, -660478335);
      b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5, 568446438);
      d = gg(d, a, b, c, k[14], 9, -1019803690);
      c = gg(c, d, a, b, k[3], 14, -187363961);
      b = gg(b, c, d, a, k[8], 20, 1163531501);
      a = gg(a, b, c, d, k[13], 5, -1444681467);
      d = gg(d, a, b, c, k[2], 9, -51403784);
      c = gg(c, d, a, b, k[7], 14, 1735328473);
      b = gg(b, c, d, a, k[12], 20, -1926607734);
      a = hh(a, b, c, d, k[5], 4, -378558);
      d = hh(d, a, b, c, k[8], 11, -2022574463);
      c = hh(c, d, a, b, k[11], 16, 1839030562);
      b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060);
      d = hh(d, a, b, c, k[4], 11, 1272893353);
      c = hh(c, d, a, b, k[7], 16, -155497632);
      b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4, 681279174);
      d = hh(d, a, b, c, k[0], 11, -358537222);
      c = hh(c, d, a, b, k[3], 16, -722521979);
      b = hh(b, c, d, a, k[6], 23, 76029189);
      a = hh(a, b, c, d, k[9], 4, -640364487);
      d = hh(d, a, b, c, k[12], 11, -421815835);
      c = hh(c, d, a, b, k[15], 16, 530742520);
      b = hh(b, c, d, a, k[2], 23, -995338651);
      a = ii(a, b, c, d, k[0], 6, -198630844);
      d = ii(d, a, b, c, k[7], 10, 1126891415);
      c = ii(c, d, a, b, k[14], 15, -1416354905);
      b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6, 1700485571);
      d = ii(d, a, b, c, k[3], 10, -1894986606);
      c = ii(c, d, a, b, k[10], 15, -1051523);
      b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6, 1873313359);
      d = ii(d, a, b, c, k[15], 10, -30611744);
      c = ii(c, d, a, b, k[6], 15, -1560198380);
      b = ii(b, c, d, a, k[13], 21, 1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070);
      d = ii(d, a, b, c, k[11], 10, -1120210379);
      c = ii(c, d, a, b, k[2], 15, 718787259);
      b = ii(b, c, d, a, k[9], 21, -343485551);
      x[0] = add32(a, x[0]);
      x[1] = add32(b, x[1]);
      x[2] = add32(c, x[2]);
      x[3] = add32(d, x[3]);
    }
    function cmn(q, a, b, x, s, t) {
      a = add32(add32(a, q), add32(x, t));
      return add32((a << s) | (a >>> (32 - s)), b);
    }
    function ff(a, b, c, d, x, s, t) {
      return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function gg(a, b, c, d, x, s, t) {
      return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function hh(a, b, c, d, x, s, t) {
      return cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function ii(a, b, c, d, x, s, t) {
      return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }
    function add32(a, b) {
      return (a + b) & 0xFFFFFFFF;
    }
    function rhex(n) {
      let s = '', j = 0;
      const hex_chr = '0123456789abcdef'.split('');
      for (; j < 4; j++)
        s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
      return s;
    }
    const hex_chr = '0123456789abcdef'.split('');
    const s = unescape(encodeURIComponent(str));
    const x = [];
    const len = s.length;
    x[len >> 2] = len;
    for (let i = 0; i < len; i++) {
      x[i >> 2] |= (s.charCodeAt(i) << ((i % 4) * 8));
    }
    x[len >> 2] |= (0x80 << ((len % 4) * 8));
    const n = ((len + 64) >>> 9 << 4) + 15;
    for (let i = len >> 2 + 1; i < n; i++) {
      x[i] = 0;
    }
    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;
    for (let i = 0; i < x.length; i += 16) {
      const aa = a, bb = b, cc = c, dd = d;
      md5cycle(x.slice(i), [a, b, c, d]);
      a = add32(a, aa);
      b = add32(b, bb);
      c = add32(c, cc);
      d = add32(d, dd);
    }
    return (rhex(a) + rhex(b) + rhex(c) + rhex(d)).toLowerCase();
  }
  return md5(email);
};

/**
 * Avatar Component with Gmail/Gravatar support
 * @param {Object} props
 * @param {Object} props.user - User object with email, username, avatar
 * @param {number} props.size - Size in pixels (default: 40)
 * @param {string} props.className - Additional CSS classes
 */
export default function Avatar({ user, size = 40, className = '' }) {
  const [imageError, setImageError] = useState(false);
  const [gravatarUrl, setGravatarUrl] = useState(null);
  
  React.useEffect(() => {
    if (user?.email && !user.avatar && !imageError) {
      hashEmail(user.email.toLowerCase().trim()).then(hash => {
        setGravatarUrl(`https://www.gravatar.com/avatar/${hash}?s=${size}&d=404&r=pg`);
      }).catch(() => {
        setImageError(true);
      });
    }
  }, [user?.email, size, imageError]);
  
  if (!user) return null;
  
  const avatarUrl = user.avatar || gravatarUrl;
  const displayName = user.username || 'U';
  const initial = displayName.charAt(0).toUpperCase();
  const avatarColor = getAvatarColor(user.username);
  
  // If we have an avatar URL and no error, try to show image
  if (avatarUrl && !imageError) {
    return (
      <img
        src={avatarUrl}
        alt={displayName}
        className={`rounded-full ${className}`}
        style={{ width: `${size}px`, height: `${size}px`, objectFit: 'cover' }}
        onError={() => setImageError(true)}
      />
    );
  }
  
  // Fallback: Show colored circle with initial
  return (
    <div
      className={`rounded-full ${avatarColor} flex items-center justify-center font-bold text-white shadow-md ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {initial}
    </div>
  );
}
