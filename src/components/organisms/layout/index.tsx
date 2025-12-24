import { memo, ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import logoFinds from '@/assets/images/brand/logo-finds.png'

type props = {
  children?: ReactNode
}

type NavItem = {
  name: string
  path: string
  children?: { name: string; path: string }[]
}

const navItems: NavItem[] = [
  {
    name: 'About FINDS',
    path: '/about/introduction',
    children: [
      { name: 'Introduction', path: '/about/introduction' },
      { name: 'Honors & Awards', path: '/about/honors' },
      { name: 'Location', path: '/about/location' },
    ]
  },
  {
    name: 'Members',
    path: '/members/director',
    children: [
      { name: 'Director', path: '/members/director' },
      { name: 'Current Members', path: '/members/current' },
    ]
  },
  { name: 'Publications', path: '/publications' },
  {
    name: 'Archives',
    path: '/archives/news',
    children: [
      { name: 'News', path: '/archives/news' },
      { name: 'Notice', path: '/archives/notice' },
      { name: 'Gallery', path: '/archives/gallery' },
      { name: 'Playlist', path: '/archives/playlist' },
    ]
  },
]

const footerLinks = [
  { name: '한국연구재단', url: 'https://www.nrf.re.kr' },
  { name: 'Google Scholar', url: 'https://scholar.google.com' },
  { name: 'Web of Science', url: 'https://www.webofscience.com' },
  { name: 'Scopus', url: 'https://www.scopus.com' },
]

const LayoutOrganisms = ({ children }: props) => {
  const location = useLocation()
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const isActive = (item: NavItem) => {
    if (item.path === '/') {
      return location.pathname === '/'
    }
    if (item.children) {
      return item.children.some(child => location.pathname === child.path)
    }
    return location.pathname === item.path
  }

  const handleMouseEnter = (name: string) => {
    setOpenMenu(name)
  }

  const handleMouseLeave = () => {
    setOpenMenu(null)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="w-full bg-white/20 border-b border-gray-100 relative z-50">
        <div className="max-w-1480 mx-auto flex items-center justify-between px-20 py-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-16">
            <img src={logoFinds} alt="FINDS Lab" className="max-h-59" />
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-900">FINDS Lab</span>
              <span className="text-base text-gray-400">Dongduk Women's University</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav>
            <ul className="flex items-center gap-60">
              {navItems.map((item) => (
                <li
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.children && handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to={item.path}
                    className={clsx(
                      'flex items-center gap-4 text-md transition-colors',
                      isActive(item)
                        ? 'font-medium text-primary'
                        : 'font-normal text-gray-900 hover:text-primary'
                    )}
                  >
                    {item.name}
                    {item.children && (
                      <ChevronDown
                        size={16}
                        className={clsx(
                          'transition-transform',
                          openMenu === item.name && 'rotate-180'
                        )}
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.children && openMenu === item.name && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-12">
                      <div className="bg-white rounded-xl border border-gray-100 shadow-lg py-8 min-w-160">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={clsx(
                              'block px-20 py-12 text-base transition-colors hover:bg-gray-50 whitespace-nowrap',
                              location.pathname === child.path
                                ? 'text-primary font-medium'
                                : 'text-gray-700'
                            )}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-100">
        <div className="max-w-1480 mx-auto flex flex-col gap-40 px-20 py-30">
          {/* Logo & Links */}
          <div className="flex items-center gap-80">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-16">
              <img
                src={logoFinds}
                alt="FINDS Lab"
                className="max-h-59 grayscale opacity-60"
              />
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-400">FINDS Lab</span>
                <span className="text-base text-gray-400">Dongduk Women's University</span>
              </div>
            </Link>
          </div>

          <div className={'flex justify-between'}>
            {/* Footer Links */}
            <div className="flex items-center gap-60">
              {footerLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-gray-500! hover:text-gray-700"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-base text-gray-500">
              © 2025 FINDS Lab All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default memo(LayoutOrganisms)
