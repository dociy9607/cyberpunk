const {
  createSession,
  getAccounts,
  json,
  readBody,
  safeAccount,
  serviceMode,
  sessionCookie,
  verifyPassword,
} = require("./_auth");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "method_not_allowed" });

  try {
    const { username, password } = await readBody(req);
    const accounts = await getAccounts();
    const account = accounts.find((item) => item.username === String(username || "").trim());

    if (!account || !verifyPassword(password, account.passwordHash)) {
      return json(res, 401, { error: "invalid_credentials" });
    }

    const token = createSession(account);
    return json(res, 200, {
      user: safeAccount(account),
      service: serviceMode(),
    }, {
      "Set-Cookie": sessionCookie(token),
    });
  } catch (error) {
    return json(res, 500, { error: "login_failed", detail: error.message });
  }
};
