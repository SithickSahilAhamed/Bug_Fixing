const crypto=require("crypto")

// CHANGE #4 - Security Bug Fix: removed deprecated createCipher (no IV) 
// Now uses scryptSync to derive a secure 32-byte key from a passphrase + salt
const key=crypto.scryptSync("mysecretkey", "salt", 32)
const tokenKey=crypto.scryptSync("tokensecret", "salt", 32)

// CHANGE #7 - Security Feature: centralized token expiry constant (1 hour)
const TOKEN_EXPIRY = 60 * 60 * 1000 // 1 hour in milliseconds

// CHANGE #4 (continued): encrypt now uses createCipheriv with random IV
// Each encryption produces a different ciphertext even for the same input
exports.encrypt=function(text){
  const iv = crypto.randomBytes(16)
  const cipher=crypto.createCipheriv("aes-256-cbc",key, iv)
  let encrypted=cipher.update(text,"utf8","hex")
  encrypted+=cipher.final("hex")
  // IV is prefixed to ciphertext so decrypt can read it back
  return iv.toString('hex') + ':' + encrypted
}

// CHANGE #4 (continued): decrypt reads the IV prefix before decrypting
exports.decrypt=function(text){
  try {
    const textParts = text.split(':')
    if(textParts.length !== 2) return text
    const iv = Buffer.from(textParts.shift(), 'hex')
    const encryptedText = textParts.join(':')
    const decipher=crypto.createDecipheriv("aes-256-cbc",key, iv)
    let decrypted=decipher.update(encryptedText,"hex","utf8")
    decrypted+=decipher.final("utf8")
    return decrypted
  } catch(err) {
    return text
  }
}

// CHANGE #5 - Security Bug Fix: Token generation using HMAC-SHA256
// Old code had no token mechanism at all — anyone could access /notes
// New: generates a signed custom JWT-like token with a 1-hour expiration
exports.generateToken = function(payload) {
  // CHANGE #7: embed expiry timestamp in every token
  const tokenPayload = { ...payload, exp: Date.now() + TOKEN_EXPIRY }
  const data = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');
  const signature = crypto.createHmac('sha256', tokenKey).update(data).digest('base64');
  return `${data}.${signature}`;
}

// CHANGE #5 (continued): Token verification checks signature AND expiry
// CHANGE #6 - Robustness: strips Bearer prefix, whitespace, and stray quotes
// so tokens work whether passed raw or via Bearer Token tab in Thunder Client
exports.verifyToken = function(token) {
  if(!token) throw new Error("No token")
  
  // CHANGE #6: Robustly handle Bearer prefix, quotes, and whitespace
  let cleanToken = token.trim()
  if (cleanToken.startsWith("Bearer ")) {
    cleanToken = cleanToken.slice(7).trim()
  }
  // Remove wrapping quotes if they exist (e.g., pasted with quotes from Thunder Client)
  cleanToken = cleanToken.replace(/^["']|["']$/g, '')

  const parts = cleanToken.split('.');
  if(parts.length !== 2) throw new Error("Invalid token format")
  
  const [data, signature] = parts;
  const validSignature = crypto.createHmac('sha256', tokenKey).update(data).digest('base64');
  
  // CHANGE #5: Reject tokens with invalid signatures (tamper protection)
  if (signature !== validSignature) {
    throw new Error("Invalid token signature")
  }

  const payload = JSON.parse(Buffer.from(data, 'base64').toString('utf8'));
  // CHANGE #7: Reject expired tokens
  if (payload.exp && Date.now() > payload.exp) {
    throw new Error("Token expired")
  }
  return payload;
}