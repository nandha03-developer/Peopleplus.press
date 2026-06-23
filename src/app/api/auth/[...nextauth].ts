import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: "250303656162-b2hcppkfqq8j1ig79bla5b5s6t2oemh4",
      clientSecret: "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",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Recommended to set a secret
  pages: {
    signIn: '/auth/signin', // Custom sign-in page (optional)
  },
};

export default NextAuth(authOptions);
