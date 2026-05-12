# World Jumper — VPS Deploy Guide

Target: Ubuntu 22.04 LTS on VPS `187.77.144.38`, domain `worldjumperbd.com`.

The full stack runs from your VPS:

- React SPA (Vite build → `/var/www/worldjumper/dist`) served by Nginx
- Express + PostgreSQL API on `127.0.0.1:3001` managed by PM2
- User uploads in `/var/www/worldjumper/public/uploads/...` served by Nginx
- HTTPS via Let's Encrypt (certbot)
- DNS via Cloudflare (`A` records → `187.77.144.38`)

---

## 1. Install system packages

SSH into the VPS as root (or a sudoer), then:

```bash
apt update && apt upgrade -y
apt install -y curl git build-essential nginx ufw

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# PostgreSQL 16
apt install -y postgresql postgresql-contrib

# Certbot (Let's Encrypt)
apt install -y certbot python3-certbot-nginx

# PM2 (process manager)
npm install -g pm2
```

Open the firewall:

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

---

## 2. Create database + DB user

```bash
sudo -u postgres psql <<'SQL'
CREATE USER wjuser WITH PASSWORD 'CHANGE_ME_STRONG_PASSWORD';
CREATE DATABASE worldjumper OWNER wjuser;
GRANT ALL PRIVILEGES ON DATABASE worldjumper TO wjuser;
SQL
```

Test it:

```bash
psql "postgres://wjuser:CHANGE_ME_STRONG_PASSWORD@localhost:5432/worldjumper" -c '\dt'
```

---

## 3. Clone the repo

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/digiwebdex/world-jumper-hub.git worldjumper
cd /var/www/worldjumper
```

---

## 4. Configure environment

```bash
cp .env.example .env
nano .env          # set DATABASE_URL, JWT_SECRET, etc.

cp .env server/.env   # the server reads from server/.env (or /var/www/worldjumper/.env via symlink)
```

`server/.env` minimum:

```
DATABASE_URL=postgres://wjuser:CHANGE_ME_STRONG_PASSWORD@localhost:5432/worldjumper
JWT_SECRET=$(openssl rand -hex 48)
SESSION_COOKIE_NAME=wj_session
NODE_ENV=production
PORT=3001
APP_URL=https://worldjumperbd.com
UPLOAD_DIR=/var/www/worldjumper/public/uploads
PUBLIC_UPLOAD_BASE=https://worldjumperbd.com/uploads
ADMIN_EMAIL=info@worldjumperbd.com
ADMIN_PASSWORD=Admin@54321#
```

Generate a JWT secret quickly:

```bash
openssl rand -hex 48
```

---

## 5. Install dependencies

```bash
cd /var/www/worldjumper
npm ci

cd /var/www/worldjumper/server
npm ci
```

---

## 6. Run database migrations + seed first admin

```bash
cd /var/www/worldjumper/server
npm run migrate
npm run seed:admin
```

This creates all 7 tables and the first admin:
- Email: `info@worldjumperbd.com`
- Password: `Admin@54321#` (hashed with bcrypt; never stored as plaintext)

After the first login you can remove `ADMIN_PASSWORD` from `server/.env`.

---

## 7. Build the frontend

```bash
cd /var/www/worldjumper
npm run build
```

This produces `/var/www/worldjumper/dist/index.html` and `/var/www/worldjumper/dist/assets/...`.

Create the uploads directory tree (Nginx serves it):

```bash
mkdir -p /var/www/worldjumper/public/uploads/{logo,banners,packages,visa-countries,umrah,medical-tourism,documents,misc}
chown -R www-data:www-data /var/www/worldjumper/public/uploads
```

---

## 8. Start the API with PM2

```bash
cd /var/www/worldjumper
pm2 start deploy/ecosystem.config.cjs
pm2 save
pm2 startup systemd -u root --hp /root      # follow the printed command
```

Useful PM2 commands:

```bash
pm2 status
pm2 logs worldjumper-api
pm2 restart worldjumper-api
pm2 stop worldjumper-api
```

Smoke test the API directly:

```bash
curl http://127.0.0.1:3001/api/health
# → {"ok":true}
```

---

## 9. Configure Nginx

```bash
cp /var/www/worldjumper/deploy/nginx.conf.example /etc/nginx/sites-available/worldjumperbd.com
ln -s /etc/nginx/sites-available/worldjumperbd.com /etc/nginx/sites-enabled/worldjumperbd.com
rm -f /etc/nginx/sites-enabled/default

mkdir -p /var/www/letsencrypt
nginx -t && systemctl reload nginx
```

---

## 10. Point Cloudflare DNS at the VPS

In Cloudflare → `worldjumperbd.com` → DNS:

| Type | Name | Content        | Proxy           |
|------|------|----------------|-----------------|
| A    | @    | 187.77.144.38  | DNS only (grey) |
| A    | www  | 187.77.144.38  | DNS only (grey) |

Keep the proxy **off** (grey cloud) until SSL is issued, then you can flip it on.

---

## 11. Issue HTTPS certificate

```bash
certbot --nginx -d worldjumperbd.com -d www.worldjumperbd.com --redirect -m info@worldjumperbd.com --agree-tos -n
```

Certbot adds 443 server blocks and HTTP→HTTPS redirects to your nginx config.
Auto-renewal is already scheduled in `/etc/cron.d/certbot`.

---

## 12. Test everything

```bash
curl https://worldjumperbd.com/api/health
curl https://worldjumperbd.com/api/site-settings
```

Then in a browser:

- Public site: <https://worldjumperbd.com>
- Admin login: <https://worldjumperbd.com/admin/login>

Log in with `info@worldjumperbd.com` / `Admin@54321#` and **change the password** by re-running `seed:admin` with a new `ADMIN_PASSWORD` (or add a "change password" admin route later).

---

## Updating the site after a code change

```bash
cd /var/www/worldjumper
git pull
npm ci                       # only if root deps changed
(cd server && npm ci)        # only if server deps changed
(cd server && npm run migrate) # only if new SQL migrations exist
npm run build                # rebuild SPA
pm2 restart worldjumper-api  # restart API
```

Nginx automatically picks up the new `dist/` files — no reload needed.

---

## Uploading files via the admin panel

In `/admin`, the package and settings forms accept image/PDF URLs. Use the upload helper to push a file to the VPS and copy the returned URL into the form. URLs look like:

```
https://worldjumperbd.com/uploads/logo/world-jumper-logo.jpeg
https://worldjumperbd.com/uploads/packages/<uuid>.jpg
https://worldjumperbd.com/uploads/visa-countries/<uuid>.jpg
https://worldjumperbd.com/uploads/documents/<uuid>.pdf
```

Allowed types: `jpg`, `jpeg`, `png`, `webp`, `pdf`. Size cap: 10 MB.

---

## Troubleshooting

- **502 Bad Gateway**: `pm2 logs worldjumper-api` → fix the error → `pm2 restart worldjumper-api`.
- **Login fails**: check `pm2 logs`, verify `JWT_SECRET` is set, re-run `npm run seed:admin`.
- **Uploads 404**: confirm `/var/www/worldjumper/public/uploads/` exists and is readable by `www-data`.
- **Nginx config error**: `nginx -t` shows the line number.
