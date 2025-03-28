'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Place, PLACE_CATEGORIES } from '@/lib/types'
import ImageUpload from '@/app/components/ImageUpload'
import PlacesList from './list'
import toast from 'react-hot-toast'
import FileUpload from '@/app/components/FileUpload'

export default function PlacesAdmin() {
  const [place, setPlace] = useState<Partial<Place>>({
    name: '',
    category: '',
    address: '',
    city: '',
    phone: '',
    website: '',
    instagram: '',
    description: '',
    image_url: null,
    hours: '',
    featured: false,
    tags: []
  })
  
  const [isPotosinoBrand, setIsPotosinoBrand] = useState(false)
  const [isLocalBrand, setIsLocalBrand] = useState(false)
  const [isBreakfastPlace, setIsBreakfastPlace] = useState(false)
  const [otherTags, setOtherTags] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPlace({ ...place, [name]: value })
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setPlace({ ...place, [name]: checked })
  }

  const handleTagCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    if (name === 'potosinoBrand') {
      setIsPotosinoBrand(checked)
    } else if (name === 'localBrand') {
      setIsLocalBrand(checked)
    } else if (name === 'breakfastPlace') {
      setIsBreakfastPlace(checked)
    }
  }

  const handleImageUploaded = (url: string) => {
    setPlace({ ...place, image_url: url })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      
      // Prepare tags
      const tags: string[] = []
      if (isPotosinoBrand) tags.push('potosino')
      if (isLocalBrand) tags.push('local')
      if (isBreakfastPlace) tags.push('breakfast')
      
      // Add other tags if provided
      if (otherTags) {
        const additionalTags = otherTags.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean)
        tags.push(...additionalTags)
      }
      
      // Create the complete place object
      const completePlace: Place = {
        ...place as Place,
        tags
      }
      
      // Validate required fields
      if (!completePlace.name || !completePlace.category || !completePlace.address) {
        throw new Error('Name, category, and address are required fields!')
      }
      
      // Insert into database
      const { error } = await supabase.from('places').insert(completePlace)
      
      if (error) {
        throw error
      }
      
      toast.success('Place added successfully!')
      
      // Reset the form
      setPlace({
        name: '',
        category: '',
        address: '',
        city: '',
        phone: '',
        website: '',
        instagram: '',
        description: '',
        image_url: null,
        hours: '',
        featured: false,
        tags: []
      })
      setIsPotosinoBrand(false)
      setIsLocalBrand(false)
      setIsBreakfastPlace(false)
      setOtherTags('')
      setShowForm(false)
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to add place')
      console.error('Error adding place:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Places</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
        >
          {showForm ? 'Cancel' : 'Add New Place'}
        </button>
      </div>
      
      {showForm && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
          <h2 className="text-xl font-bold mb-6">Add New Place</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Name*
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Place name"
                  value={place.name}
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
                  value={place.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {PLACE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category.replace(/-/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Address */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                  Address*
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Address"
                  value={place.address}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {/* City */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                  City
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="city"
                  name="city"
                  type="text"
                  placeholder="City"
                  value={place.city}
                  onChange={handleChange}
                />
              </div>
              
              {/* Phone */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                  Phone
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="Phone number"
                  value={place.phone}
                  onChange={handleChange}
                />
              </div>
              
              {/* Website */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="website">
                  Website
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="website"
                  name="website"
                  type="text"
                  placeholder="Website URL"
                  value={place.website}
                  onChange={handleChange}
                />
              </div>
              
              {/* Instagram */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="instagram">
                  Instagram
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="instagram"
                  name="instagram"
                  type="text"
                  placeholder="Instagram handle"
                  value={place.instagram}
                  onChange={handleChange}
                />
              </div>
              
              {/* Hours */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hours">
                  Business Hours
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="hours"
                  name="hours"
                  type="text"
                  placeholder="Example: Mon-Fri: 9am-5pm, Sat: 10am-3pm"
                  value={place.hours}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                name="description"
                rows={4}
                placeholder="Describe this place"
                value={place.description}
                onChange={handleChange}
              />
            </div>
            
            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Image
              </label>
              <FileUpload 
                onFileUploaded={handleImageUploaded} 
                folder="places"
                label="Choose Image"
                allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp']}
              />
              {place.image_url && (
                <p className="mt-2 text-sm text-gray-500">Image URL: {place.image_url}</p>
              )}
            </div>
            
            {/* Tags Section */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-4 mb-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="potosinoBrand"
                    checked={isPotosinoBrand}
                    onChange={handleTagCheckboxChange}
                    className="mr-2"
                  />
                  <span>Potosino Brand</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="localBrand"
                    checked={isLocalBrand}
                    onChange={handleTagCheckboxChange}
                    className="mr-2"
                  />
                  <span>Local Brand</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="breakfastPlace"
                    checked={isBreakfastPlace}
                    onChange={handleTagCheckboxChange}
                    className="mr-2"
                  />
                  <span>Breakfast Place</span>
                </label>
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-2" htmlFor="otherTags">
                  Other Tags (comma separated)
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="otherTags"
                  name="otherTags"
                  type="text"
                  placeholder="family-friendly, pet-friendly, outdoor-seating"
                  value={otherTags}
                  onChange={(e) => setOtherTags(e.target.value)}
                />
              </div>
            </div>
            
            {/* Featured checkbox */}
            <div className="mb-6">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={!!place.featured}
                  onChange={handleCheckboxChange}
                  className="form-checkbox"
                />
                <span className="ml-2">Featured</span>
              </label>
            </div>
            
            {/* Submit Button */}
            <div className="flex items-center justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full md:w-auto"
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Adding...' : 'Add Place'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* List existing places */}
      <PlacesList />
    </div>
  )
} 