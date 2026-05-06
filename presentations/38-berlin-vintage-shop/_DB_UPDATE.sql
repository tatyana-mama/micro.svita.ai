-- Run this in Supabase SQL Editor (project ctdleobjnzniqkqomlrq) once Supabase MCP is back,
-- or apply via the supabase MCP tool.
-- Updates concept_catalog row for berlin-vintage-shop after the KAMMER rebuild.

UPDATE concepts_catalog
SET
  name = '38 · KAMMER',
  tagline = 'preserved, not restored.',
  budget_eur = 14000,
  brandbook_pdf_url = 'https://micro.svita.ai/presentations/38-berlin-vintage-shop/KAMMER_deck.pdf',
  brandbook_actualised = true,
  verified = true,
  verified_at = now()
WHERE slug = 'berlin-vintage-shop'
RETURNING slug, name, tagline, brandbook_pdf_url, brandbook_actualised, verified;
