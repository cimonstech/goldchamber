import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll().map(({ name, value }) => ({ name, value }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // Allow set-password page without session (user sets password from approval email link)
  if (pathname === "/auth/set-password") {
    return response;
  }

  // Not logged in — redirect to login
  if (!user && (pathname.startsWith("/admin") || pathname.startsWith("/portal"))) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (user) {
    // Get user role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, membership_status")
      .eq("id", user.id)
      .single();

    // Member trying to access admin — redirect to portal
    // Fallback: admin@chamberofgoldbuyers.com is always treated as admin (in case profile.role is stale)
    const isAdmin = profile?.role === "admin" || user.email === "admin@chamberofgoldbuyers.com";
    if (pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/portal/dashboard", request.url));
    }

    // Admin trying to access portal — redirect to admin
    if (pathname.startsWith("/portal") && isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    // Member with pending/rejected status trying to access portal
    if (
      pathname.startsWith("/portal") &&
      profile?.role === "member" &&
      profile?.membership_status === "rejected"
    ) {
      return NextResponse.redirect(new URL("/auth/login?reason=rejected", request.url));
    }

    // Logged in user going to login — redirect to their dashboard
    if (pathname === "/auth/login") {
      if (isAdmin) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/portal/dashboard", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/auth/login", "/auth/set-password"],
};
