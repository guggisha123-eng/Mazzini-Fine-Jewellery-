import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: 'desc' },
    })

    if (products.length === 0) {
      return NextResponse.json(
        { products: [], message: 'No products found. Use /api/seed to populate the database.' },
        { status: 200 }
      )
    }

    return NextResponse.json({ products }, { status: 200 })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      slug,
      description,
      price,
      originalPrice,
      image,
      category,
      subcategory,
      rating,
      reviewCount,
      inStock,
      isFeatured,
      isNew,
    } = body

    if (!name || !slug || !description || price === undefined || !image || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, description, price, image, category' },
        { status: 400 }
      )
    }

    const existingProduct = await db.product.findUnique({ where: { slug } })
    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 409 }
      )
    }

    const product = await db.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(String(price)),
        originalPrice: originalPrice ? parseFloat(String(originalPrice)) : null,
        image,
        category,
        subcategory: subcategory || null,
        rating: rating ?? 4.5,
        reviewCount: reviewCount ?? 0,
        inStock: inStock ?? true,
        isFeatured: isFeatured ?? false,
        isNew: isNew ?? false,
      },
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
