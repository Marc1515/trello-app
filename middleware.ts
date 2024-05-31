import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse, NextRequest } from "next/server";

// Define el tipo Auth para incluir posibles valores nulos y undefined
interface Auth {
  userId: string | null;
  orgId: string | null | undefined;
  isPublicRoute: boolean;
  isApiRoute: boolean;
}

export default authMiddleware({
  publicRoutes: ["/", "/api/webhook"],

  async afterAuth(auth: Auth, req: NextRequest) {
    console.log("Auth details:", auth);
    console.log("Request URL:", req.url);

    if (auth.userId && auth.isPublicRoute) {
      let path = "/select-org";

      if (auth.orgId) {
        path = `/organization/${auth.orgId}`;
      }
      const orgSelection = new URL(path, req.url);
      return NextResponse.redirect(orgSelection);
    }

    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/select-org") {
      const orgSelection = new URL("/select-org", req.url);
      return NextResponse.redirect(orgSelection);
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
