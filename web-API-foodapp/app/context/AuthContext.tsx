"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { clearAuthCookies } from "../lib/cookie";
import { useRouter } from "next/navigation";
import { whoAmI } from "../lib/api/auth";

interface AuthContextProps {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    user: any;
    setUser: (user: any) => void;
    logout: () => Promise<void>;
    loading: boolean;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    const checkAuth = async () => {
        try {
            const userData = await whoAmI();
            if (!userData) {
                // avoid downstream crashes if backend returns 401/empty
                setUser(null);
                setIsAuthenticated(false);
                return;
            }

            if (userData) {
                setUser(userData);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (err: any) {
            const msg = err?.message ?? err?.response?.data?.message ?? "";
            console.log("Auth check failed (non-blocking):", msg || err);

            setIsAuthenticated(false);
            setUser(null);
        } finally {

            // Always set loading to false - this is critical!
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();

        // Bootstrap CSRF cookie + in-memory token once on app load.
        // This ensures the browser stores the HttpOnly cookie from /api/csrf.
        (async () => {
            try {
                const axiosModule = await import("../lib/api/axios");
                const axiosInstance = axiosModule.default;
                const { setCsrfToken } = axiosModule;

                const res = await axiosInstance.get("/api/csrf");
                if (res?.data?.csrfToken) {
                    setCsrfToken(res.data.csrfToken);
                }
            } catch (e) {
                console.log("CSRF bootstrap failed (non-blocking):", (e as any)?.message || e);
            }
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const logout = async () => {
        try {
            await clearAuthCookies();
            setIsAuthenticated(false);
            setUser(null);
            router.push("/auth/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, logout, loading, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
