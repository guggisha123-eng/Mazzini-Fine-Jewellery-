import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

const seedProducts = [
  {
    name: 'Royal Kundan Necklace Set',
    slug: 'royal-kundan-necklace-set',
    description:
      'A stunning Kundan necklace set featuring intricate gold-plated settings with uncut diamond simulants. Perfect for weddings and grand celebrations, this set includes a matching pair of earrings.',
    price: 2499,
    originalPrice: 3999,
    image: '/images/products/necklace-1.png',
    category: 'Necklaces',
    subcategory: 'Kundan',
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    isFeatured: true,
    isNew: false,
  },
  {
    name: 'Pearl Elegance Necklace',
    slug: 'pearl-elegance-necklace',
    description:
      'A graceful pearl necklace with lustrous faux pearls strung on a delicate gold-plated chain. The timeless design complements both traditional and contemporary outfits.',
    price: 1899,
    originalPrice: 2799,
    image: '/images/products/necklace-2.png',
    category: 'Necklaces',
    subcategory: 'Pearl',
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    isFeatured: true,
    isNew: true,
  },
  {
    name: 'Ruby Jhumka Earrings',
    slug: 'ruby-jhumka-earrings',
    description:
      'Traditional jhumka earrings adorned with radiant ruby-red stones and delicate gold-plated filigree work. A classic choice for festive occasions.',
    price: 899,
    originalPrice: 1299,
    image: '/images/products/earring-1.png',
    category: 'Earrings',
    subcategory: 'Jhumka',
    rating: 4.7,
    reviewCount: 203,
    inStock: true,
    isFeatured: false,
    isNew: false,
  },
  {
    name: 'Emerald Chandelier Earrings',
    slug: 'emerald-chandelier-earrings',
    description:
      'Opulent chandelier earrings featuring cascading emerald-green stones set in antique gold-plated metal. A statement piece for special events.',
    price: 1299,
    originalPrice: 1899,
    image: '/images/products/earring-2.png',
    category: 'Earrings',
    subcategory: 'Chandelier',
    rating: 4.5,
    reviewCount: 67,
    inStock: true,
    isFeatured: false,
    isNew: true,
  },
  {
    name: 'Polki Diamond Choker',
    slug: 'polki-diamond-choker',
    description:
      'A magnificent Polki diamond choker with uncut stone simulants set in a traditional gold-plated framework. The choker sits elegantly on the neckline for a regal look.',
    price: 3299,
    originalPrice: 4999,
    image: '/images/products/choker-1.png',
    category: 'Necklaces',
    subcategory: 'Choker',
    rating: 4.9,
    reviewCount: 56,
    inStock: true,
    isFeatured: true,
    isNew: false,
  },
  {
    name: 'Royal Ruby Cocktail Ring',
    slug: 'royal-ruby-cocktail-ring',
    description:
      'A bold cocktail ring featuring a large ruby-red centre stone surrounded by clear crystal accents on a gold-plated band. Perfect for making a statement.',
    price: 799,
    originalPrice: 1199,
    image: '/images/products/ring-1.png',
    category: 'Rings',
    subcategory: 'Cocktail',
    rating: 4.4,
    reviewCount: 145,
    inStock: true,
    isFeatured: false,
    isNew: false,
  },
  {
    name: 'Gold-Plated Bangle Set',
    slug: 'gold-plated-bangle-set',
    description:
      'A set of four gold-plated bangles with intricate etched patterns and subtle stone accents. Stack them together or wear individually for versatile styling.',
    price: 1499,
    originalPrice: 2199,
    image: '/images/products/bangle-1.png',
    category: 'Bangles',
    subcategory: 'Set',
    rating: 4.6,
    reviewCount: 92,
    inStock: true,
    isFeatured: true,
    isNew: false,
  },
  {
    name: 'Kundan Maang Tikka',
    slug: 'kundan-maang-tikka',
    description:
      'A traditional maang tikka with Kundan stone settings and a delicate gold-plated chain. The centrepiece features an ornate floral motif that graces the forehead beautifully.',
    price: 599,
    originalPrice: 899,
    image: '/images/products/maang-tikka-1.png',
    category: 'Maang Tikka',
    subcategory: 'Kundan',
    rating: 4.3,
    reviewCount: 78,
    inStock: true,
    isFeatured: false,
    isNew: false,
  },
  {
    name: 'Heart Locket Necklace',
    slug: 'heart-locket-necklace',
    description:
      'A romantic heart-shaped locket on a fine gold-plated chain. The locket opens to hold a tiny photograph or keepsake, making it a meaningful gift.',
    price: 1199,
    originalPrice: 1699,
    image: '/images/products/locket-1.png',
    category: 'Pendants & Lockets',
    subcategory: 'Locket',
    rating: 4.7,
    reviewCount: 112,
    inStock: true,
    isFeatured: false,
    isNew: true,
  },
  {
    name: 'Floral Oval Locket',
    slug: 'floral-oval-locket',
    description:
      'An elegant oval locket with engraved floral patterns on a gold-plated surface. Suspended from a matching chain, it opens to hold a cherished photo.',
    price: 999,
    originalPrice: 1499,
    image: '/images/products/locket-2.png',
    category: 'Pendants & Lockets',
    subcategory: 'Locket',
    rating: 4.5,
    reviewCount: 64,
    inStock: true,
    isFeatured: false,
    isNew: false,
  },
  {
    name: 'Traditional Anklet Pair',
    slug: 'traditional-anklet-pair',
    description:
      'A pair of traditional anklets with tiny bell-like drops and gold-plated links. The gentle tinkling sound adds charm to every step.',
    price: 699,
    originalPrice: 999,
    image: '/images/products/anklet-1.png',
    category: 'Anklets',
    subcategory: 'Traditional',
    rating: 4.4,
    reviewCount: 87,
    inStock: true,
    isFeatured: false,
    isNew: false,
  },
  {
    name: 'Pearl Nath Nose Ring',
    slug: 'pearl-nath-nose-ring',
    description:
      'A classic Nath-style nose ring featuring a lustrous faux pearl and delicate gold-plated detailing. A must-have accessory for bridal and festive looks.',
    price: 399,
    originalPrice: 599,
    image: '/images/products/nose-ring-1.png',
    category: 'Nose Rings',
    subcategory: 'Nath',
    rating: 4.2,
    reviewCount: 53,
    inStock: true,
    isFeatured: false,
    isNew: false,
  },
  {
    name: 'South Indian Armlet',
    slug: 'south-indian-armlet',
    description:
      'A traditional Vanki-style armlet with intricate gold-plated motifs and stone embellishments. Inspired by South Indian temple jewellery designs.',
    price: 899,
    originalPrice: 1399,
    image: '/images/products/armlet-1.png',
    category: 'Armlets',
    subcategory: 'Vanki',
    rating: 4.5,
    reviewCount: 41,
    inStock: true,
    isFeatured: false,
    isNew: true,
  },
  {
    name: 'Meenakari Hand Harness',
    slug: 'meenakari-hand-harness',
    description:
      'A breathtaking Haath Phool hand harness with vibrant Meenakari enamel work and stone settings. This piece extends from the wrist to the finger for a dramatic, ornate look.',
    price: 1599,
    originalPrice: 2399,
    image: '/images/products/hand-harness-1.png',
    category: 'Hand Harness',
    subcategory: 'Haath Phool',
    rating: 4.8,
    reviewCount: 73,
    inStock: true,
    isFeatured: true,
    isNew: true,
  },
]

export async function GET() {
  try {
    const existingCount = await db.product.count()

    if (existingCount > 0) {
      await db.product.deleteMany()
    }

    const createdProducts = []
    for (const productData of seedProducts) {
      const product = await db.product.create({
        data: productData,
      })
      createdProducts.push(product)
    }

    return NextResponse.json(
      {
        message: `Successfully seeded ${createdProducts.length} products`,
        count: createdProducts.length,
        products: createdProducts,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}
