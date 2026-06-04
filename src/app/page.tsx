'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Crown, Search, Heart, ShoppingCart, Menu, X, Star, Plus, Minus,
  ChevronRight, Truck, Shield, Gem, Sparkles, Mail, Phone, MapPin,
  Instagram, Facebook, MessageCircle, ArrowRight, Grid3X3, List,
  ChevronDown, Gift, Check, Trash2, MoveRight, Send, IndianRupee,
  ThumbsUp, User, Calendar, Quote
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMazziniStore } from '@/store/mazzini-store'
import { toast } from 'sonner'

/* ─── Product Data ─── */
const allProducts = [
  { id: 1, name: 'Royal Kundan Necklace Set', price: 2499, originalPrice: 4999, image: '/products/necklace-1.png', category: 'Necklaces', subcategory: 'Kundan', rating: 4.8, reviewCount: 124, isNew: true, isFeatured: true },
  { id: 2, name: 'Pearl Elegance Necklace', price: 1899, originalPrice: 3599, image: '/products/necklace-2.png', category: 'Necklaces', subcategory: 'Pearl', rating: 4.6, reviewCount: 89, isNew: false, isFeatured: true },
  { id: 3, name: 'Ruby Jhumka Earrings', price: 899, originalPrice: 1799, image: '/products/earring-1.png', category: 'Earrings', subcategory: 'Jhumka', rating: 4.9, reviewCount: 256, isNew: true, isFeatured: true },
  { id: 4, name: 'Emerald Chandelier Earrings', price: 1299, originalPrice: 2499, image: '/products/earring-2.png', category: 'Earrings', subcategory: 'Chandelier', rating: 4.7, reviewCount: 178, isNew: false, isFeatured: true },
  { id: 5, name: 'Polki Diamond Choker', price: 3299, originalPrice: 6499, image: '/products/choker-1.png', category: 'Necklaces', subcategory: 'Choker', rating: 4.9, reviewCount: 95, isNew: true, isFeatured: true },
  { id: 6, name: 'Royal Ruby Cocktail Ring', price: 799, originalPrice: 1599, image: '/products/ring-1.png', category: 'Rings', subcategory: 'Cocktail', rating: 4.5, reviewCount: 67, isNew: false, isFeatured: true },
  { id: 7, name: 'Gold-Plated Bangle Set', price: 1499, originalPrice: 2999, image: '/products/bangle-1.png', category: 'Bangles', subcategory: 'Set', rating: 4.7, reviewCount: 143, isNew: false, isFeatured: true },
  { id: 8, name: 'Kundan Maang Tikka', price: 599, originalPrice: 1199, image: '/products/maang-tikka-1.png', category: 'Maang Tikka', subcategory: 'Kundan', rating: 4.8, reviewCount: 112, isNew: true, isFeatured: true },
  { id: 9, name: 'Heart Locket Necklace', price: 1199, originalPrice: 2399, image: '/products/locket-1.png', category: 'Pendants & Lockets', subcategory: 'Locket', rating: 4.6, reviewCount: 78, isNew: false, isFeatured: false },
  { id: 10, name: 'Floral Oval Locket', price: 999, originalPrice: 1999, image: '/products/locket-2.png', category: 'Pendants & Lockets', subcategory: 'Locket', rating: 4.4, reviewCount: 56, isNew: false, isFeatured: false },
  { id: 11, name: 'Traditional Anklet Pair', price: 699, originalPrice: 1399, image: '/products/anklet-1.png', category: 'Anklets', subcategory: 'Traditional', rating: 4.5, reviewCount: 89, isNew: false, isFeatured: false },
  { id: 12, name: 'Pearl Nath Nose Ring', price: 399, originalPrice: 799, image: '/products/nose-ring-1.png', category: 'Nose Rings', subcategory: 'Nath', rating: 4.3, reviewCount: 45, isNew: false, isFeatured: false },
  { id: 13, name: 'South Indian Armlet', price: 899, originalPrice: 1799, image: '/products/armlet-1.png', category: 'Armlets', subcategory: 'Vanki', rating: 4.7, reviewCount: 67, isNew: false, isFeatured: false },
  { id: 14, name: 'Meenakari Hand Harness', price: 1599, originalPrice: 3199, image: '/products/hand-harness-1.png', category: 'Hand Harness', subcategory: 'Haath Phool', rating: 4.8, reviewCount: 34, isNew: true, isFeatured: false },
]

const categories = [
  { name: 'Necklaces', image: '/products/cat-necklaces.png', filter: 'Necklaces' },
  { name: 'Earrings', image: '/products/cat-earrings.png', filter: 'Earrings' },
  { name: 'Bangles & Rings', image: '/products/cat-bangles-rings.png', filter: 'Bangles' },
  { name: 'Pendants & Lockets', image: '/products/cat-pendants-lockets.png', filter: 'Pendants & Lockets' },
]

