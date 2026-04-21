import crypto from "crypto";

export function generateToken04(appID, userID, serverSecret, effectiveTimeInSeconds, payload = "") {
  const version = "04";
  const expirationTime = Math.floor(Date.now() / 1000) + effectiveTimeInSeconds;

  const nonce = Math.floor(Math.random() * 2147483647);
  const ctime = Math.floor(Date.now() / 1000);

  const tokenInfo = {
    app_id: appID,
    user_id: userID,
    nonce,
    ctime,
    expire: expirationTime,
    payload
  };

  const base64TokenInfo = Buffer.from(JSON.stringify(tokenInfo)).toString("base64");

  const hmac = crypto.createHmac("sha256", serverSecret);
  hmac.update(base64TokenInfo);

  const signature = hmac.digest("base64");

  return `${version}${base64TokenInfo}.${signature}`;
}