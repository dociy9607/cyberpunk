const { json, readSession, serviceMode } = require("./_auth");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { error: "method_not_allowed" });
  const session = readSession(req);
  if (!session) return json(res, 401, { authenticated: false, service: serviceMode() });
  return json(res, 200, {
    authenticated: true,
    user: {
      username: session.username,
      role: session.role,
      expiresAt: session.exp,
    },
    service: serviceMode(),
  });
};
