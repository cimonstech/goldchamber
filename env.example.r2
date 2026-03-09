# Add these to your .env.example (or .env.local)

# Site URL — used for auth redirects (forgot-password, set-password after admin approval)
# Production: https://goldchamber.vercel.app (or your custom domain)
# Local: http://localhost:3000
NEXT_PUBLIC_SITE_URL=https://goldchamber.vercel.app

# Cloudflare R2 — media, documents, images (S3-compatible storage)
# Create API token: Cloudflare Dashboard → R2 → Manage R2 API tokens
# Account ID: Dashboard → Overview → right sidebar
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=clgb-media
# Public URL for serving files (R2.dev subdomain or custom domain)
# Format: https://<bucket>.<account>.r2.dev or https://cdn.yourdomain.com
R2_PUBLIC_URL=https://pub-xxx.r2.dev
