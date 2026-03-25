'use client';

import FloatingBubbles from "@/components/FloatingBubbles";
import { useAppointments } from "@/lib/hooks/useAppointments";
import { useAuth } from "@/lib/hooks/useAuth";

export default function AppClientLayer() {
  const { appointments = [] } = useAppointments();
  const { user } = useAuth();

  // 🔥 prepare data HERE (not in layout)
  const ongoingAppointments = appointments
    .filter((a: any) => a.status === "in_progress")
    .map((a: any) => ({
      ...a,
      startTime: a.updatedAt,
      duration: a.service?.duration || 60,
    }));

  if (!user) return null;

  return (
    <>
      <FloatingBubbles
        appointments={ongoingAppointments}
        user={user}
      />
    </>
  );
}