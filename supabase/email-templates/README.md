# Supabase Email Templates

These HTML templates are for **Supabase Auth** email verification and password reset. Copy them into your Supabase project.

## Where to add them

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. **Authentication** → **Email Templates**
3. Select the template type and paste the content

## Templates

| Template | Supabase name | Use |
|----------|---------------|-----|
| `confirmation.html` | **Confirm signup** | Email verification after signup |
| `recovery.html` | **Reset password** | Password reset link |

## Subject lines (suggested)

Copy these into the **Subject** field in Supabase:

- **Confirm signup:** `Confirm your email — Chamber of Licensed Gold Buyers`
- **Reset password:** `Reset your password — Chamber of Licensed Gold Buyers`

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

## Local development (Supabase CLI)

If using Supabase locally, add to `config.toml`:

```toml
[auth.email.template.confirmation]
subject = "Confirm your email — Chamber of Licensed Gold Buyers"
content_path = "./supabase/email-templates/confirmation.html"

[auth.email.template.recovery]
subject = "Reset your password — Chamber of Licensed Gold Buyers"
content_path = "./supabase/email-templates/recovery.html"
```
