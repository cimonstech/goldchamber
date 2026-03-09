# Supabase Email Templates

These HTML templates are for **Supabase Auth** email verification, password reset, and membership invitations. Copy them into your Supabase project.

## Where to add them

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. **Authentication** → **Email Templates**
3. Select the template type and paste the content

## Templates

| Template | Supabase name | Use |
|----------|---------------|-----|
| `confirmation.html` | **Confirm signup** | Email verification after signup |
| `recovery.html` | **Reset password** | Password reset link |
| `invite.html` | **Invite user** | Membership approval invitation (create password) |

## Subject lines (suggested)

Copy these into the **Subject** field in Supabase:

- **Confirm signup:** `Confirm your email — Chamber of Licensed Gold Buyers`
- **Reset password:** `Reset your password — Chamber of Licensed Gold Buyers`
- **Invite user:** `You're invited — Chamber of Licensed Gold Buyers`

## Template variables

Supabase uses Go templating. Available variables:

| Variable | Description |
|----------|-------------|
| `{{ .ConfirmationURL }}` | Link users click (verify or reset) |
| `{{ .Email }}` | User's email |
| `{{ .SiteURL }}` | Your app URL (from Auth settings) |
| `{{ .Data }}` | User metadata (e.g. `{{ .Data.full_name }}`) |
| `{{ .RedirectTo }}` | Redirect URL passed in the request |

## Logo URL

The templates use `{{ .SiteURL }}/primarylogo-white.png` for the logo. Ensure:

1. **Site URL** is set in Supabase: **Authentication** → **URL Configuration** → **Site URL**
2. Your site URL is correct (e.g. `https://chamberofgoldbuyers.com` or `http://localhost:3000` for dev)

For local dev, email links may not load images if the logo is only on localhost. In production, the logo will load from your domain.

## Redirect URLs (required for invite flow)

For membership invitations to work, add these URLs in Supabase:

1. Go to **Authentication** → **URL Configuration**
2. Under **Redirect URLs**, add:
   - `https://yourdomain.com/auth/callback`
   - `https://yourdomain.com/auth/set-password`
   - `https://yourdomain.com/auth/reset-password`
   - For local dev: `http://localhost:3000/auth/callback`, `http://localhost:3000/auth/set-password`, `http://localhost:3000/auth/reset-password`

Both invite and password reset links redirect to `/auth/callback`, which exchanges the auth code for a session and redirects to the target page (set-password or reset-password).

## Local development (Supabase CLI)

If using Supabase locally, add to `config.toml`:

```toml
[auth.email.template.confirmation]
subject = "Confirm your email — Chamber of Licensed Gold Buyers"
content_path = "./supabase/email-templates/confirmation.html"

[auth.email.template.recovery]
subject = "Reset your password — Chamber of Licensed Gold Buyers"
content_path = "./supabase/email-templates/recovery.html"

[auth.email.template.invite]
subject = "You're invited — Chamber of Licensed Gold Buyers"
content_path = "./supabase/email-templates/invite.html"
```
