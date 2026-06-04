import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    const existingSubscription = await db.newsletter.findUnique({
      where: { email },
    })

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'This email is already subscribed to our newsletter', subscribed: true },
        { status: 409 }
      )
    }

    const subscription = await db.newsletter.create({
      data: { email },
    })

    return NextResponse.json(
      {
        subscription,
        message: 'Successfully subscribed to the newsletter!',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}
