import React from 'react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Badge } from './ui/badge'
import { Award, BadgeDollarSign, CalendarIcon, MessageCircle, PhoneCall, Sparkles, Workflow } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'
import { Logo } from './Logo'
import Image from 'next/image'

interface HeroSectionProps {
  imageUrl: string
  badgeText?: string
  title: string
  subtitle?: string
  description: string
  isLogoNeeded?: boolean
  areLinksNeeded?: boolean
  links?: Array<{
    href: string
    label: string
  }>
}

function HeroSection({ imageUrl, badgeText, title, subtitle, description, isLogoNeeded, areLinksNeeded, links }: HeroSectionProps) {

  let custom_badge = null
  switch (badgeText) {
    case "nos services":
      custom_badge = (
        <Badge className="mb-6 bg-pink-500/20 text-pink-100 border-pink-300/30 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 mr-2" />
          {badgeText}
        </Badge>
      )
      break;
    case "nos abonnements":
      custom_badge = (
        <Badge className="mb-6 bg-pink-500/20 text-pink-100 border-pink-300/30 backdrop-blur-sm">
          <Award className="w-4 h-4 mr-2" />
          {badgeText}
        </Badge>
      )
      break;
    case "reservation":
      custom_badge = (
        <Badge className="mb-6 bg-pink-500/20 text-pink-100 border-pink-300/30 backdrop-blur-sm">
          <CalendarIcon className="w-4 h-4 mr-2" />
          {badgeText}
        </Badge>
      )
      break;

    case "nos contacts":
      custom_badge = (
        <Badge className="mb-6 bg-pink-500/20 text-pink-100 border-pink-300/30 backdrop-blur-sm">
          <MessageCircle className="w-4 h-4 mr-2" />
          {badgeText}
        </Badge>
      )
      break;

    case "notre histoire":
      custom_badge = (
        <Badge className="mb-6 bg-pink-500/20 text-pink-100 border-pink-300/30 backdrop-blur-sm">
          <Workflow className="w-4 h-4 mr-2" />
          {badgeText}
        </Badge>
      )
      break;

    default:
      break;
  }

  return (
    <section className="relative h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithFallback
          src={imageUrl}
          alt="Beauty Nails Salon"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-pink-900/80 via-purple-900/70 to-amber-900/60" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-2xl">
          {isLogoNeeded ? (
            <Image
              src={'/Bnails_ white.png'}
              alt="Beauty Nails Logo"
              width={420}
              height={90}
              className={`transition-all duration-300`}
              priority
            />
          ) : (
            custom_badge
          )}
          <h1 className="text-5xl lg:text-6xl text-white mb-6 leading-tight">
            {title}<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-200 to-amber-200">
              {subtitle}
            </span>
          </h1>
          <p className="text-xl text-pink-100 mb-8">
            {description}
          </p>
          {areLinksNeeded && (
            <div className="flex flex-col sm:flex-row gap-4">
              {links?.map((link: any, index: any) => (
                <Link key={index} href={link.href}>
                  <Button className='bg-linear-to-br from-gray-900 via-pink-800 to-pink-600 hover:from-pink-600 hover:via-pink-800 hover:to-gray-900 text-white rounded-2xl' size={'lg'}>
                    {link.label}
                  </Button>
                </Link>

              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default HeroSection