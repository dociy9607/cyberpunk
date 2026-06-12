const {
  getAccounts,
  hashPassword,
  json,
  readBody,
  readSession,
  safeAccount,
  saveAccounts,
  serviceMode,
} = require("./_auth");

function requireAdmin(req, res) {
  const session = readSession(req);
  if (!session) {
    json(res, 401, { error: "unauthenticated" });
    return null;
  }
  if (session.role !== "admin") {
    json(res, 403, { error: "forbidden" });
    return null;
  }
  return session;
}

module.exports = async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;

  try {
    if (req.method === "GET") {
      const accounts = await getAccounts();
      return json(res, 200, {
        accounts: accounts.map(safeAccount),
        service: serviceMode(),
      });
    }

    if (req.method === "POST") {
      const { username, password, role } = await readBody(req);
      const cleanUsername = String(username || "").trim();
      if (!cleanUsername || !password || String(password).length < 6) {
        return json(res, 400, { error: "invalid_account" });
      }

      const accounts = await getAccounts();
      if (accounts.some((item) => item.username === cleanUsername)) {
        return json(res, 409, { error: "account_exists" });
      }

      accounts.push({
        username: cleanUsername,
        role: role === "admin" ? "admin" : "user",
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString(),
      });
      await saveAccounts(accounts);
      return json(res, 201, {
        accounts: accounts.map(safeAccount),
        service: serviceMode(),
      });
    }

    if (req.method === "DELETE") {
      const { username } = await readBody(req);
      const cleanUsername = String(username || "").trim();
      if (!cleanUsername || cleanUsername === "admin" || cleanUsername === session.username) {
        return json(res, 400, { error: "cannot_delete_account" });
      }
      const accounts = (await getAccounts()).filter((item) => item.username !== cleanUsername);
      await saveAccounts(accounts);
      return json(res, 200, {
        accounts: accounts.map(safeAccount),
        service: serviceMode(),
      });
    }

    return json(res, 405, { error: "method_not_allowed" });
  } catch (error) {
    return json(res, 500, { error: "accounts_failed", detail: error.message });
  }
};
