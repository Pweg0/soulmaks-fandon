export const runtime = 'nodejs' // REQUIRED — Edge cannot do TCP

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import net from 'net'

async function pingServer(ip: string, port: number, timeoutMs = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.connect(port, ip)
    socket.setTimeout(timeoutMs)
    socket.on('connect', () => { socket.destroy(); resolve(true) })
    socket.on('timeout', () => { socket.destroy(); resolve(false) })
    socket.on('error', () => resolve(false))
  })
}

export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  const { data: servers, error } = await supabase
    .from('servers')
    .select('id, ip, port')

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch servers' }, { status: 500 })
  }

  const results = await Promise.allSettled(
    (servers ?? []).map(async (server) => {
      const online = await pingServer(server.ip, server.port)
      await supabase
        .from('servers')
        .update({
          is_online: online,
          last_checked: new Date().toISOString(),
        })
        .eq('id', server.id)
      return { id: server.id, online }
    })
  )

  const checked = results.filter(r => r.status === 'fulfilled').length
  const failed = results.filter(r => r.status === 'rejected').length

  return NextResponse.json({
    checked,
    failed,
    timestamp: new Date().toISOString(),
  })
}
