"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import {
  ClerkProvider as RealClerkProvider,
  Show as RealShow,
  SignIn as RealSignIn,
  SignInButton as RealSignInButton,
  SignUp as RealSignUp,
  useClerk as realUseClerk,
  useUser as realUseUser,
} from "@clerk/nextjs";

const MOCK_AUTH_ENABLED = process.env.NEXT_PUBLIC_E2E_MOCK_AUTH === "1";

const mockUser = {
  id: "e2e-user",
  fullName: "Test Reader",
  imageUrl: undefined,
};

type ClerkProviderProps = ComponentProps<typeof RealClerkProvider>;
type SignInButtonProps = ComponentProps<typeof RealSignInButton>;

export function ClerkProvider(props: ClerkProviderProps) {
  if (MOCK_AUTH_ENABLED) {
    return <>{props.children}</>;
  }

  return <RealClerkProvider {...props} />;
}

export function useUser() {
  if (MOCK_AUTH_ENABLED) {
    return {
      isLoaded: true,
      isSignedIn: true,
      user: mockUser,
    };
  }

  return realUseUser();
}

export function useClerk() {
  if (MOCK_AUTH_ENABLED) {
    return {
      signOut: async ({ redirectUrl }: { redirectUrl?: string } = {}) => {
        if (typeof window !== "undefined") {
          window.location.assign(redirectUrl ?? "/sign-in");
        }
      },
    };
  }

  return realUseClerk();
}

export function Show({
  when,
  children,
}: {
  when: "signed-in" | "signed-out";
  children: ReactNode;
}) {
  if (MOCK_AUTH_ENABLED) {
    return when === "signed-in" ? <>{children}</> : null;
  }

  return <RealShow when={when}>{children}</RealShow>;
}

export function SignInButton(props: SignInButtonProps) {
  if (!MOCK_AUTH_ENABLED) {
    return <RealSignInButton {...props} />;
  }

  return (
    <span
      onClick={() => {
        if (typeof window !== "undefined") {
          window.location.assign("/");
        }
      }}
    >
      {props.children}
    </span>
  );
}

export function SignIn() {
  if (!MOCK_AUTH_ENABLED) {
    return <RealSignIn />;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Mock Sign In</h2>
      <p className="mt-2 text-sm text-gray-500">
        End-to-end tests bypass Clerk and start with a signed-in reader.
      </p>
      <Link
        href="/"
        className="mt-4 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
      >
        Continue to app
      </Link>
    </div>
  );
}

export function SignUp() {
  if (!MOCK_AUTH_ENABLED) {
    return <RealSignUp />;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Mock Sign Up</h2>
      <p className="mt-2 text-sm text-gray-500">
        End-to-end tests bypass Clerk and start with a signed-in reader.
      </p>
      <Link
        href="/"
        className="mt-4 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
      >
        Continue to app
      </Link>
    </div>
  );
}
