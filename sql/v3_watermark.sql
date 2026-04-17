-- ============================================================================
-- micro.svita.ai v3: Watermark each brandbook HTML with buyer email.
-- Why: Deters leaking — a PDF'd copy reveals who distributed it.
-- How: server-side injection into <head> and <body> of the returned HTML.
-- Idempotent: replaces existing function.
-- ============================================================================

create or replace function get_brandbook_by_token(p_token uuid) returns text as $$
declare
  row_slug  text;
  owner_id  uuid;
  owner_em  text;
  html      text;
  stamp     text;
  styles    text;
begin
  select concept_slug, user_id into row_slug, owner_id
    from concept_access_tokens where token = p_token;
  if not found then raise exception 'Invalid or revoked token'; end if;

  update concept_access_tokens set last_used_at = now() where token = p_token;

  select email into owner_em from auth.users where id = owner_id;
  stamp := coalesce(owner_em, 'licensed-copy') || ' · SVITA MICRO · ' || to_char(now(),'YYYY-MM-DD');

  html := (select html_content from concept_brandbooks where concept_slug = row_slug);
  if html is null then return null; end if;

  -- Fixed corner stamp + repeating diagonal CSS pattern + print-safe
  styles :=
    '<style id="sv-wm">' ||
    '.sv-wm-corner{position:fixed;top:8px;right:12px;font:10px/1.2 -apple-system,sans-serif;color:rgba(0,0,0,.32);z-index:9999;pointer-events:none;user-select:none;letter-spacing:.04em}' ||
    '.sv-wm-bg{position:fixed;inset:0;pointer-events:none;z-index:9998;opacity:.07;background-image:repeating-linear-gradient(-30deg,transparent 0 180px,rgba(0,0,0,.9) 180px 181px);}' ||
    '.sv-wm-tile{position:fixed;inset:0;pointer-events:none;z-index:9998;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(5,1fr);font:11px/1 monospace;color:rgba(0,0,0,.08);user-select:none}' ||
    '.sv-wm-tile span{display:flex;align-items:center;justify-content:center;transform:rotate(-25deg);white-space:nowrap}' ||
    '@media print{.sv-wm-corner{color:rgba(0,0,0,.45)}.sv-wm-tile{color:rgba(0,0,0,.12)}}' ||
    '</style>';

  html := replace(html, '</head>', styles || '</head>');

  html := replace(
    html,
    '<body',
    '<body data-sv-wm="' || replace(stamp,'"','') || '" ' );

  -- Append watermark overlays right after opening body tag.
  -- We inject before the first existing tag inside body by placing them at end
  -- (works even if body has inline styles).
  html := regexp_replace(
    html,
    '</body>',
    '<div class="sv-wm-corner">' || stamp || '</div>' ||
    '<div class="sv-wm-bg"></div>' ||
    '<div class="sv-wm-tile">' ||
      repeat('<span>' || stamp || '</span>', 15) ||
    '</div></body>',
    'i'
  );

  return html;
end; $$ language plpgsql security definer;

grant execute on function get_brandbook_by_token(uuid) to anon, authenticated;
