import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

function generateOrderNumber(): string {
  const num = Math.floor(10000 + Math.random() * 90000)
  return `MZ-${num}`
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')
    const orderNumber = request.nextUrl.searchParams.get('orderNumber')
    const key = request.nextUrl.searchParams.get('key')

    if (orderNumber) {
      const order = await db.order.findUnique({
        where: { orderNumber },
      })
      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ order }, { status: 200 })
    }

    const where = email ? { email } : {}
    const orders = await db.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ orders }, { status: 200 })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      cartItems,
      totalAmount: clientTotal,
    } = body

    if (!customerName || !email || !phone || !address || !city || !state || !pincode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Calculate total from cart items (server-side validation)
    const totalAmount = cartItems.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
      0
    )

    const orderItems = cartItems.map((item: { id: number; name: string; price: number; quantity: number; image: string }) => ({
      productId: String(item.id),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }))

    let orderNumber = generateOrderNumber()
    let attempts = 0
    while (attempts < 10) {
      const existing = await db.order.findUnique({ where: { orderNumber } })
      if (!existing) break
      orderNumber = generateOrderNumber()
      attempts++
    }

    const order = await db.order.create({
      data: {
        orderNumber,
        customerName,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        totalAmount,
        items: JSON.stringify(orderItems),
        status: 'pending',
      },
    })

    // Build WhatsApp notification URL for the admin
    const itemSummary = orderItems.map((i: { name: string; quantity: number }) => `${i.name} x${i.quantity}`).join(', ')
    const orderMessage = `🛍️ New Mazzini Order!\n\n📦 Order: ${orderNumber}\n👤 Customer: ${customerName}\n📞 Phone: ${phone}\n📧 Email: ${email}\n💰 Total: ₹${totalAmount.toLocaleString()}\n💎 Items: ${itemSummary}\n📍 Address: ${address}, ${city}, ${state} - ${pincode}\n\nPlease confirm the order.`
    const whatsappUrl = `https://wa.me/917678279825?text=${encodeURIComponent(orderMessage)}`

    // Customer tracking WhatsApp URL
    const customerMessage = `Hi Mazzini! I placed an order. My order number is ${orderNumber}. Please confirm.`
    const customerWhatsappUrl = `https://wa.me/917678279825?text=${encodeURIComponent(customerMessage)}`

    console.log(`[ORDER CREATED] ${orderNumber} - ${customerName} - ₹${totalAmount}`)

    return NextResponse.json(
      {
        order,
        whatsappUrl,
        customerWhatsappUrl,
        message: 'Order placed successfully!',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderNumber, status } = body

    if (!orderNumber || !status) {
      return NextResponse.json(
        { error: 'Missing orderNumber or status' },
        { status: 400 }
      )
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const order = await db.order.update({
      where: { orderNumber },
      data: { status },
    })

    return NextResponse.json({ order }, { status: 200 })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
