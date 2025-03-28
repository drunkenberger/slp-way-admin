'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Brand, BRAND_CATEGORIES } from '@/lib/types'
import ImageUpload from '@/app/components/ImageUpload'
import BrandsList from './list'
import toast from 'react-hot-toast'

export default function BrandsAdmin() {
  const [brand, setBrand] = useState<Partial<Brand>>({
    name: '',
    category: '',
    year_founded: '',
    address: '',
    city: '',
    phone: '',
    website: '',
    instagram: '',
    description: '',
    notable_products: '',
    where_to_buy: '',
    image_url: null,
    featured: false
  })
  
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBrand({ ...brand, [name]: value })
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setBrand({ ...brand, [name]: checked })
  }

  const handleImageUploaded = (url: string) => {
    setBrand({ ...brand, image_url: url })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      
      // Validate required fields
      if (!brand.name || !brand.category || !brand.city) {
        throw new Error('Name, category, and city are required fields!')
      }
      
      // Prepare data for submission
      const brandData = {
        ...brand,
      }
      
      // Insert into database
      const { error } = await supabase.from('brands').insert(brandData)
      
      if (error) {
        throw error
      }
      
      toast.success('Brand added successfully!')
      
      // Reset the form
      setBrand({
        name: '',
        category: '',
        year_founded: '',
        address: '',
        city: '',
        phone: '',
        website: '',
        instagram: '',
        description: '',
        notable_products: '',
        where_to_buy: '',
        image_url: null,
        featured: false
      })
      
      setShowForm(false)
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to add brand')
      console.error('Error adding brand:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Brands</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
        >
          {showForm ? 'Cancel' : 'Add New Brand'}
        </button>
      </div>
      
      {showForm && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
          <h2 className="text-xl font-bold mb-6">Add New Brand</h2>
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
                  placeholder="Brand name"
                  value={brand.name}
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
                  value={brand.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {BRAND_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Year Founded */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="year_founded">
                  Year Founded
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="year_founded"
                  name="year_founded"
                  type="text"
                  placeholder="Year the brand was founded"
                  value={brand.year_founded}
                  onChange={handleChange}
                />
              </div>
              
              {/* City */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                  City*
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="city"
                  name="city"
                  type="text"
                  placeholder="City where the brand is based"
                  value={brand.city}
                  onChange={handleChange}
                  required
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
                  value={brand.address}
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
                  value={brand.phone}
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
                  value={brand.website}
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
                  value={brand.instagram}
                  onChange={handleChange}
                />
              </div>
              
              {/* Notable Products */}
              <div className="mb-4 md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notable_products">
                  Notable Products
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="notable_products"
                  name="notable_products"
                  placeholder="Describe the brand's notable products"
                  rows={3}
                  value={brand.notable_products}
                  onChange={handleChange}
                />
              </div>
              
              {/* Where to Buy */}
              <div className="mb-4 md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="where_to_buy">
                  Where to Buy
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="where_to_buy"
                  name="where_to_buy"
                  placeholder="Where can people buy these products"
                  rows={3}
                  value={brand.where_to_buy}
                  onChange={handleChange}
                />
              </div>
              
              {/* Description */}
              <div className="mb-4 md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="description"
                  name="description"
                  placeholder="Brand description"
                  rows={4}
                  value={brand.description}
                  onChange={handleChange}
                />
              </div>
              
              {/* Featured */}
              <div className="mb-4 md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={brand.featured}
                    onChange={handleCheckboxChange}
                    className="mr-2 leading-tight"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Featured Brand (will be displayed prominently)
                  </span>
                </label>
              </div>
              
              {/* Image Upload */}
              <div className="mb-4 md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Brand Image
                </label>
                <ImageUpload onImageUploaded={handleImageUploaded} folder="brands" />
                {brand.image_url && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Current image:</p>
                    <img
                      src={brand.image_url}
                      alt="Brand preview"
                      className="mt-1 h-32 w-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-end mt-6">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Adding...' : 'Add Brand'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <BrandsList />
    </div>
  )
} 