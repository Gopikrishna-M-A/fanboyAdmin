  import GoogleProvider from "next-auth/providers/google"
  import { MongoDBAdapter } from "@auth/mongodb-adapter"
  import clientPromise from "@/lib/mongodb"
  const email1 = process.env.EMAIL1
  const email2 = process.env.EMAIL2
  const email3 = process.env.EMAIL3

  const isAllowedToSignIn = (email) => {
    return [email1, email2, email3].includes(email)
  }

  export const authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, user }) {
        if (session?.user) {
          session.user.id = user.id;
          session.user.address = user.address;
        }
        return session;
      },
      async signIn({ user, account, profile, email, credentials }) {
        if (isAllowedToSignIn(user.email)) {
          return true
        } else {
          return false
        }
      }
    },
    cookies: {
      sessionToken: {
        name: `next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: true
        }
      },
    },
  }