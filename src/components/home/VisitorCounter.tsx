"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    async function hit() {
      try {
        const res = await fetch("https://api.countapi.xyz/hit/soulmaskbr/visits")
        const data = await res.json()
        if (data.value) setCount(data.value)
      } catch {
        // silently fail
      }
    }
    hit()
  }, [])

  if (count === null) return null

  return (
    <div className="fixed bottom-4 left-4 flex items-center gap-1.5 text-neutral-600 text-xs">
      <Eye size={14} />
      <span className="tabular-nums">{count.toLocaleString("pt-BR")}</span>
    </div>
  )
}
