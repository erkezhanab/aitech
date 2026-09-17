import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const locales = ['kk', 'ru', 'en'];
const defaultLocale = 'kk';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract locale from pathname
  const pathnameLocale = locales.find(locale => pathname.startsWith(`/${locale}`));

  // If no locale in path, redirect to default locale
  if (!pathnameLocale) {
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
  }

  const response = NextResponse.next({ request });

  // Demo mode: let everyone in without auth (used while Supabase is unavailable)
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return response;
  }

  // Only these routes need auth checks — everything else passes through
  // without touching Supabase (keeps pages loading even if Supabase is down)
  const protectedPaths = ["/dashboard", "/onboarding", "/catalog", "/lessons", "/quiz", "/profile", "/admin"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(`/${pathnameLocale}${p}`));

  if (!isProtected) {
    return response;
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Fail fast if Supabase is unreachable
    const userPromise = supabase.auth.getUser();
    const timeoutPromise = new Promise<{ data: { user: null } }>(resolve =>
      setTimeout(() => resolve({ data: { user: null } }), 2000)
    );
    const result = await Promise.race([userPromise, timeoutPromise]);
    const user = result?.data?.user;

    if (!user) {
      return NextResponse.redirect(new URL(`/${pathnameLocale}/login`, request.url));
    }

    // Admin routes additionally require admin role
    if (pathname.startsWith(`/${pathnameLocale}/admin`)) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        return NextResponse.redirect(new URL(`/${pathnameLocale}`, request.url));
      }
    }

    return response;
  } catch {
    // Supabase unreachable — send to login rather than hanging
    return NextResponse.redirect(new URL(`/${pathnameLocale}/login`, request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|fonts|manifest.json|sw.js|workbox).*)"],
};
