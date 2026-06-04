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
      sessionId,
      customerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
    } = body

    if (!sessionId || !customerName || !email || !phone || !address || !city || !state || !pincode) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, customerName, email, phone, address, city, state, pincode' },
        { status: 400 }
      )
    }

    const cartItems = await db.cartItem.findMany({
      where: { sessionId },
      include: { product: true },
    })

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty. Add items before placing an order.' },
        { status: 400 }
      )
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )

    const orderItems = cartItems.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
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

    await db.cartItem.deleteMany({
      where: { sessionId },
    })

    // Build WhatsApp notification URL for the admin
    const itemSummary = orderItems.map((i) => `${i.name} x${i.quantity}`).join(', ')
    const orderMessage = `🛍️ New Order!\nNumber: ${orderNumber}\nCustomer: ${customerName}\nPhone: ${phone}\nEmail: ${email}\nTotal: ₹${totalAmount.toLocaleString()}\nItems: ${itemSummary}\nAddress: ${address}, ${city}, ${state} - ${pincode}`
    const whatsappUrl = `https://wa.me/917678279825?text=${encodeURIComponent(orderMessage)}`

    // Also build the customer's tracking WhatsApp URL
    const customerMessage = `Hi Mazzini! I placed an order. My order number is ${orderNumber}. Please confirm.`
    const customerWhatsappUrl = `https://wa.me/917678279825?text=${encodeURIComponent(customerMessage)}`

    console.log(`[ORDER CREATED] ${orderNumber} - ${customerName} - ₹${totalAmount}`)
    console.log(`[WHATSAPP NOTIFY] ${whatsappUrl}`)

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
