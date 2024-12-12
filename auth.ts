import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

import { IAccount } from './database/account.model';
import { api } from './lib/api';
import { ActionResponse } from './types/global';

// We'll check if the sign-in account type is credentials; if yes, then we skip. we'll handle it the other way around when doing email password-based authentication.

// But if the account type is not credentials, we'll check this new `signin-with-oauth` app and create oAuth accounts for the user.

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SCERET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SCERET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.userId = token.sub as string;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        const { data: existingAccount, success } =
          (await api.accounts.getByProvider(
            account.type === 'credentials'
              ? token.email!
              : account.providerAccountId,
          )) as ActionResponse<IAccount>;

        if (!success || !existingAccount) return token;

        const userId = existingAccount.userId;

        if (userId) token.sub = userId.toString();
      }
      return token;
    },
    async signIn({ user, profile, account }) {
      if (account?.type === 'credentials') return true;
      if (!account || !user) return false;

      const userInfo = {
        name: user.name!,
        username:
          account.provider === 'github'
            ? (profile?.login as string)
            : (user.name?.toLowerCase() as string),
        email: user.email!,
        image: user.image!,
      };

      const { success } = (await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as 'github' | 'google',
        providerAccountId: account.providerAccountId as string,
      })) as ActionResponse;

      if (!success) return false;

      return true;
    },
  },
});
