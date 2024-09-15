import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                name: { label: "Name", type: "text", placeholder: "John Smith" },
                email: { label: "Email", type: "email", placeholder: "johnsmith@gmail.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const res = await fetch(`${process.env.API_BASE_URL}/api/token`, {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" },
                });
                const user = await res.json();

                if (res.ok && user) {
                    return user;
                }

                return null;
            }
        })
    ]
});
