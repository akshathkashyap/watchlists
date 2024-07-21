import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
    matcher: "/((?!api|_next/static|_next/image|favicon.ico|login|sign-up|.*\\..*).*)"
};

export default function middleware(request: NextRequest) {
    if (request.cookies.has("authId")) {
        return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/login", request.url));
}
