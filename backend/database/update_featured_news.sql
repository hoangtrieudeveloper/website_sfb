-- Update one news article to be featured
-- This will set the first published article as featured

UPDATE news 
SET is_featured = true 
WHERE id = (
  SELECT id 
  FROM news 
  WHERE status = 'published' 
  ORDER BY published_date DESC, id DESC 
  LIMIT 1
)
AND status = 'published';

-- Or set a specific article as featured by slug
-- UPDATE news SET is_featured = true WHERE slug = 'sfb-cloud-gen-2' AND status = 'published';

