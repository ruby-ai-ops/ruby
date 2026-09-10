import { PokeLayoutNoWorkspace } from "@ruby-ai/front/components/poke/PokeLayout.tsx";
import { usePokeAuthContext } from "@ruby-ai/front/lib/swr/poke.ts";
import { Spinner } from "@ruby-ai/sparkle";
import { AuthErrorPage } from "@spa/app/components/AuthErrorPage";
import { useAppReadyContext } from "@spa/app/contexts/AppReadyContext";
import { type ReactNode, useEffect } from "react";
import { Outlet } from "react-router-dom";

interface PokeLayoutProps {
  children?: ReactNode;
}

export function PokePage({ children }: PokeLayoutProps) {
  const { authContext, isAuthenticated, authContextError } =
    usePokeAuthContext();

  const signalAppReady = useAppReadyContext();

  useEffect(() => {
    if ((isAuthenticated && authContext) || authContextError) {
      signalAppReady();
    }
  }, [isAuthenticated, authContext, authContextError, signalAppReady]);

  if (authContextError) {
    return <AuthErrorPage error={authContextError} />;
  }

  if (!isAuthenticated || !authContext) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <PokeLayoutNoWorkspace authContext={authContext}>
      {children ?? <Outlet />}
    </PokeLayoutNoWorkspace>
  );
}
