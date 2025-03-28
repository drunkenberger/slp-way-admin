'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Place, PLACE_CATEGORIES } from '@/lib/types'
import { XCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function PlacesList() {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  
  useEffect(() => {
    fetchPlaces()
  }, [])
  
  const fetchPlaces = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .order('name')
      
      if (error) {
        throw error
      }
      
      setPlaces(data || [])
    } catch (error: any) {
      console.error('Error fetching places:', error)
      toast.error('Failed to load places')
    } finally {
      setLoading(false)
    }
  }
  
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this place?')) {
      return
    }
    
    try {
      const { error } = await supabase
        .from('places')
        .delete()
        .eq('id', id)
      
      if (error) {
        throw error
      }
      
      // Update the UI
      setPlaces(places.filter(place => place.id !== id))
      toast.success('Place deleted successfully')
    } catch (error: any) {
      console.error('Error deleting place:', error)
      toast.error('Failed to delete place')
    }
  }
  
  // Filter places based on search term and category
  const filteredPlaces = places.filter(place => {
    const matchesSearch = 
      searchTerm === '' || 
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = 
      categoryFilter === '' || 
      place.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Manage Places</h2>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Search places..."
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
            {PLACE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category.replace(/-/g, ' ')}
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
          {filteredPlaces.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">No places found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map((place) => (
                <div key={place.id} className="bg-white rounded-lg shadow overflow-hidden">
                  {place.image_url ? (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={place.image_url} 
                        alt={place.name}
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
                      <h3 className="font-bold text-lg mb-1">{place.name}</h3>
                      {place.featured && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {place.category.replace(/-/g, ' ')}
                    </p>
                    
                    <p className="text-sm text-gray-500 truncate mb-4">
                      {place.address}
                    </p>
                    
                    {place.tags && place.tags.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-1">
                        {place.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-xs px-2 py-1 rounded ${
                              tag === 'breakfast' 
                                ? 'bg-orange-100 text-orange-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={() => window.location.href = `/admin/places/edit/${place.id}`}
                        className="p-1 text-gray-600 hover:text-indigo-600"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={() => place.id && handleDelete(place.id)}
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