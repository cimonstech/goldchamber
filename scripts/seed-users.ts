/**
 * Seed admin and member users for development.
 * Uses Supabase Admin API to create users with email already confirmed.
 *
 * Run: npm run seed-users
 * Requires: SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in .env.local
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });
config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const USERS = [
  {
    email: "admin@chamberofgoldbuyers.com",
    password: "Admin123!",
    full_name: "CLGB Admin",
    role: "admin" as const,
    membership_status: "active" as const,
  },
  {
    email: "member@chamberofgoldbuyers.com",
    password: "Member123!",
    full_name: "Test Member",
    role: "member" as const,
    membership_status: "active" as const,
    membership_tier: "Full Member" as const,
    membership_number: "CLGB-2025-10001",
  },
];

async function seed() {
  console.log("Seeding users...\n");

  for (const u of USERS) {
    try {
      const { data: existing } = await supabase.auth.admin.listUsers();
      const found = existing?.users?.find((x) => x.email === u.email);

      if (found) {
        console.log(`User ${u.email} already exists. Updating profile...`);
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            role: u.role,
            full_name: u.full_name,
            membership_status: u.membership_status,
            ...(u.role === "member" && "membership_tier" in u
              ? { membership_tier: u.membership_tier, membership_number: u.membership_number }
              : {}),
          })
          .eq("id", found.id);

        if (profileError) {
          console.error(`  Profile update failed: ${profileError.message}`);
        } else {
          console.log(`  Profile updated.`);
        }
        continue;
      }

      const { data, error } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { full_name: u.full_name, role: u.role },
      });

      if (error) {
        console.error(`Failed to create ${u.email}: ${error.message}`);
        continue;
      }

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").update({
          role: u.role,
          full_name: u.full_name,
          membership_status: u.membership_status,
          ...(u.role === "member" && "membership_tier" in u
            ? { membership_tier: u.membership_tier, membership_number: u.membership_number }
            : {}),
        }).eq("id", data.user.id);

        if (profileError) {
          console.error(`  Profile update failed: ${profileError.message}`);
        }

        console.log(`Created ${u.email} (${u.role})`);
      }
    } catch (err) {
      console.error(`Error for ${u.email}:`, err);
    }
  }

  console.log("\nDone. Credentials:");
  console.log("  Admin:  admin@chamberofgoldbuyers.com / Admin123!");
  console.log("  Member: member@chamberofgoldbuyers.com / Member123!");
}

seed();
