"use client"

import { useEffect, useState } from "react"

export default function AppointmentCountdown({
  date,
  time,
}: {
  date: string | Date
  time: string
}) {
  const [display, setDisplay] = useState("")
  const [missed, setMissed] = useState(false)

  useEffect(() => {
    const appointmentDate = new Date(date)
    const [h, m] = time.split(":").map(Number)
    appointmentDate.setHours(h)
    appointmentDate.setMinutes(m)

    const interval = setInterval(() => {
      const now = new Date()
      const diff = appointmentDate.getTime() - now.getTime()

      const abs = Math.abs(diff)

      const days = Math.floor(abs / (1000 * 60 * 60 * 24))
      const hours = Math.floor((abs / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((abs / (1000 * 60)) % 60)

      if (diff > 0) {
        setMissed(false)
        if (days <= 0) setDisplay(`${hours}h ${minutes}m`)
        else if (hours <= 0) setDisplay(`${minutes}m`)
        else setDisplay(`${days}j ${hours}h ${minutes}m`)
      } else {
        setMissed(true)
        setDisplay(`${days}j ${hours}h`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [date, time])

  return (
    <div
      className={`rounded-xl p-4 text-center border 
      ${missed
          ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-950 dark:border-red-900"
          : "bg-pink-50 border-pink-200 text-pink-600 dark:bg-pink-950 dark:border-pink-900"
        }`}
    >
      <p className="text-xs uppercase tracking-wide opacity-70">
        {missed ? "Manqué depuis" : "Temps restant"}
      </p>

      <p className="text-3xl font-semibold tracking-tight">
        {display}
      </p>
    </div>
  )
}