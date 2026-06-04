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

    const wishlistItems = await db.wishlistItem.findMany({
      where: { sessionId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(
      { wishlistItems, itemCount: wishlistItems.length },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, productId } = body

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

    const existingItem = await db.wishlistItem.findFirst({
      where: { sessionId, productId },
    })

    if (existingItem) {
      return NextResponse.json(
        { error: 'Product is already in your wishlist', wishlistItem: existingItem },
        { status: 409 }
      )
    }

    const wishlistItem = await db.wishlistItem.create({
      data: { sessionId, productId },
      include: { product: true },
    })

    return NextResponse.json({ wishlistItem }, { status: 201 })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to add item to wishlist' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')
    const sessionId = request.nextUrl.searchParams.get('sessionId')
    const productId = request.nextUrl.searchParams.get('productId')

    if (id) {
      const existingItem = await db.wishlistItem.findUnique({ where: { id } })
      if (!existingItem) {
        return NextResponse.json(
          { error: 'Wishlist item not found' },
          { status: 404 }
        )
      }

      await db.wishlistItem.delete({ where: { id } })
      return NextResponse.json(
        { message: 'Item removed from wishlist' },
        { status: 200 }
      )
    }

    if (sessionId && productId) {
      const existingItem = await db.wishlistItem.findFirst({
        where: { sessionId, productId },
      })
      if (!existingItem) {
        return NextResponse.json(
          { error: 'Wishlist item not found' },
          { status: 404 }
        )
      }

      await db.wishlistItem.delete({ where: { id: existingItem.id } })
      return NextResponse.json(
        { message: 'Item removed from wishlist' },
        { status: 200 }
      )
    }

    if (sessionId) {
      await db.wishlistItem.deleteMany({ where: { sessionId } })
      return NextResponse.json(
        { message: 'Wishlist cleared' },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { error: 'Provide id, sessionId, or sessionId + productId parameters' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error removing wishlist item:', error)
    return NextResponse.json(
      { error: 'Failed to remove wishlist item' },
      { status: 500 }
    )
  }
}
