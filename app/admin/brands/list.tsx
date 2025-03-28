'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Brand, BRAND_CATEGORIES } from '@/lib/types'
import { XCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function BrandsList() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  
  useEffect(() => {
    fetchBrands()
  }, [])
  
  const fetchBrands = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name')
      
      if (error) {
        throw error
      }
      
      setBrands(data || [])
    } catch (error: any) {
      console.error('Error fetching brands:', error)
      toast.error('Failed to load brands')
    } finally {
      setLoading(false)
    }
  }
  
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) {
      return
    }
    
    try {
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', id)
      
      if (error) {
        throw error
      }
      
      // Update the UI
      setBrands(brands.filter(brand => brand.id !== id))
      toast.success('Brand deleted successfully')
    } catch (error: any) {
      console.error('Error deleting brand:', error)
      toast.error('Failed to delete brand')
    }
  }
  
  // Filter brands based on search term and category
  const filteredBrands = brands.filter(brand => {
    const matchesSearch = 
      searchTerm === '' || 
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (brand.description && brand.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (brand.notable_products && brand.notable_products.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = 
      categoryFilter === '' || 
      brand.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Manage Brands</h2>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="md:w-64">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Category
          </label>
          <select
            id="category"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {BRAND_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredBrands.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">No brands found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBrands.map((brand) => (
                <div key={brand.id} className="bg-white rounded-lg shadow overflow-hidden">
                  {brand.image_url ? (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={brand.image_url} 
                        alt={brand.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Replace broken image with placeholder
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=No+Image'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg mb-1">{brand.name}</h3>
                      {brand.featured && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {brand.category}
                    </p>
                    
                    <p className="text-sm text-gray-500 mb-1">
                      {brand.city}
                    </p>
                    
                    {brand.year_founded && (
                      <p className="text-sm text-gray-500 mb-2">
                        Founded: {brand.year_founded}
                      </p>
                    )}
                    
                    {brand.notable_products && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        <span className="font-medium">Products:</span> {brand.notable_products}
                      </p>
                    )}
                    
                    <div className="flex justify-end space-x-2 mt-3">
                      <button
                        onClick={() => handleDelete(brand.id as number)}
                        className="p-1 text-gray-600 hover:text-red-600"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
} 