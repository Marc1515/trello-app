"use client";

import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";

export const MobileSidebar = () => {
  const onOpen = useMobileSidebar((state) => state.onOpen);
  const onClose = useMobileSidebar((state) => state.onClose);
  const isOpen = useMobileSidebar((state) => state.isOpen);

  return <div>Mobile Sidebar</div>;
};
