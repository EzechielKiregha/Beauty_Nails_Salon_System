'use client';

import { useEffect, useState } from "react";
import { CheckCircle, DockIcon, Download, Gift, X } from "lucide-react"; // Import Gift icon
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "./ui/badge";

export default function FloatingReceipt() {

  const storage = typeof window !== "undefined" ? window.localStorage : null;
  storage?.setItem("time", "5");

  const [remainingTime, setRemainingTime] = useState<number | null>(Number(storage?.getItem("time")) * 60); // 5 minutes countdown

  const router = useRouter();
  const params = useSearchParams();
  const url = decodeURIComponent(params.get("url") || "");

  const isUrlValid = url && url.startsWith("/api/");
  const [visible, setVisible] = useState(isUrlValid)

  // Countdown timer for payment
  useEffect(() => {
    if (remainingTime === null || remainingTime <= 0) {
      setRemainingTime(null);
      setVisible(false);
      router.replace("/dashboard/client"); // Redirect to dashboard after countdown
      return;
    };

    const timer = setTimeout(() => {
      setRemainingTime(prev => prev! - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [remainingTime]);

  const triggerConfetti = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 } });
  };

  return (
    <div className="fixed bottom-4 left-4 flex flex-col gap-3 z-50">
      <AnimatePresence>

        {/* 🎁 BONUS BUBBLE (Logic: Claimable OR has active bonus percentage) */}
        {(visible || isUrlValid) && (
          <motion.div
            initial={{ scale: 0, x: 50 }}
            animate={{ scale: 1, x: 0 }}
            exit={{ scale: 0, x: 50 }}
            whileHover={{ scale: 1.05 }}
          >
            <Popover>
              <PopoverTrigger asChild>
                <div
                  onClick={visible ? triggerConfetti : undefined}
                  className={`relative flex flex-col items-center justify-center w-24 h-24 rounded-full shadow-2xl cursor-pointer border-4 border-white dark:border-gray-800 text-white
                    ${visible && "bg-linear-to-br from-pink-500 to-purple-600 animate-bounce"}
                  `}
                >
                  <Download className="w-8 h-8 mb-1" />
                  <span className="text-xs font-black uppercase tracking-tighter">
                    {visible ? "Réçu prêt" : "Voir reçu"}
                  </span>

                  {/* Small pulse ring for attention */}
                  {visible && (
                    <span className="absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-25"></span>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent side="left" className="w-72 bg-linear-to-br from-purple-50 to-pink-50 dark:from-gray-950 dark:to-gray-950 p-4 rounded-2xl text-center shadow-sm hover:shadow-lg transition border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400">
                {visible && (
                  <div className="flex flex-col gap-2 pt-2">
                    <p className="text-lg text-pink-600 dark:text-pink-400 font-medium flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4" /> Votre reçu est prêt.
                    </p>
                    {remainingTime !== null && remainingTime > 0 && (
                      <Badge variant="secondary" className="w-fit text-sm">
                        Télécharger votre reçu dans {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
                      </Badge>

                    )}
                    <button
                      onClick={() => {
                        window.open(url, "_blank");
                      }}
                      className="mt-4 px-4 py-2 rounded-lg bg-pink-500 text-white"
                    >
                      Télécharger le reçu
                    </button>
                  </div>

                )}
              </PopoverContent>
            </Popover>
          </motion.div>
        )}

        {/* 🧾 RECEIPT BUBBLE */}
      </AnimatePresence>
    </div>
  );
}