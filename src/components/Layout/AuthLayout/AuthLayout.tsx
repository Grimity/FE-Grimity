import { useEffect, PropsWithChildren } from "react";

import { useRouter } from "next/router";

import { useAuthStore } from "@/states/authStore";

import Loader from "@/components/Layout/Loader/Loader";

export default function AuthLayout({ children }: PropsWithChildren) {
  const router = useRouter();

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);

  useEffect(() => {
    if (isAuthReady && !isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [isAuthReady, isLoggedIn, router]);

  if (!isAuthReady || !isLoggedIn) {
    return <Loader />;
  }

  return children;
}
