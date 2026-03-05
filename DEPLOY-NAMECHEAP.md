# Deploying to Namecheap

You can host this Next.js site on Namecheap in two ways.

---

## Option A: Namecheap VPS (recommended – full site with API)

Use this if you have or will buy a **VPS** (e.g. Namecheap VPS). The site and the gold price API will both work.

### 1. Build locally (standalone)

```bash
npm run build
```

This creates a `.next/standalone` folder and a `.next/static` folder.

### 2. Copy to your VPS

Copy the whole project to the server (e.g. with SCP, SFTP, or Git):

- `.next/standalone/` (entire folder)
- `.next/static/` → into `.next/standalone/.next/static/`
- `public/` → into `.next/standalone/public/`

Example after copying:

```
/var/www/clgb/
  .next/
    standalone/
      server.js
      .next/
        static/   (from .next/static)
      public/    (from your public folder)
  node_modules  (optional; standalone has minimal deps)
```

### 3. On the VPS: install Node.js

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 4. Run with PM2 (keeps the app running)

```bash
sudo npm install -g pm2
cd /var/www/clgb/.next/standalone
pm2 start server.js --name clgb
pm2 save
pm2 startup   # run the command it prints so it starts on reboot
```

Set the port and host:

```bash
PORT=3000 HOSTNAME=0.0.0.0 pm2 start server.js --name clgb
```

### 5. Environment variables

Create `.env.production` (or set env vars in PM2) on the server with:

```
NEXT_PUBLIC_APISED_SECRET=your_apised_key_here
```

Restart after adding env:

```bash
pm2 restart clgb
```

### 6. Nginx as reverse proxy (optional but recommended)

Install nginx, then add a site config (e.g. `/etc/nginx/sites-available/clgb`):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/clgb /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Point your Namecheap domain to the VPS IP (A record). Add SSL with Certbot if you want HTTPS.

---

## Option B: Namecheap Shared Hosting (static only, no API)

Use this only if you have **cPanel/shared hosting** (no Node.js). The site will work, but the **gold price bar will not** (no server to run `/api/gold-price`). You can hide the bar or replace it with a static message.

### 1. Enable static export

In `next.config.mjs`, temporarily use:

```js
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  // ... rest
};
```

Then run:

```bash
npm run build
```

The static site is in the `out/` folder.

### 2. Upload via FTP

- In Namecheap cPanel, open **File Manager** or use an FTP client (FileZilla, etc.).
- Connect to your hosting (host often `ftp.yourdomain.com`, user/pass from cPanel).
- Upload **everything inside** the `out/` folder into `public_html/` (or the folder your domain uses).

### 3. After upload

- Visit `https://yourdomain.com`. The site should load.
- The gold price bar will not work unless you later add a separate API (e.g. serverless) and change the app to call that URL.

To get the gold price bar working again with a full Next.js server, use Option A (VPS) instead.

---

## Summary

| Hosting type        | Use option | Gold price API |
|---------------------|------------|----------------|
| Namecheap VPS       | Option A   | Works          |
| Namecheap Shared/cPanel | Option B   | Does not work (static only) |

For the full site including the gold price bar, use **Option A (VPS)**.
