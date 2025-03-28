'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface DashboardStats {
  places: number
  events: number
  services: number
  brands: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    places: 0,
    events: 0,
    services: 0,
    brands: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        
        // Fetch counts from all tables
        const [placesData, eventsData, servicesData, brandsData] = await Promise.all([
          supabase.from('places').select('id', { count: 'exact', head: true }),
          supabase.from('events').select('id', { count: 'exact', head: true }),
          supabase.from('services').select('id', { count: 'exact', head: true }),
          supabase.from('brands').select('id', { count: 'exact', head: true })
        ])
        
        setStats({
          places: placesData.count || 0,
          events: eventsData.count || 0,
          services: servicesData.count || 0,
          brands: brandsData.count || 0
        })
      } catch (error: any) {
        console.error('Error fetching dashboard stats:', error)
        toast.error('Failed to load dashboard statistics')
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">SLP Way Admin Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Places Card */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Places</h2>
                <span className="text-3xl font-bold text-blue-600">{stats.places}</span>
              </div>
              <p className="text-gray-600 mb-4">Restaurants, bars, shops, and other locations</p>
              <Link href="/admin/places" className="mt-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-center transition">
                Manage Places
              </Link>
            </div>
            
            {/* Events Card */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Events</h2>
                <span className="text-3xl font-bold text-green-600">{stats.events}</span>
              </div>
              <p className="text-gray-600 mb-4">Upcoming and recurring events in San Luis Potosí</p>
              <Link href="/admin/events" className="mt-auto bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-center transition">
                Manage Events
              </Link>
            </div>
            
            {/* Services Card */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Services</h2>
                <span className="text-3xl font-bold text-purple-600">{stats.services}</span>
              </div>
              <p className="text-gray-600 mb-4">Service providers for expats and locals</p>
              <Link href="/admin/services" className="mt-auto bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded text-center transition">
                Manage Services
              </Link>
            </div>
            
            {/* Brands Card */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Potosino Brands</h2>
                <span className="text-3xl font-bold text-orange-600">{stats.brands}</span>
              </div>
              <p className="text-gray-600 mb-4">Local brands and products from San Luis Potosí</p>
              <Link href="/admin/brands" className="mt-auto bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded text-center transition">
                Manage Brands
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Guide</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use the <strong>Places</strong> section to manage restaurants, bars, shops, and other locations.</li>
              <li>The <strong>Events</strong> section is for adding and updating upcoming events.</li>
              <li>Add service providers and professionals in the <strong>Services</strong> section.</li>
              <li>The <strong>Potosino Brands</strong> section is for showcasing local products and businesses.</li>
            </ul>
            <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
              <h3 className="font-semibold text-blue-700 mb-2">Tip</h3>
              <p>For best results, always upload high-quality images in landscape orientation (16:9 ratio) for consistent display across the website.</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 