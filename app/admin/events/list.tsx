'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Event, EVENT_CATEGORIES } from '@/lib/types'
import { XCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  
  useEffect(() => {
    fetchEvents()
  }, [])
  
  const fetchEvents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true })
      
      if (error) {
        throw error
      }
      
      setEvents(data || [])
    } catch (error: any) {
      console.error('Error fetching events:', error)
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }
  
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return
    }
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
      
      if (error) {
        throw error
      }
      
      // Update the UI
      setEvents(events.filter(event => event.id !== id))
      toast.success('Event deleted successfully')
    } catch (error: any) {
      console.error('Error deleting event:', error)
      toast.error('Failed to delete event')
    }
  }
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format time to be more readable
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    
    // Convert 24-hour format to 12-hour format with AM/PM
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const isPM = hour >= 12;
      const displayHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
      return `${displayHour}:${minutes} ${isPM ? 'PM' : 'AM'}`;
    } catch (error) {
      return timeString; // Return the original if parsing fails
    }
  };
  
  // Filter events based on search term and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = 
      categoryFilter === '' || 
      event.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Manage Events</h2>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Search events..."
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
            {EVENT_CATEGORIES.map((category) => (
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
          {filteredEvents.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">No events found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow overflow-hidden">
                  {event.image_url ? (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={event.image_url} 
                        alt={event.title}
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
                      <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                      {event.featured && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {event.category.replace(/-/g, ' ')}
                    </p>
                    
                    <div className="text-sm text-gray-700 mb-2">
                      <p className="font-medium">Date: </p>
                      <p>{formatDate(event.start_date)} 
                      {event.end_date && event.end_date !== event.start_date ? 
                        ` - ${formatDate(event.end_date)}` : ''}
                      </p>
                      {event.start_time && (
                        <p className="text-sm text-gray-600">
                          Time: {formatTime(event.start_time)}
                        </p>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-3">
                      <span className="font-medium">Location: </span>
                      {event.location}
                    </p>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {event.description}
                    </p>
                    
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={() => handleDelete(event.id as number)}
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