'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Event, EVENT_CATEGORIES } from '@/lib/types'
import ImageUpload from '@/app/components/ImageUpload'
import EventsList from './list'
import toast from 'react-hot-toast'

export default function EventsAdmin() {
  const [event, setEvent] = useState<Partial<Event>>({
    title: '',
    category: '',
    description: '',
    start_date: '',
    end_date: '',
    start_time: '',
    location: '',
    image_url: null,
    featured: false
  })
  
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEvent({ ...event, [name]: value })
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setEvent({ ...event, [name]: checked })
  }

  const handleImageUploaded = (url: string) => {
    setEvent({ ...event, image_url: url })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      
      // Validate required fields
      if (!event.title || !event.category || !event.start_date || !event.end_date || !event.location) {
        throw new Error('Title, category, dates, and location are required fields!')
      }
      
      // Check dates
      const startDate = new Date(event.start_date)
      const endDate = new Date(event.end_date)
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date format')
      }
      
      if (startDate > endDate) {
        throw new Error('End date must be after start date')
      }
      
      // Insert into database
      const { error } = await supabase.from('events').insert(event)
      
      if (error) {
        throw error
      }
      
      toast.success('Event added successfully!')
      
      // Reset the form
      setEvent({
        title: '',
        category: '',
        description: '',
        start_date: '',
        end_date: '',
        start_time: '',
        location: '',
        image_url: null,
        featured: false
      })
      
      setShowForm(false)
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to add event')
      console.error('Error adding event:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
        >
          {showForm ? 'Cancel' : 'Add New Event'}
        </button>
      </div>
      
      {showForm && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
          <h2 className="text-xl font-bold mb-6">Add New Event</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Title*
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Event title"
                  value={event.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {/* Category */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                  Category*
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="category"
                  name="category"
                  value={event.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {EVENT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category.replace(/-/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Start Date */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start_date">
                  Start Date*
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={event.start_date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {/* Start Time */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start_time">
                  Start Time
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="start_time"
                  name="start_time"
                  type="time"
                  value={event.start_time}
                  onChange={handleChange}
                />
              </div>
              
              {/* End Date */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="end_date">
                  End Date*
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={event.end_date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {/* Location */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                  Location*
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Event location"
                  value={event.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                name="description"
                rows={4}
                placeholder="Event description"
                value={event.description}
                onChange={handleChange}
              />
            </div>
            
            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Event Image
              </label>
              <ImageUpload onImageUploaded={handleImageUploaded} folder="events" />
              {event.image_url && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Current image:</p>
                  <img
                    src={event.image_url}
                    alt="Event preview"
                    className="mt-1 h-32 w-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
            
            {/* Featured checkbox */}
            <div className="mb-6">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={!!event.featured}
                  onChange={handleCheckboxChange}
                  className="form-checkbox mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Featured (will be displayed prominently)</span>
              </label>
            </div>
            
            {/* Submit Button */}
            <div className="flex items-center justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Adding...' : 'Add Event'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <EventsList />
    </div>
  )
} 