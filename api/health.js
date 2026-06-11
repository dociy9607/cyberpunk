const { json, serviceMode } = require("./_auth");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { error: "method_not_allowed" });
  return json(res, 200, {
    ok: true,
    auth: serviceMode(),
    requirements: {
      loginApi: true,
      sessionCookieDays: 30,
      accountAdminApi: true,
      persistentAccountStore: serviceMode().persistent,
      persistentStoreNeeds: serviceMode().persistent ? [] : [
        "KV_REST_API_URL + KV_REST_API_TOKEN",
        "or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN",
      ],
    },
  });
};
