// @ts-nocheck

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Spotify from "next-auth/providers/spotify";
import GitLab from "next-auth/providers/gitlab";
import Credentials from "next-auth/providers/credentials"

const BACKEND_ACCESS_TOKEN_LIFETIME = 45 * 60;            // 45 minutes
const BACKEND_REFRESH_TOKEN_LIFETIME = 6 * 24 * 60 * 60;  // 6 days

const getCurrentEpochTime = () => {
  return Math.floor(new Date().getTime() / 1000);
};

const SIGN_IN_HANDLERS = {
  // "credentials": async (user: any, account: any, profile: any, email: any, credentials: any) => {
  //   return true;
  // },
  // "google": async (user: any, account: any, profile: any, email: any, credentials: any) => {
  //   try {

  //     // ///////////////////////////////////////////////
  //     // ///////////////////////////////////////////////
  //     // REMOVE THIS HARDCODED URL
  //     // ///////////////////////////////////////////////
  //     // ///////////////////////////////////////////////
  //     // ///////////////////////////////////////////////

  //     const response = await fetch(`http://127.0.0.1:8000/auth/google/`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ access_token: account.id_token }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     account.meta = await response.json();
  //     return true;
  //   } catch (error) {
  //     console.error('Google sign-in error:', error);
  //     return false;
  //   }
  // },
  "github": async (user: any, account: any, profile: any, email: any, credentials: any) => {
    try {

      // ///////////////////////////////////////////////
      // ///////////////////////////////////////////////
      // REMOVE THIS HARDCODED URL
      // ///////////////////////////////////////////////
      // ///////////////////////////////////////////////
      // ///////////////////////////////////////////////

      const response = await fetch(`http://127.0.0.1:8000/auth/github/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: account.access_token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      account.meta = await response.json();
      return true;
    } catch (error) {
      console.error('Github sign-in error:', error);
      return false;
    }
  },
  "gitlab": async (user: any, account: any, profile: any, email: any, credentials: any) => {
    try {

      // ///////////////////////////////////////////////
      // ///////////////////////////////////////////////
      // REMOVE THIS HARDCODED URL
      // ///////////////////////////////////////////////
      // ///////////////////////////////////////////////
      // ///////////////////////////////////////////////

      const response = await fetch(`http://127.0.0.1:8000/auth/gitlab/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: account.access_token }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      account.meta = await response.json();
      return true;
    } catch (error) {
      console.error('Github sign-in error:', error);
      return false;
    }
  }
};

const SIGN_IN_PROVIDERS = Object.keys(SIGN_IN_HANDLERS);

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: BACKEND_REFRESH_TOKEN_LIFETIME,
  },  
  providers: [
    // Google, 
    GitHub,
    // Spotify,
    GitLab,
    // Credentials({
    //   // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    //   // e.g. domain, username, password, 2FA token, etc.
    //   credentials: {
    //     email: { label: "Email", type: "email" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   authorize: async (credentials) => {
    //     try {
    //       const response = await fetch(`${process.env.API_BASE_URL}/auth/login/`, {
    //         method: "POST",
    //         body: JSON.stringify(credentials),
    //         headers: { "Content-Type": "application/json" },
    //       });
    //       const data = await response.json();

    //       if (data) return data;
    //     } catch (error) {
    //       console.error(error);
    //       throw new Error("Error logging in.");
    //     }

    //     return null;
    //   },
    // }),
  ],
  callbacks: {
    // authorized({ request, auth }) {
    //   const { pathname } = request.nextUrl
    //   if (pathname === "/middleware-example") return !!auth
    //   return true
    // },
    async signIn({ user, account, profile, email, credentials }) {
      if (!SIGN_IN_PROVIDERS.includes(account?.provider as string)) return false;
      return (SIGN_IN_HANDLERS as any)[(account as any).provider](
        user, account, profile, email, credentials
      );
    },

    async jwt({ token, user, account, profile, isNewUser }) {
      // If `user` and `account` are set that means it is a login event
      if (user && account) {
        let backendResponse = account.provider === "credentials" ? user : account.meta;
        token.user = {
          ...backendResponse?.user,
          image: backendResponse?.user?.profile_photo || null,
        };
        token.accessToken = backendResponse?.access;
        token.refreshToken = backendResponse?.refresh;
        token.expiresAt = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
        return token;
      }
      // Refresh the backend token if necessary
      if (getCurrentEpochTime() > token.expiresAt) {
        const response = await fetch(`${process.env.API_BASE_URL}/auth/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: token.refreshToken }),
        });
        const data = await response.json();
        token.accessToken = data.access;
        token.refreshToken = data.refresh;
        token.expiresAt = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
      }
      return token;
    },
    // Since we're using Django as the backend we have to pass the JWT
    // token to the client instead of the `session`.
    async session({ session, user, token }) {
      return token;
    },
  },
  debug: process.env.NODE_ENV !== "production" ? true : false,
})
