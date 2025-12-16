import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";
import { prisma } from "@/lib/prisma";

// OAuth プロバイダから来る profile の共通形を定義
type OAuthProfile = {
  email?: string;
  name?: string;
  picture?: string;
  username?: string;
  id?: string;
  avatar?: string;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "identify email",
        },
      },
    }),
  ],
  pages: {
    
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Google / Discord 両方のプロバイダで DB と同期する
      const provider = account?.provider;
      const profileObj = profile as OAuthProfile | undefined;
      const email = profileObj?.email as string | undefined;

      if ((provider === "google" || provider === "discord") && email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email },
          });

          let dbUser;

          if (existingUser) {
            dbUser = existingUser;
          } else {
            // provider ごとにニックネーム / アバター候補を決定
            const nickname = profileObj?.name || profileObj?.username || email.split("@")[0];

            let avatarUrl: string | null = null;
            if (provider === "google") {
              avatarUrl = profileObj?.picture || null;
            } else if (provider === "discord") {
              // Discord の場合、アバターは id と avatar ハッシュから生成可能
              if (profileObj?.id && profileObj?.avatar) {
                const ext = profileObj.avatar.startsWith("a_") ? "gif" : "png";
                avatarUrl = `https://cdn.discordapp.com/avatars/${profileObj.id}/${profileObj.avatar}.${ext}`;
              } else {
                avatarUrl = null;
              }
            }

            dbUser = await prisma.user.create({
              data: {
                email,
                nickname,
                avatarUrl,
              },
            });
          }

          // NextAuth の user オブジェクトに DB の ID をセット
          // 型は string に変換して代入
          (user as { id?: string }).id = dbUser.id.toString();
          return true;
        } catch (error) {
          console.error("Error syncing user to database:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account, profile }) {
      // 初回サインイン時にユーザー情報とアカウント情報をトークンに追加
      if (user) {
        token.id = user.id;
        token.email = user.email ?? undefined;
      }
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      if (profile) {
        token.picture = (profile as { picture?: string }).picture;
        token.name = profile.name ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      // セッションにユーザーIDとプロバイダー情報を追加
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
