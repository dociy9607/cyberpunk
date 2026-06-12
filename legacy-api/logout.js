const { clearCookie, json } = require("./_auth");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "method_not_allowed" });
  return json(res, 200, { ok: true }, { "Set-Cookie": clearCookie() });
};
