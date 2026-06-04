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

    const [
      totalOrders,
      totalRevenueResult,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      productsCount,
      todayOrders,
    ] = await Promise.all([
      db.order.count(),
      db.order.aggregate({ _sum: { totalAmount: true } }),
      db.order.count({ where: { status: 'pending' } }),
      db.order.count({ where: { status: 'confirmed' } }),
      db.order.count({ where: { status: 'shipped' } }),
      db.order.count({ where: { status: 'delivered' } }),
      db.product.count(),
      db.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ])

    const totalRevenue = totalRevenueResult._sum.totalAmount || 0

    return NextResponse.json({
      totalOrders,
      totalRevenue,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      productsCount,
      todayOrders,
    }, { status: 200 })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
