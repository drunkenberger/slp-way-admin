'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Service, SERVICE_CATEGORIES } from '@/lib/types'
import ImageUpload from '@/app/components/ImageUpload'
import DocumentUpload from '@/app/components/DocumentUpload'
import toast from 'react-hot-toast'

export default function ServicesAdmin() {
  const [service, setService] = useState<Partial<Service & { document_url?: string | null }>>({
    name: '',
    category: '',
    description: '',
    contact_name: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    service_area: '',
    hours: '',
    image_url: null,
    document_url: null,
    featured: false
  })
  
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setService({ ...service, [name]: value })
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setService({ ...service, [name]: checked })
  }

  const handleImageUploaded = (url: string) => {
    setService({ ...service, image_url: url })
  }

  const handleDocumentUploaded = (url: string) => {
    setService({ ...service, document_url: url })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      
      // Validate required fields
      if (!service.name || !service.category || !service.contact_name || !service.phone) {
        throw new Error('Name, category, contact name, and phone are required fields!')
      }
      
      // Prepare data for submission
      const serviceData = {
        ...service,
      }
      
      // Insert into database
      const { error } = await supabase.from('services').insert(serviceData)
      
      if (error) {
        throw error
      }
      
      toast.success('Service added successfully!')
      
      // Reset the form
      setService({
        name: '',
        category: '',
        description: '',
        contact_name: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        service_area: '',
        hours: '',
        image_url: null,
        document_url: null,
        featured: false
      })
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to add service')
      console.error('Error adding service:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add New Service</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
              placeholder="Service name"
              value={service.name}
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
              value={service.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {SERVICE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category.replace(/-/g, ' ')}
                </option>
              ))}
            </select>
          </div>
          
          {/* Contact Name */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact_name">
              Contact Name*
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="contact_name"
              name="contact_name"
              type="text"
              placeholder="Contact person name"
              value={service.contact_name}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Phone */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Phone*
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone"
              name="phone"
              type="text"
              placeholder="Phone number"
              value={service.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              value={service.email}
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
              value={service.website}
              onChange={handleChange}
            />
          </div>
          
          {/* Address */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="address"
              name="address"
              type="text"
              placeholder="Physical address"
              value={service.address}
              onChange={handleChange}
            />
          </div>
          
          {/* Service Area */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="service_area">
              Service Area
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="service_area"
              name="service_area"
              type="text"
              placeholder="Areas served"
              value={service.service_area}
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
              placeholder="Operating hours"
              value={service.hours}
              onChange={handleChange}
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
            placeholder="Service description"
            value={service.description}
            onChange={handleChange}
          />
        </div>
        
        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Service Image
          </label>
          <ImageUpload onImageUploaded={handleImageUploaded} folder="services" />
          {service.image_url && (
            <p className="mt-2 text-sm text-gray-500">Image URL: {service.image_url}</p>
          )}
        </div>
        
        {/* Document Upload */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Service Brochure/Document (optional)
          </label>
          <DocumentUpload onDocumentUploaded={handleDocumentUploaded} folder="documents" />
          {service.document_url && (
            <p className="mt-2 text-sm text-gray-500">Document URL: {service.document_url}</p>
          )}
        </div>
        
        {/* Featured checkbox */}
        <div className="mb-6">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={!!service.featured}
              onChange={handleCheckboxChange}
              className="form-checkbox"
            />
            <span className="ml-2">Featured</span>
          </label>
        </div>
        
        {/* Submit Button */}
        <div className="flex items-center justify-center">
          <button
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full md:w-auto"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Adding...' : 'Add Service'}
          </button>
        </div>
      </form>
    </div>
  )
} 