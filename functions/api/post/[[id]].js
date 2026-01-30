
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function onRequestGet({ env, params }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return json({ message: "invalid id" }, 400);

  // 조회수 +1
  await env.D1_DB.prepare(
    "UPDATE community_post SET view_count = view_count + 1 WHERE post_id = ?"
  ).bind(id).run();

  const post = await env.D1_DB.prepare(
    `SELECT post_id, title, content, view_count, created_at, user_id
     FROM community_post
     WHERE post_id = ? AND deleted_at IS NULL`
  ).bind(id).first();

  if (!post) return json({ message: "not found" }, 404);
  return json(post);
}

export async function onRequestDelete({ env, params, request }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return json({ message: "invalid id" }, 400);

  let body = {};
  try { body = await request.json(); } catch {}

  const userId = Number(body.user_id);
  if (!userId) return json({ message: "user_id required" }, 400);

  const row = await env.D1_DB.prepare(
    "SELECT user_id FROM community_post WHERE post_id = ? AND deleted_at IS NULL"
  ).bind(id).first();

  if (!row) return json({ message: "not found" }, 404);
  if (Number(row.user_id) !== userId) return json({ message: "forbidden" }, 403);

  await env.D1_DB.prepare(
    "UPDATE community_post SET deleted_at = CURRENT_TIMESTAMP WHERE post_id = ?"
  ).bind(id).run();

  return json({ ok: true });
}
