-- ✅ APPLIED 2026-05-07 via Management API.
-- KAMMER PDF uploaded to brandbooks/berlin-vintage-shop.pdf (3018815 bytes).
-- concepts_catalog row updated: name='38 · KAMMER', tagline, budget_eur=14000,
--   brandbook_pdf_url='storage://brandbooks/berlin-vintage-shop.pdf',
--   brandbook_actualised=true, verified=true.
-- Verified live in api.public_verified_catalog via anon key.

-- Original SQL (kept for reference / re-runnability):
UPDATE concepts_catalog
SET
  name                  = '38 · KAMMER',
  tagline               = 'preserved, not restored.',
  budget_eur            = 14000,
  brandbook_pdf_url     = 'storage://brandbooks/berlin-vintage-shop.pdf',
  brandbook_actualised  = true,
  verified              = true,
  verified_at           = now()
WHERE slug = 'berlin-vintage-shop'
RETURNING slug, name, tagline, brandbook_pdf_url, brandbook_actualised, verified;
