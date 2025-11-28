import Link from 'next/link';
import Image from 'next/image';
import { MobileMenuClient } from './MobileMenuClient';

export default function Header() {
  const menuItems = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/properties', label: 'Properties' },
    { href: '/listings', label: 'Listings' },
    { href: '/about-us', label: 'About Us' },
    { href: '/contact-us', label: 'Contact Us' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-lg"
              aria-label="Home"
            >
              <Image
                src="/logo.png"
                alt="Waterstone Logo"
                width={180}
                height={50}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:space-x-1" aria-label="Main navigation">
            <ul className="flex items-center space-x-1">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="px-4 py-2 text-sm font-semibold text-brand-dark hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <Link
              href="/contact-us"
              className="px-6 py-2.5 bg-brand-primary text-white text-sm font-medium rounded-lg hover:bg-brand-dark transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
            >
              TENANT LOGIN
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <MobileMenuClient />
        </div>
      </div>
    </header>
  );
}

