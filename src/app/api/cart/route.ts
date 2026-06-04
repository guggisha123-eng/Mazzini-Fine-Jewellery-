import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId query parameter is required' },
        { status: 400 }
      )
    }

    const cartItems = await db.cartItem.findMany({
      where: { sessionId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    })

    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )

    return NextResponse.json(
      { cartItems, total, itemCount: cartItems.length },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, productId, quantity } = body

    if (!sessionId || !productId) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, productId' },
        { status: 400 }
      )
    }

    const product = await db.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    if (!product.inStock) {
      return NextResponse.json(
        { error: 'Product is out of stock' },
        { status: 400 }
      )
    }

    const existingItem = await db.cartItem.findFirst({
      where: { sessionId, productId },
    })

    if (existingItem) {
      const updatedItem = await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (quantity || 1) },
        include: { product: true },
      })
      return NextResponse.json({ cartItem: updatedItem }, { status: 200 })
    }

    const cartItem = await db.cartItem.create({
      data: {
        sessionId,
        productId,
        quantity: quantity || 1,
      },
      include: { product: true },
    })

    return NextResponse.json({ cartItem }, { status: 201 })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, quantity } = body

    if (!id || quantity === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: id, quantity' },
        { status: 400 }
      )
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be at least 1' },
        { status: 400 }
      )
    }

    const existingItem = await db.cartItem.findUnique({ where: { id } })
    if (!existingItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    const cartItem = await db.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true },
    })

    return NextResponse.json({ cartItem }, { status: 200 })
  } catch (error) {
    console.error('Error updating cart item:', error)
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')
    const sessionId = request.nextUrl.searchParams.get('sessionId')

    if (id) {
      const existingItem = await db.cartItem.findUnique({ where: { id } })
      if (!existingItem) {
        return NextResponse.json(
          { error: 'Cart item not found' },
          { status: 404 }
        )
      }

      await db.cartItem.delete({ where: { id } })
      return NextResponse.json(
        { message: 'Item removed from cart' },
        { status: 200 }
      )
    }

    if (sessionId) {
      await db.cartItem.deleteMany({ where: { sessionId } })
      return NextResponse.json(
        { message: 'Cart cleared' },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { error: 'Provide either id or sessionId parameter' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error removing cart item:', error)
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    )
  }
}