const heroSlides = [
  {
    badge: 'NEW COLLECTION 2026',
    title: 'Adorn Yourself With\nTimeless Elegance',
    subtitle: 'Discover handcrafted gold-plated jewellery that celebrates the artistry of Indian craftsmanship',
    cta1: 'Shop Now',
    cta2: 'View Collections',
  },
  {
    badge: 'WEDDING SEASON',
    title: 'Bridal Jewellery\nCollections',
    subtitle: 'Make your special day unforgettable with our exquisite Kundan and Polki bridal sets',
    cta1: 'Explore Bridal',
    cta2: 'Book Appointment',
  },
  {
    badge: 'LIMITED EDITION',
    title: 'Festive Glam\nAwait You',
    subtitle: 'Exclusive festive pieces crafted with love — perfect for Diwali, Navratri & beyond',
    cta1: 'Shop Festive',
    cta2: 'View New Arrivals',
  },
]

const mockReviews = [
  { id: 1, name: 'Priya Sharma', rating: 5, date: '15 Jan 2026', comment: 'Absolutely stunning piece! The Kundan work is so intricate and looks even better in person. Got so many compliments at the wedding.' },
  { id: 2, name: 'Anita Verma', rating: 4, date: '10 Jan 2026', comment: 'Beautiful jewellery, great quality for the price. The gold plating looks authentic. Delivery was quick too.' },
  { id: 3, name: 'Meera Patel', rating: 5, date: '5 Jan 2026', comment: 'I ordered this for my sister\'s wedding and she absolutely loved it! The packaging was also very premium.' },
  { id: 4, name: 'Kavita Reddy', rating: 4, date: '28 Dec 2025', comment: 'Excellent craftsmanship. The only reason for 4 stars is the clasp could be a bit sturdier, but otherwise perfect.' },
]

const filterCategories = ['All', 'Necklaces', 'Earrings', 'Bangles', 'Rings', 'Pendants & Lockets', 'Anklets', 'Maang Tikka', 'Nose Rings', 'Armlets', 'Hand Harness']

/* ─── Helper: Discount % ─── */
function getDiscount(original: number, current: number) {
  return Math.round(((original - current) / original) * 100)
}

/* ─── Helper: Star Rating ─── */
function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-600'}
        />
      ))}
    </div>
  )
}

/* ─── Section: Navbar ─── */
function Navbar({
  onSearchOpen,
  onCartOpen,
  onWishlistOpen,
}: {
  onSearchOpen: () => void
  onCartOpen: () => void
  onWishlistOpen: () => void
}) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const cartCount = useMazziniStore((s) => s.getCartCount())
  const wishlistCount = useMazziniStore((s) => s.wishlistItems.length)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = ['Home', 'Collections', 'Categories', 'About', 'Contact']

  const scrollToSection = (section: string) => {
    setMobileMenuOpen(false)
    const map: Record<string, string> = {
      Home: 'hero',
      Collections: 'featured',
      Categories: 'categories',
      About: 'about',
      Contact: 'contact',
    }
    const el = document.getElementById(map[section] || section.toLowerCase())
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#1c1917]/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-amber-900/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => scrollToSection('Home')}
          >
            <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent tracking-wider">
              MAZZINI
            </span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => scrollToSection(link)}
                className="text-stone-300 hover:text-amber-400 transition-colors text-sm font-medium tracking-wide relative group"
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSearchOpen}
              className="p-2 text-stone-300 hover:text-amber-400 transition-colors"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onWishlistOpen}
              className="p-2 text-stone-300 hover:text-amber-400 transition-colors relative"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 w-5 h-5 p-0 flex items-center justify-center bg-amber-600 text-white text-[10px] border-0">
                  {wishlistCount}
                </Badge>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCartOpen}
              className="p-2 text-stone-300 hover:text-amber-400 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 w-5 h-5 p-0 flex items-center justify-center bg-amber-600 text-white text-[10px] border-0">
                  {cartCount}
                </Badge>
              )}
            </motion.button>

            {/* Mobile Hamburger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden p-2 text-stone-300 hover:text-amber-400 transition-colors">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-[#1c1917] border-amber-900/20 w-72">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-amber-400">
                    <Crown className="w-5 h-5" />
                    MAZZINI
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <button
                      key={link}
                      onClick={() => scrollToSection(link)}
                      className="flex items-center gap-3 px-4 py-3 text-stone-300 hover:text-amber-400 hover:bg-amber-900/10 rounded-lg transition-all text-left"
                    >
                      <ChevronRight className="w-4 h-4 text-amber-600" />
                      {link}
                    </button>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-stone-700">
                  <div className="flex items-center gap-3 px-4 text-stone-400 text-sm">
                    <Phone className="w-4 h-4 text-amber-500" />
                    7678279825
                  </div>
                  <div className="flex items-center gap-3 px-4 mt-3 text-stone-400 text-sm">
                    <Mail className="w-4 h-4 text-amber-500" />
                    guggisha123@gmail.com
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

/* ─── Section: Hero Carousel ─── */
function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="hero" className="relative w-full h-[85vh] sm:h-[90vh] overflow-hidden">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src="/products/hero-banner.png"
            alt="Mazzini Fine Jewellery Collection"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c1917]/90 via-[#1c1917]/60 to-[#1c1917]/30" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl"
            >
              <Badge className="bg-amber-600/90 text-white border-0 mb-4 sm:mb-6 text-xs sm:text-sm px-4 py-1.5">
                <Sparkles className="w-3 h-3 mr-1.5" />
                {heroSlides[currentSlide].badge}
              </Badge>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight whitespace-pre-line mb-4 sm:mb-6">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-stone-300 text-sm sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                {heroSlides[currentSlide].subtitle}
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Button
                  size="lg"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 sm:px-8 shadow-lg shadow-amber-900/30"
                  onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {heroSlides[currentSlide].cta1}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-amber-500/50 text-amber-400 hover:bg-amber-900/20 hover:text-amber-300 font-semibold px-6 sm:px-8"
                  onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {heroSlides[currentSlide].cta2}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dot Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`transition-all duration-300 rounded-full ${
              i === currentSlide
                ? 'w-8 h-3 bg-amber-500'
                : 'w-3 h-3 bg-stone-500 hover:bg-stone-400'
            }`}
          />
        ))}
      </div>

      {/* Side Decorative */}
      <div className="absolute right-8 bottom-24 hidden lg:flex flex-col items-center gap-3 z-20">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-amber-500 to-transparent" />
        <span className="text-amber-400 text-xs tracking-widest rotate-90 origin-center translate-y-8">MAZZINI 2026</span>
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-amber-500 to-transparent" />
      </div>
    </section>
  )
}

