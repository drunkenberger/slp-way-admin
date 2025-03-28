'use client'

import { Fragment, useState, useEffect } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Places', href: '/admin/places' },
  { name: 'Events', href: '/admin/events' },
  { name: 'Services', href: '/admin/services' },
  { name: 'Brands', href: '/admin/brands' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoError, setLogoError] = useState(false)
  
  useEffect(() => {
    // Try to load the logo image
    const logoImg = document.createElement('img')
    logoImg.src = '/images/logo.jpg'
    
    // If the image loads successfully, use it
    logoImg.onload = () => {
      setLogoUrl('/images/logo.jpg')
      setLogoError(false)
    }
    
    // If the image fails to load, try a PNG version
    logoImg.onerror = () => {
      const pngImg = document.createElement('img')
      pngImg.src = '/images/logo.png'
      
      pngImg.onload = () => {
        setLogoUrl('/images/logo.png')
        setLogoError(false)
      }
      
      pngImg.onerror = () => {
        setLogoError(true)
      }
    }
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Disclosure as="nav" className="bg-white shadow-sm">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-20 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    {/* Logo */}
                    <Link href="/admin">
                      <div className="flex items-center">
                        {!logoError && logoUrl ? (
                          <div className="relative h-12 w-12 mr-3 overflow-hidden rounded-full">
                            <img 
                              src={logoUrl} 
                              alt="SLP Way Logo"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-12 w-12 mr-3 bg-blue-500 text-white rounded-full">
                            <span className="font-bold text-lg">SLP</span>
                          </div>
                        )}
                        <div>
                          <span className="text-xl font-semibold text-gray-900">SLP Way Admin</span>
                          <p className="text-xs text-gray-500 mt-1">Administration tool for San Luis Way Directory Database</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
                    {/* Desktop navigation links */}
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          pathname === item.href
                            ? 'border-indigo-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                          'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                        )}
                        aria-current={pathname === item.href ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {/* Mobile navigation links */}
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                      'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                    )}
                    aria-current={pathname === item.href ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <div className="py-6 flex-grow">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white shadow-inner py-6 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            {!logoError && logoUrl ? (
              <div className="relative h-10 w-10 mb-2 overflow-hidden rounded-full">
                <img 
                  src={logoUrl} 
                  alt="SLP Way Logo"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-10 w-10 mb-2 bg-blue-500 text-white rounded-full">
                <span className="font-bold">SLP</span>
              </div>
            )}
            <p className="text-sm text-gray-500">San Luis Way Directory Admin Tool</p>
            <p className="text-xs text-gray-400 mt-1">© {new Date().getFullYear()} SLP Way</p>
            <p className="text-xs text-gray-400 mt-1">Created by V3rG4z0$ LLC</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 