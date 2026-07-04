import { NextRequest, NextResponse } from "next/server";
import { getUserData, getAuthToken } from "./app/lib/cookie";
const publicPaths = ["/auth/login", "/auth/register", "/auth/forgot-password"];
const adminPaths = ["/admin"]

export async function proxy(req: NextRequest) {
    
    
    const {pathname} = req.nextUrl; 
    const token = await getAuthToken();
    const user = token ? await getUserData(): null; 

    const isPublicPath =  publicPaths.some(path => pathname.startsWith(path));

    const isAdminPath = adminPaths.some(path => pathname.startsWith(path));


    if(!user && !isPublicPath){
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if(user && token){
        if(isAdminPath && user.role!== "admin"){
            return NextResponse.redirect(new URL("/", req.url));
        }
    }
    if(isPublicPath && user ){
        return NextResponse.redirect(new URL("/", req.url));
    }

}

export const config = {
    matcher: [
        
        "/admin/:path*", 
        "/auth/login", 
        "/auth/register"
    ] ,
    
}