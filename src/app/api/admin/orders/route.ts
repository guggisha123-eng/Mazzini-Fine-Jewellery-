import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_KEY = 'mazzini-admin-2026'

function authenticate(request: NextRequest): boolean {
  const key = request.nextUrl.searchParams.get('key')
  return key === ADMIN_KEY
}

export async function GET(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const page = parseInt(request.nextUrl.searchParams.get('page') || '1', 10)
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20', 10)
    const status = request.nextUrl.searchParams.get('status')

    const where = status ? { status } : {}

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.order.count({ where }),
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }, { status: 200 })
  } catch (error) {
    console.error('Error fetching admin orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { orderId, status: newStatus } = body

    if (!orderId || !newStatus) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, status' },
        { status: 400 }
      )
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    const order = await db.order.findUnique({ where: { id: orderId } })
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    })

    console.log(`[ORDER STATUS UPDATED] ${order.orderNumber}: ${order.status} → ${newStatus}`)

    return NextResponse.json({
      order: updatedOrder,
      message: `Order status updated to ${newStatus}`,
    }, { status: 200 })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}
