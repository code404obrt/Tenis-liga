import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: CORS });
  }

  try {
    const body = await req.json();
    const name = body?.name;
    const email = body?.email;

    if (!name || !email) {
      return json({ error: "name and email are required" }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !serviceKey || !anonKey) {
      return json({ error: "Missing env vars" }, 500);
    }

    const adminClient = createClient(supabaseUrl, serviceKey);

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller }, error: authErr } = await adminClient.auth.getUser(token);
    if (authErr || !caller) return json({ error: "Unauthorized" }, 401);

    const { data: callerPlayer } = await adminClient
      .from("players")
      .select("role")
      .eq("user_id", caller.id)
      .single();

    if (callerPlayer?.role !== "admin") {
      return json({ error: "Forbidden — admin only" }, 403);
    }

    // Create auth user
    const { data: authData, error: createErr } = await adminClient.auth.admin.createUser({
      email,
      password: email,
      email_confirm: true,
    });

    if (createErr) return json({ error: createErr.message }, 400);

    // Create player row
    const { error: playerErr } = await adminClient.from("players").insert({
      user_id: authData.user.id,
      name,
      email,
      role: "player",
    });

    if (playerErr) {
      await adminClient.auth.admin.deleteUser(authData.user.id);
      return json({ error: playerErr.message }, 400);
    }

    return json({ ok: true });
  } catch (err) {
    console.error("create-player error:", err);
    return json({ error: String(err) }, 500);
  }
});
