"use client"

import { useEffect, useState } from "react"

function getTargetDate(): Date {
  // Target: today at 21:00 Brasilia time (UTC-3)
  // If already past 21:00, target tomorrow
  const now = new Date()
  const brasiliaOffset = -3 * 60 // UTC-3 in minutes
  const localOffset = now.getTimezoneOffset()
  const diffMinutes = brasiliaOffset + localOffset

  const brasiliaTime = new Date(now.getTime() + diffMinutes * 60000)

  const target = new Date(brasiliaTime)
  target.setHours(21, 0, 0, 0)

  // Convert back to local time
  const targetLocal = new Date(target.getTime() - diffMinutes * 60000)

  if (targetLocal.getTime() <= now.getTime()) {
    targetLocal.setDate(targetLocal.getDate() + 1)
  }

  return targetLocal
}

interface TimeLeft {
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now())
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function pad(n: number): string {
  return n.toString().padStart(2, "0")
}

export default function CountdownTimer() {
  const [target] = useState(getTargetDate)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft(target))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setTimeLeft(calcTimeLeft(target))
    }, 1000)
    return () => clearInterval(interval)
  }, [target])

  if (!mounted) {
    return (
      <div className="flex gap-4 justify-center">
        {["--", "--", "--"].map((v, i) => (
          <div key={i} className="flex flex-col items-center">
            <span
              className="text-6xl md:text-8xl font-bold text-primary tabular-nums"
              style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
            >
              {v}
            </span>
          </div>
        ))}
      </div>
    )
  }

  const isLaunched = timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

  if (isLaunched) {
    return (
      <div className="text-center">
        <h2
          className="text-4xl md:text-6xl font-bold text-primary animate-pulse"
          style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
        >
          ESTAMOS NO AR!
        </h2>
      </div>
    )
  }

  return (
    <div className="flex gap-6 md:gap-10 justify-center">
      {[
        { value: timeLeft.hours, label: "HORAS" },
        { value: timeLeft.minutes, label: "MINUTOS" },
        { value: timeLeft.seconds, label: "SEGUNDOS" },
      ].map(({ value, label }) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <div className="relative">
            <span
              className="text-6xl md:text-8xl lg:text-9xl font-bold text-primary tabular-nums leading-none"
              style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
            >
              {pad(value)}
            </span>
          </div>
          <span className="text-xs md:text-sm text-muted-foreground tracking-[0.3em] uppercase">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