/* ─── Section: Category Grid ─── */
function CategoryGrid({ onCategorySelect }: { onCategorySelect: (cat: string) => void }) {
  return (
    <section id="categories" className="py-16 sm:py-24 bg-[#1c1917]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <Badge className="bg-amber-900/30 text-amber-400 border-amber-700/30 mb-3">SHOP BY CATEGORY</Badge>
          <h2 className="text-2xl sm:text-4xl font-bold text-white">Explore Our Collections</h2>
          <p className="text-stone-400 mt-3 max-w-md mx-auto text-sm sm:text-base">Find the perfect piece for every occasion from our curated categories</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              onClick={() => onCategorySelect(cat.filter)}
              className="group cursor-pointer relative overflow-hidden rounded-xl sm:rounded-2xl aspect-[3/4] sm:aspect-[4/5]"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-amber-600/0 group-hover:bg-amber-600/20 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <h3 className="text-white font-bold text-base sm:text-xl mb-1">{cat.name}</h3>
                <div className="flex items-center gap-1 text-amber-400 text-xs sm:text-sm group-hover:gap-2 transition-all">
                  Shop Now <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Product Card ─── */
function ProductCard({
  product,
  onViewDetail,
}: {
  product: typeof allProducts[0]
  onViewDetail: (product: typeof allProducts[0]) => void
}) {
  const { addToCart, addToWishlist, removeFromWishlist, wishlistItems } = useMazziniStore()
  const isWishlisted = wishlistItems.some((w) => w.id === product.id)

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast.success('Removed from wishlist')
    } else {
      addToWishlist({ id: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.image, category: product.category })
      toast.success('Added to wishlist')
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart({ id: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.image, category: product.category })
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="group cursor-pointer"
      onClick={() => onViewDetail(product)}
    >
      <Card className="bg-[#292524] border-stone-700/50 overflow-hidden hover:border-amber-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/10">
        <div className="relative aspect-square overflow-hidden bg-[#1c1917]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {product.isNew && (
              <Badge className="bg-amber-600 text-white border-0 text-[10px] px-2 py-0.5">NEW</Badge>
            )}
            {getDiscount(product.originalPrice, product.price) > 0 && (
              <Badge className="bg-red-600 text-white border-0 text-[10px] px-2 py-0.5">
                -{getDiscount(product.originalPrice, product.price)}%
              </Badge>
            )}
          </div>
          {/* Wishlist */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-black/60"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </motion.button>
          {/* Quick Add */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-none h-9 text-xs font-semibold"
            >
              <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
              Add to Cart
            </Button>
          </div>
        </div>
        <CardContent className="p-3 sm:p-4">
          <p className="text-stone-500 text-[10px] sm:text-xs uppercase tracking-wider mb-1">{product.category}</p>
          <h3 className="text-stone-100 font-medium text-xs sm:text-sm line-clamp-2 mb-2 leading-snug">{product.name}</h3>
          <div className="flex items-center gap-1 mb-2">
            <StarRating rating={product.rating} size={11} />
            <span className="text-stone-500 text-[10px]">({product.reviewCount})</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-amber-400 font-bold text-sm sm:text-base flex items-center">
              <IndianRupee className="w-3 h-3" />{product.price.toLocaleString()}
            </span>
            <span className="text-stone-500 line-through text-xs flex items-center">
              <IndianRupee className="w-2.5 h-2.5" />{product.originalPrice.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/* ─── Section: Featured Products ─── */
function FeaturedProducts({ onViewDetail }: { onViewDetail: (p: typeof allProducts[0]) => void }) {
  const featured = allProducts.filter((p) => p.isFeatured)

  return (
    <section id="featured" className="py-16 sm:py-24 bg-[#292524]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <Badge className="bg-amber-900/30 text-amber-400 border-amber-700/30 mb-3">CURATED FOR YOU</Badge>
          <h2 className="text-2xl sm:text-4xl font-bold text-white">Featured Collection</h2>
          <p className="text-stone-400 mt-3 max-w-md mx-auto text-sm sm:text-base">Our most loved pieces, handpicked for their exceptional beauty and craftsmanship</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} onViewDetail={onViewDetail} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Section: All Products ─── */
function AllProducts({ onViewDetail, initialCategory }: { onViewDetail: (p: typeof allProducts[0]) => void; initialCategory: string }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'All')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [visibleCount, setVisibleCount] = useState(8)
  const [prevInitialCategory, setPrevInitialCategory] = useState(initialCategory)

  if (initialCategory !== prevInitialCategory) {
    setPrevInitialCategory(initialCategory)
    if (initialCategory && initialCategory !== 'All') {
      setActiveCategory(initialCategory)
    }
  }

  const filtered = useMemo(() => {
    let result = activeCategory === 'All' ? allProducts : allProducts.filter((p) => p.category === activeCategory)
    switch (sortBy) {
      case 'price-low':
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        result = [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      default:
        result = [...result].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }
    return result
  }, [activeCategory, sortBy])

  const visible = filtered.slice(0, visibleCount)

  return (
    <section id="all-products" className="py-16 sm:py-24 bg-[#1c1917]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <Badge className="bg-amber-900/30 text-amber-400 border-amber-700/30 mb-3">OUR COLLECTION</Badge>
          <h2 className="text-2xl sm:text-4xl font-bold text-white">All Products</h2>
        </motion.div>

        {/* Filters & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <ScrollArea className="w-full sm:w-auto">
            <div className="flex gap-2 pb-2">
              {filterCategories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => { setActiveCategory(cat); setVisibleCount(8) }}
                  className={
                    activeCategory === cat
                      ? 'bg-amber-600 hover:bg-amber-700 text-white border-0 whitespace-nowrap text-xs'
                      : 'border-stone-600 text-stone-300 hover:text-amber-400 hover:border-amber-600 whitespace-nowrap text-xs bg-transparent'
                  }
                >
                  {cat}
                </Button>
              ))}
            </div>
          </ScrollArea>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] bg-[#292524] border-stone-600 text-stone-300 text-xs h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#292524] border-stone-600">
                <SelectItem value="featured" className="text-stone-300 text-xs">Featured</SelectItem>
                <SelectItem value="price-low" className="text-stone-300 text-xs">Price: Low-High</SelectItem>
                <SelectItem value="price-high" className="text-stone-300 text-xs">Price: High-Low</SelectItem>
                <SelectItem value="rating" className="text-stone-300 text-xs">Top Rated</SelectItem>
                <SelectItem value="newest" className="text-stone-300 text-xs">Newest</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border border-stone-600 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-amber-400'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-amber-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-stone-500 text-sm mb-4">{filtered.length} products found</p>

        {/* Products Grid / List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            <AnimatePresence mode="popLayout">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} onViewDetail={onViewDetail} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {visible.map((product) => (
                <ListProductCard key={product.id} product={product} onViewDetail={onViewDetail} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Load More */}
        {visibleCount < filtered.length && (
          <div className="text-center mt-10">
            <Button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              variant="outline"
              className="border-amber-600 text-amber-400 hover:bg-amber-900/20 hover:text-amber-300 px-8"
            >
              Load More
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

/* ─── List View Product Card ─── */
function ListProductCard({
  product,
  onViewDetail,
}: {
  product: typeof allProducts[0]
  onViewDetail: (p: typeof allProducts[0]) => void
}) {
  const { addToCart, addToWishlist, removeFromWishlist, wishlistItems } = useMazziniStore()
  const isWishlisted = wishlistItems.some((w) => w.id === product.id)

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast.success('Removed from wishlist')
    } else {
      addToWishlist({ id: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.image, category: product.category })
      toast.success('Added to wishlist')
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart({ id: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.image, category: product.category })
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onClick={() => onViewDetail(product)}
      className="flex gap-4 sm:gap-6 bg-[#292524] border border-stone-700/50 rounded-xl p-3 sm:p-4 cursor-pointer hover:border-amber-700/50 transition-all group"
    >
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-[#1c1917]">
        <Image src={product.image} alt={product.name} fill className="object-cover" />
        {product.isNew && (
          <Badge className="absolute top-1 left-1 bg-amber-600 text-white border-0 text-[9px] px-1.5 py-0">NEW</Badge>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-stone-500 text-[10px] uppercase tracking-wider mb-0.5">{product.category}</p>
        <h3 className="text-stone-100 font-medium text-sm sm:text-base mb-1 truncate">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <StarRating rating={product.rating} size={12} />
          <span className="text-stone-500 text-xs">({product.reviewCount})</span>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-amber-400 font-bold text-base flex items-center"><IndianRupee className="w-3 h-3" />{product.price.toLocaleString()}</span>
          <span className="text-stone-500 line-through text-xs flex items-center"><IndianRupee className="w-2.5 h-2.5" />{product.originalPrice.toLocaleString()}</span>
          <Badge className="bg-red-600/20 text-red-400 border-0 text-[10px] px-1.5 py-0">-{getDiscount(product.originalPrice, product.price)}%</Badge>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleAddToCart} className="bg-amber-600 hover:bg-amber-700 text-white h-8 text-xs">
            <ShoppingCart className="w-3 h-3 mr-1" /> Add to Cart
          </Button>
          <Button size="sm" variant="outline" onClick={handleWishlist} className="border-stone-600 h-8 w-8 p-0">
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-stone-400'}`} />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Product Detail Modal ─── */
function ProductDetailModal({
  product,
  open,
  onClose,
}: {
  product: typeof allProducts[0] | null
  open: boolean
  onClose: () => void
}) {
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const { addToCart, addToWishlist, removeFromWishlist, wishlistItems } = useMazziniStore()

  if (!product) return null

  const isWishlisted = wishlistItems.some((w) => w.id === product.id)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({ id: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.image, category: product.category })
    }
    toast.success(`${quantity}x ${product.name} added to cart!`)
  }

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast.success('Removed from wishlist')
    } else {
      addToWishlist({ id: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.image, category: product.category })
      toast.success('Added to wishlist')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1c1917] border-stone-700/50 max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative w-full md:w-1/2 aspect-square bg-[#292524]">
            <Image src={product.image} alt={product.name} fill className="object-cover" />
            {product.isNew && (
              <Badge className="absolute top-4 left-4 bg-amber-600 text-white border-0">NEW</Badge>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 p-6 sm:p-8">
            <p className="text-amber-500 text-xs uppercase tracking-wider mb-2">{product.category} • {product.subcategory}</p>
            <h2 className="text-white text-xl sm:text-2xl font-bold mb-3">{product.name}</h2>

            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={product.rating} size={16} />
              <span className="text-stone-400 text-sm">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-amber-400 text-2xl font-bold flex items-center"><IndianRupee className="w-4 h-4" />{product.price.toLocaleString()}</span>
              <span className="text-stone-500 line-through text-lg flex items-center"><IndianRupee className="w-3.5 h-3.5" />{product.originalPrice.toLocaleString()}</span>
              <Badge className="bg-red-600/20 text-red-400 border-0 text-xs">{getDiscount(product.originalPrice, product.price)}% OFF</Badge>
            </div>

            <p className="text-green-400 text-sm mb-4 flex items-center gap-1.5">
              <Truck className="w-4 h-4" /> Free Delivery on orders above ₹999
            </p>

            <Separator className="bg-stone-700 mb-6" />

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-stone-400 text-sm">Quantity:</span>
              <div className="flex items-center border border-stone-600 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-stone-300 hover:text-amber-400 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-white font-medium min-w-[40px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-stone-300 hover:text-amber-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold h-12"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={handleWishlist}
                variant="outline"
                className="border-stone-600 h-12 w-12 p-0 hover:border-amber-600"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-stone-300'}`} />
              </Button>
            </div>

            <Separator className="bg-stone-700 mb-6" />

            {/* Tabs */}
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setActiveTab('description')}
                className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                  activeTab === 'description' ? 'text-amber-400 border-amber-400' : 'text-stone-400 border-transparent hover:text-stone-200'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                  activeTab === 'reviews' ? 'text-amber-400 border-amber-400' : 'text-stone-400 border-transparent hover:text-stone-200'
                }`}
              >
                Reviews ({product.reviewCount})
              </button>
            </div>

            {activeTab === 'description' ? (
              <div className="text-stone-300 text-sm leading-relaxed space-y-3">
                <p>Exquisite {product.subcategory} {product.category.toLowerCase()} from the Mazzini Fine Jewellery collection. Each piece is meticulously handcrafted by skilled artisans using traditional Indian techniques passed down through generations.</p>
                <p>Made with premium gold plating over a durable alloy base, this jewellery features authentic {product.subcategory.toLowerCase()} work with carefully selected stones that catch the light beautifully.</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge className="bg-amber-900/30 text-amber-400 border-amber-700/30 text-[10px]">Gold-Plated</Badge>
                  <Badge className="bg-amber-900/30 text-amber-400 border-amber-700/30 text-[10px]">Handcrafted</Badge>
                  <Badge className="bg-amber-900/30 text-amber-400 border-amber-700/30 text-[10px]">Hypoallergenic</Badge>
                  <Badge className="bg-amber-900/30 text-amber-400 border-amber-700/30 text-[10px]">Nickel-Free</Badge>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {mockReviews.map((review) => (
                  <div key={review.id} className="bg-[#292524] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-amber-600/20 flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                        <span className="text-white text-sm font-medium">{review.name}</span>
                      </div>
                      <span className="text-stone-500 text-xs">{review.date}</span>
                    </div>
                    <StarRating rating={review.rating} size={12} />
                    <p className="text-stone-300 text-sm mt-2 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ─── Cart Sidebar ─── */
function CartSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useMazziniStore()
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  const subtotal = getCartTotal()
  const shipping = subtotal >= 999 ? 0 : 99
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0
  const total = subtotal + shipping - discount

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === 'MAZZINI10') {
      setCouponApplied(true)
      toast.success('Coupon MAZZINI10 applied! 10% off')
    } else {
      toast.error('Invalid coupon code')
    }
  }

  const handleCheckout = () => {
    setShowCheckout(true)
  }

  return (
    <>
      <Sheet open={open && !showCheckout} onOpenChange={onClose}>
        <SheetContent side="right" className="bg-[#1c1917] border-stone-700/50 w-full sm:w-[420px] p-0 flex flex-col">
          <SheetHeader className="p-6 pb-0">
            <SheetTitle className="text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-amber-500" />
              Shopping Cart ({cartItems.length})
            </SheetTitle>
          </SheetHeader>

          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
              <div className="w-20 h-20 rounded-full bg-stone-800 flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-stone-600" />
              </div>
              <p className="text-stone-400 text-lg">Your cart is empty</p>
              <Button onClick={onClose} className="bg-amber-600 hover:bg-amber-700 text-white">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 px-6 py-4">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 bg-[#292524] rounded-lg p-3">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-[#1c1917]">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-sm font-medium truncate">{item.name}</h4>
                        <p className="text-amber-400 text-sm font-semibold flex items-center mt-0.5">
                          <IndianRupee className="w-3 h-3" />{item.price.toLocaleString()}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-stone-600 rounded">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-0.5 text-stone-300 hover:text-amber-400">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 py-0.5 text-white text-xs">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-0.5 text-stone-300 hover:text-amber-400">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-stone-500 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-6 border-t border-stone-700/50 bg-[#1c1917]">
                {/* Coupon */}
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="bg-[#292524] border-stone-600 text-stone-200 placeholder-stone-500 h-9 text-xs"
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    variant="outline"
                    size="sm"
                    className="border-amber-600 text-amber-400 hover:bg-amber-900/20 text-xs whitespace-nowrap"
                    disabled={couponApplied}
                  >
                    {couponApplied ? 'Applied' : 'Apply'}
                  </Button>
                </div>

                <Separator className="bg-stone-700 mb-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-stone-400">
                    <span>Subtotal</span>
                    <span className="flex items-center"><IndianRupee className="w-3 h-3" />{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-400' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount (10%)</span>
                      <span className="flex items-center">-<IndianRupee className="w-3 h-3" />{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <Separator className="bg-stone-700" />
                  <div className="flex justify-between text-white font-bold text-lg pt-1">
                    <span>Total</span>
                    <span className="flex items-center"><IndianRupee className="w-4 h-4" />{total.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold h-12 mt-4"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <button
                  onClick={clearCart}
                  className="w-full text-center text-stone-500 hover:text-red-400 text-xs mt-3 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Checkout Modal */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="bg-[#1c1917] border-stone-700/50 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-500" />
              Checkout
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const name = formData.get('name') as string
              const email = formData.get('email') as string
              if (!name || !email) {
                toast.error('Please fill all required fields')
                return
              }
              clearCart()
              setShowCheckout(false)
              onClose()
              toast.success('Order placed successfully! 🎉', {
                description: `Thank you, ${name}! Your order will be delivered within 5-7 business days.`,
              })
            }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-amber-400 text-sm font-semibold mb-3">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input name="name" placeholder="Full Name *" className="bg-[#292524] border-stone-600 text-white placeholder-stone-500" />
                <Input name="email" type="email" placeholder="Email *" className="bg-[#292524] border-stone-600 text-white placeholder-stone-500" />
                <Input name="phone" placeholder="Phone *" className="bg-[#292524] border-stone-600 text-white placeholder-stone-500" />
              </div>
            </div>

            <div>
              <h3 className="text-amber-400 text-sm font-semibold mb-3">Shipping Address</h3>
              <div className="grid grid-cols-1 gap-3">
                <Input name="address" placeholder="Address *" className="bg-[#292524] border-stone-600 text-white placeholder-stone-500" />
                <div className="grid grid-cols-2 gap-3">
                  <Input name="city" placeholder="City *" className="bg-[#292524] border-stone-600 text-white placeholder-stone-500" />
                  <Input name="state" placeholder="State *" className="bg-[#292524] border-stone-600 text-white placeholder-stone-500" />
                </div>
                <Input name="pincode" placeholder="Pincode *" className="bg-[#292524] border-stone-600 text-white placeholder-stone-500" />
              </div>
            </div>

            <Separator className="bg-stone-700" />

            <div className="bg-[#292524] rounded-lg p-4">
              <h3 className="text-amber-400 text-sm font-semibold mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-stone-400">
                  <span>Items ({cartItems.reduce((a, b) => a + b.quantity, 0)})</span>
                  <span className="flex items-center"><IndianRupee className="w-3 h-3" />{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Shipping</span>
                  <span className="text-green-400">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span className="flex items-center">-<IndianRupee className="w-3 h-3" />{discount.toLocaleString()}</span>
                  </div>
                )}
                <Separator className="bg-stone-600" />
                <div className="flex justify-between text-white font-bold">
                  <span>Total</span>
                  <span className="flex items-center"><IndianRupee className="w-3.5 h-3.5" />{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold h-12">
              <Check className="w-4 h-4 mr-2" />
              Place Order
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ─── Wishlist Sidebar ─── */
function WishlistSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { wishlistItems, removeFromWishlist, addToCart } = useMazziniStore()

  const handleMoveToCart = (item: typeof wishlistItems[0]) => {
    addToCart({ id: item.id, name: item.name, price: item.price, originalPrice: item.originalPrice, image: item.image, category: item.category })
    removeFromWishlist(item.id)
    toast.success(`${item.name} moved to cart`)
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="bg-[#1c1917] border-stone-700/50 w-full sm:w-[380px] p-0 flex flex-col">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle className="text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-amber-500" />
            Wishlist ({wishlistItems.length})
          </SheetTitle>
        </SheetHeader>

        {wishlistItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <div className="w-20 h-20 rounded-full bg-stone-800 flex items-center justify-center">
              <Heart className="w-10 h-10 text-stone-600" />
            </div>
            <p className="text-stone-400 text-lg">Your wishlist is empty</p>
            <Button onClick={onClose} className="bg-amber-600 hover:bg-amber-700 text-white">
              Explore Products
            </Button>
          </div>
        ) : (
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <div key={item.id} className="flex gap-3 bg-[#292524] rounded-lg p-3">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-[#1c1917]">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">{item.name}</h4>
                    <p className="text-amber-400 text-sm font-semibold flex items-center mt-0.5">
                      <IndianRupee className="w-3 h-3" />{item.price.toLocaleString()}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        onClick={() => handleMoveToCart(item)}
                        className="bg-amber-600 hover:bg-amber-700 text-white h-7 text-[10px]"
                      >
                        <MoveRight className="w-3 h-3 mr-1" /> Move to Cart
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { removeFromWishlist(item.id); toast.success('Removed from wishlist') }}
                        className="text-stone-500 hover:text-red-400 h-7 w-7 p-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  )
}

/* ─── Search Modal ─── */
function SearchModal({ open, onClose, onViewDetail }: { open: boolean; onClose: () => void; onViewDetail: (p: typeof allProducts[0]) => void }) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1c1917] border-stone-700/50 max-w-xl p-0">
        <DialogTitle className="sr-only">Search Products</DialogTitle>
        <div className="p-6">
          <div className="flex items-center gap-3 bg-[#292524] rounded-lg px-4 py-3 border border-stone-600 focus-within:border-amber-600 transition-colors">
            <Search className="w-5 h-5 text-amber-500" />
            <input
              type="text"
              placeholder="Search for necklaces, earrings, rings..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent text-white placeholder-stone-500 flex-1 outline-none text-sm"
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-stone-500 hover:text-stone-300">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {query && (
          <ScrollArea className="max-h-80 px-6 pb-6">
            {results.length === 0 ? (
              <div className="text-center py-8">
                <Search className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                <p className="text-stone-400">No products found for &quot;{query}&quot;</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-stone-500 text-xs mb-3">{results.length} results</p>
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => { onViewDetail(product); onClose() }}
                    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#292524] transition-colors text-left"
                  >
                    <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-[#292524]">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm truncate">{product.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 text-sm font-semibold flex items-center"><IndianRupee className="w-3 h-3" />{product.price.toLocaleString()}</span>
                        <span className="text-stone-500 text-xs">{product.category}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-600" />
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}

/* ─── Section: About ─── */
function AboutSection() {
  const features = [
    { icon: Gem, title: 'Gold-Plated', desc: 'Premium 1-micron gold plating for lasting shine' },
    { icon: Sparkles, title: 'Handcrafted', desc: 'Each piece made by skilled Indian artisans' },
    { icon: Shield, title: 'Hypoallergenic', desc: 'Nickel-free & safe for sensitive skin' },
    { icon: Truck, title: 'Free Shipping', desc: 'Complimentary delivery on orders above ₹999' },
  ]

  return (
    <section id="about" className="py-16 sm:py-24 bg-[#292524]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 sm:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-amber-900/30 text-amber-400 border-amber-700/30 mb-4">OUR STORY</Badge>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
              Crafted With Love,<br />
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">Worn With Pride</span>
            </h2>
            <p className="text-stone-400 leading-relaxed mb-4 text-sm sm:text-base">
              At Mazzini Fine Jewellery, we celebrate the timeless artistry of Indian jewellery-making. Founded in the heart of Gurugram, Haryana, our brand is born from a passion for blending traditional craftsmanship with contemporary design.
            </p>
            <p className="text-stone-400 leading-relaxed mb-4 text-sm sm:text-base">
              Every piece in our collection tells a story — from the intricate Kundan settings of Rajasthan to the delicate Meenakari work of the Mughal era. We work directly with artisan families who have been perfecting their craft for generations, ensuring each creation is a masterpiece of quality and beauty.
            </p>
            <p className="text-stone-400 leading-relaxed text-sm sm:text-base">
              Our commitment goes beyond beauty. We use only hypoallergenic, nickel-free materials with premium gold plating, so you can wear our jewellery with confidence and comfort all day long.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4 sm:gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#1c1917] rounded-xl p-4 sm:p-6 text-center hover:bg-[#1c1917]/80 border border-stone-700/30 hover:border-amber-700/30 transition-all group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-900/20 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-amber-900/30 transition-colors">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                </div>
                <h3 className="text-white font-semibold text-sm sm:text-base mb-1">{feature.title}</h3>
                <p className="text-stone-500 text-xs sm:text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─── Section: Newsletter ─── */
function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }
    setSubscribed(true)
    setEmail('')
    toast.success('Welcome to the Mazzini family! ✨', {
      description: 'You\'ll receive exclusive offers and new collection updates.',
    })
  }

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900" />
      <div className="absolute inset-0 bg-[url('/products/hero-banner.png')] opacity-5 bg-cover bg-center" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Sparkles className="w-8 h-8 text-amber-200 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">Join the Mazzini Family</h2>
          <p className="text-amber-100/70 mb-8 text-sm sm:text-base">Subscribe to receive exclusive offers, early access to new collections, and styling tips</p>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <Check className="w-10 h-10 text-amber-200 mx-auto mb-3" />
              <p className="text-white text-lg font-semibold">You&apos;re subscribed!</p>
              <p className="text-amber-100/70 text-sm mt-1">Check your inbox for a special welcome offer</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/50 h-12 flex-1"
              />
              <Button type="submit" className="bg-white text-amber-900 hover:bg-amber-50 font-semibold h-12 px-6">
                <Send className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}

/* ─── Section: Footer ─── */
function Footer() {
  const quickLinks = [
    { label: 'Home', href: 'hero' },
    { label: 'Collections', href: 'featured' },
    { label: 'Categories', href: 'categories' },
    { label: 'About Us', href: 'about' },
    { label: 'Contact', href: 'contact' },
  ]

  const categoryLinks = ['Necklaces', 'Earrings', 'Bangles', 'Rings', 'Pendants & Lockets', 'Anklets', 'Maang Tikka']

  const serviceLinks = ['Shipping Policy', 'Return Policy', 'Privacy Policy', 'Terms & Conditions', 'FAQ', 'Track Order']

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer id="contact" className="bg-[#0f0e0d] border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-6 h-6 text-amber-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                MAZZINI
              </span>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed mb-4">
              Fine jewellery that celebrates the artistry of Indian craftsmanship. Handcrafted with love in Gurugram.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-amber-600 hover:text-white transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-amber-600 hover:text-white transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://wa.me/917678279825" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-green-600 hover:text-white transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button onClick={() => scrollTo(link.href)} className="text-stone-500 hover:text-amber-400 text-sm transition-colors">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {categoryLinks.map((cat) => (
                <li key={cat}>
                  <span className="text-stone-500 hover:text-amber-400 text-sm transition-colors cursor-pointer">{cat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service & Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-stone-500 text-sm">
                <Phone className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>7678279825</span>
              </div>
              <div className="flex items-start gap-2.5 text-stone-500 text-sm">
                <Mail className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>guggisha123@gmail.com</span>
              </div>
              <div className="flex items-start gap-2.5 text-stone-500 text-sm">
                <MapPin className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>Haryana Gurugram India</span>
              </div>
            </div>

            <h3 className="text-white font-semibold text-sm mt-6 mb-3">Payment Methods</h3>
            <div className="flex gap-2 flex-wrap">
              <div className="bg-stone-800 rounded px-2.5 py-1 text-stone-400 text-[10px] font-medium">UPI</div>
              <div className="bg-stone-800 rounded px-2.5 py-1 text-stone-400 text-[10px] font-medium">Cards</div>
              <div className="bg-stone-800 rounded px-2.5 py-1 text-stone-400 text-[10px] font-medium">Net Banking</div>
              <div className="bg-stone-800 rounded px-2.5 py-1 text-stone-400 text-[10px] font-medium">COD</div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-stone-600 text-xs sm:text-sm">&copy; 2026 Mazzini Fine Jewellery. All rights reserved.</p>
          <div className="flex gap-4 text-stone-600 text-xs">
            {serviceLinks.slice(0, 3).map((link) => (
              <span key={link} className="hover:text-amber-400 cursor-pointer transition-colors">{link}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─── WhatsApp Floating Button ─── */
function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/917678279825"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-lg shadow-green-900/30 transition-colors"
    >
      <MessageCircle className="w-7 h-7 text-white" />
      {/* Pulse */}
      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
    </motion.a>
  )
}

/* ─── Main Page ─── */
export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<typeof allProducts[0] | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('All')

  const handleViewDetail = useCallback((product: typeof allProducts[0]) => {
    setSelectedProduct(product)
    setDetailOpen(true)
  }, [])

  const handleCategorySelect = useCallback((category: string) => {
    setCategoryFilter(category)
    document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[#1c1917]">
      {/* Navbar */}
      <Navbar
        onSearchOpen={() => setSearchOpen(true)}
        onCartOpen={() => setCartOpen(true)}
        onWishlistOpen={() => setWishlistOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Category Grid */}
        <CategoryGrid onCategorySelect={handleCategorySelect} />

        {/* Featured Products */}
        <FeaturedProducts onViewDetail={handleViewDetail} />

        {/* All Products */}
        <AllProducts onViewDetail={handleViewDetail} initialCategory={categoryFilter} />

        {/* About Section */}
        <AboutSection />

        {/* Newsletter Section */}
        <NewsletterSection />
      </main>

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>

      {/* Modals & Sidebars */}
      <ProductDetailModal
        key={selectedProduct?.id ?? 'none'}
        product={selectedProduct}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistSidebar open={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} onViewDetail={handleViewDetail} />

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </div>
  )
}
