import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { connection } from "next/server";

import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";

const PlatformLayout = async ({ children }: { children: React.ReactNode }) => {
  await connection();
  return (
    <ClerkProvider>
      <QueryProvider>
        <Toaster />
        <ModalProvider />
        {children}
      </QueryProvider>
    </ClerkProvider>
  );
};

export default PlatformLayout;
