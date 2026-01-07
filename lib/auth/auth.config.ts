import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import prisma from '@/lib/prisma';

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      authorize: async (credentials) =>{
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            clientProfile: true,
            workerProfile: true,
          },
        });

        if (!user) {
          throw new Error('Email ou mot de passe incorrect');
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Email ou mot de passe incorrect');
        }

        if (!user.emailVerified) {
          throw new Error('Veuillez vérifier votre email');
        }

        // Return user object with role-specific data
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          isActive: user.isActive,
          // Add role-specific profile data
          clientProfile: user.clientProfile,
          workerProfile: user.workerProfile,
        };
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
        token.avatar = user.avatar;
        token.isActive = user.isActive;
        token.clientProfile = user.clientProfile;
        token.workerProfile = user.workerProfile;
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'client' | 'worker' | 'admin';
        session.user.phone = token.phone as string;
        session.user.avatar = token.avatar as string | null;
        session.user.isActive = token.isActive as boolean;
        session.user.clientProfile = token.clientProfile as any;
        session.user.workerProfile = token.workerProfile as any;
      }
      return session;
    },

    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;

      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAuth = nextUrl.pathname.startsWith('/auth');

      // Redirect to login if accessing dashboard without auth
      if (isOnDashboard && !isLoggedIn) {
        return Response.redirect(new URL('/auth/login', nextUrl));
      }

      // Redirect to appropriate dashboard if logged in and on auth pages
      if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL(`/dashboard/${role}`, nextUrl));
      }

      // Check role-based access
      if (isOnDashboard && isLoggedIn) {
        const dashboardRole = nextUrl.pathname.split('/')[2]; // /dashboard/admin -> 'admin'
        
        if (dashboardRole !== role && role !== 'admin') {
          // Admins can access any dashboard, others only their own
          return Response.redirect(new URL(`/dashboard/${role}`, nextUrl));
        }
      }

      return true;
    },
  },

  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};