import tkinter as tk
from tkinter import ttk, messagebox, filedialog
from supabase.client import create_client, Client
import os
from dotenv import load_dotenv
from datetime import datetime
import uuid

# Load environment variables
load_dotenv()

# Get Supabase credentials
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("Missing Supabase credentials. Please check your .env file.")

print(f"Initializing Supabase client with URL: {supabase_url}")
print(f"Using key: {supabase_key[:10]}...")  # Only print first 10 chars of key for security

# Initialize Supabase client
try:
    supabase: Client = create_client(supabase_url, supabase_key)
    print("Supabase client initialized successfully")
except Exception as e:
    print(f"Error initializing Supabase client: {str(e)}")
    raise

class AdminTool:
    def __init__(self, root):
        self.root = root
        self.root.title("SLP Directory Admin Tool")
        self.root.geometry("800x600")

        # Create notebook for tabs
        self.notebook = ttk.Notebook(root)
        self.notebook.pack(expand=True, fill='both', padx=10, pady=5)

        # Create tabs
        self.places_tab = ttk.Frame(self.notebook)
        self.events_tab = ttk.Frame(self.notebook)
        self.services_tab = ttk.Frame(self.notebook)
        self.brands_tab = ttk.Frame(self.notebook)
        self.notebook.add(self.places_tab, text='Places')
        self.notebook.add(self.events_tab, text='Events')
        self.notebook.add(self.services_tab, text='Services')
        self.notebook.add(self.brands_tab, text='Potosino Brands')

        # Initialize place form
        self.init_place_form()
        # Initialize event form
        self.init_event_form()
        # Initialize service form
        self.init_service_form()
        # Initialize brand form
        self.init_brand_form()

    def upload_image(self, file_path, folder_name):
        try:
            if not file_path:
                return None

            # Generate a unique filename
            file_extension = os.path.splitext(file_path)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            storage_path = f"{folder_name}/{unique_filename}"

            # Upload the file to Supabase storage
            with open(file_path, 'rb') as f:
                result = supabase.storage.from_('images').upload(storage_path, f)

            if result:
                # Get the public URL
                public_url = supabase.storage.from_('images').get_public_url(storage_path)
                print(f"Generated public URL: {public_url}")  # Debug log
                return public_url
            return None
        except Exception as e:
            messagebox.showerror("Error", f"Failed to upload image: {str(e)}")
            return None

    def init_place_form(self):
        # Place categories
        self.place_categories = [
            'traditional-cuisine', 'modern-dining', 'cocktail-bars', 'cantinas',
            'live-music', 'terraces', 'restaurants-with-playgrounds',
            'private-dining-rooms', 'language-exchange-cafes', 'remote-work-cafes',
            'easy-parking-spots', 'international-markets', 'english-speaking-healthcare',
            'family-activities', 'sports-fitness', 'outdoor-activities',
            'activities-rainy-day', 'local-organic-products', 'shop'
        ]

        # Create form frame
        form_frame = ttk.LabelFrame(self.places_tab, text="Add New Place", padding="10")
        form_frame.pack(fill='x', padx=10, pady=5)

        # Name
        ttk.Label(form_frame, text="Name:").grid(row=0, column=0, sticky='w', pady=5)
        self.place_name = ttk.Entry(form_frame, width=50)
        self.place_name.grid(row=0, column=1, columnspan=2, sticky='w', pady=5)

        # Category
        ttk.Label(form_frame, text="Category:").grid(row=1, column=0, sticky='w', pady=5)
        self.place_category = ttk.Combobox(form_frame, values=self.place_categories, width=47)
        self.place_category.grid(row=1, column=1, columnspan=2, sticky='w', pady=5)

        # Address
        ttk.Label(form_frame, text="Address:").grid(row=2, column=0, sticky='w', pady=5)
        self.place_address = ttk.Entry(form_frame, width=50)
        self.place_address.grid(row=2, column=1, columnspan=2, sticky='w', pady=5)

        # City
        ttk.Label(form_frame, text="City:").grid(row=3, column=0, sticky='w', pady=5)
        self.place_city = ttk.Entry(form_frame, width=50)
        self.place_city.grid(row=3, column=1, columnspan=2, sticky='w', pady=5)

        # Phone
        ttk.Label(form_frame, text="Phone:").grid(row=4, column=0, sticky='w', pady=5)
        self.place_phone = ttk.Entry(form_frame, width=50)
        self.place_phone.grid(row=4, column=1, columnspan=2, sticky='w', pady=5)

        # Website
        ttk.Label(form_frame, text="Website:").grid(row=5, column=0, sticky='w', pady=5)
        self.place_website = ttk.Entry(form_frame, width=50)
        self.place_website.grid(row=5, column=1, columnspan=2, sticky='w', pady=5)

        # Instagram
        ttk.Label(form_frame, text="Instagram:").grid(row=6, column=0, sticky='w', pady=5)
        self.place_instagram = ttk.Entry(form_frame, width=50)
        self.place_instagram.grid(row=6, column=1, columnspan=2, sticky='w', pady=5)

        # Description
        ttk.Label(form_frame, text="Description:").grid(row=7, column=0, sticky='w', pady=5)
        self.place_description = tk.Text(form_frame, width=50, height=4)
        self.place_description.grid(row=7, column=1, columnspan=2, sticky='w', pady=5)

        # Image upload
        ttk.Label(form_frame, text="Image:").grid(row=8, column=0, sticky='w', pady=5)
        self.place_image_path = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.place_image_path, width=40).grid(row=8, column=1, sticky='w', pady=5)
        ttk.Button(form_frame, text="Browse", command=lambda: self.browse_file(self.place_image_path)).grid(row=8, column=2, sticky='w', pady=5)

        # Hours
        ttk.Label(form_frame, text="Hours:").grid(row=9, column=0, sticky='w', pady=5)
        self.place_hours = ttk.Entry(form_frame, width=50)
        self.place_hours.grid(row=9, column=1, columnspan=2, sticky='w', pady=5)

        # Tags section
        tags_frame = ttk.LabelFrame(form_frame, text="Tags", padding=5)
        tags_frame.grid(row=10, column=0, columnspan=3, sticky='w', pady=5)
        
        # Helper text for brands
        ttk.Label(tags_frame, text="For brands, select 'shop' as category and check 'Potosino Brand'", 
                  foreground="blue").grid(row=0, column=0, columnspan=2, sticky='w', pady=5)
        
        # Potosino brand checkbox
        self.place_potosino_tag = tk.BooleanVar()
        ttk.Checkbutton(tags_frame, text="Potosino Brand", variable=self.place_potosino_tag).grid(row=1, column=0, sticky='w', padx=5)
        
        # Local brand checkbox
        self.place_local_tag = tk.BooleanVar()
        ttk.Checkbutton(tags_frame, text="Local Brand", variable=self.place_local_tag).grid(row=1, column=1, sticky='w', padx=5)
        
        # Other tags
        ttk.Label(tags_frame, text="Other Tags (comma separated):").grid(row=2, column=0, columnspan=2, sticky='w', pady=5)
        self.place_other_tags = ttk.Entry(tags_frame, width=50)
        self.place_other_tags.grid(row=3, column=0, columnspan=2, sticky='w', pady=5)

        # Featured checkbox
        self.place_featured = tk.BooleanVar()
        ttk.Checkbutton(form_frame, text="Featured", variable=self.place_featured).grid(row=11, column=0, sticky='w', pady=5)

        # Submit button
        ttk.Button(form_frame, text="Add Place", command=self.add_place).grid(row=12, column=0, columnspan=3, pady=20)

    def init_event_form(self):
        # Event categories
        self.event_categories = [
            'arts-culture', 'culinary', 'music', 'kids-family', 'sports',
            'traditional', 'wellness', 'community-social'
        ]

        # Create form frame
        form_frame = ttk.LabelFrame(self.events_tab, text="Add New Event", padding="10")
        form_frame.pack(fill='x', padx=10, pady=5)

        # Title
        ttk.Label(form_frame, text="Title:").grid(row=0, column=0, sticky='w', pady=5)
        self.event_title = ttk.Entry(form_frame, width=50)
        self.event_title.grid(row=0, column=1, columnspan=2, sticky='w', pady=5)

        # Category
        ttk.Label(form_frame, text="Category:").grid(row=1, column=0, sticky='w', pady=5)
        self.event_category = ttk.Combobox(form_frame, values=self.event_categories, width=47)
        self.event_category.grid(row=1, column=1, columnspan=2, sticky='w', pady=5)

        # Description
        ttk.Label(form_frame, text="Description:").grid(row=2, column=0, sticky='w', pady=5)
        self.event_description = tk.Text(form_frame, width=50, height=4)
        self.event_description.grid(row=2, column=1, columnspan=2, sticky='w', pady=5)

        # Start Date
        ttk.Label(form_frame, text="Start Date (YYYY-MM-DD):").grid(row=3, column=0, sticky='w', pady=5)
        self.event_start_date = ttk.Entry(form_frame, width=50)
        self.event_start_date.grid(row=3, column=1, columnspan=2, sticky='w', pady=5)

        # End Date
        ttk.Label(form_frame, text="End Date (YYYY-MM-DD):").grid(row=4, column=0, sticky='w', pady=5)
        self.event_end_date = ttk.Entry(form_frame, width=50)
        self.event_end_date.grid(row=4, column=1, columnspan=2, sticky='w', pady=5)

        # Location
        ttk.Label(form_frame, text="Location:").grid(row=5, column=0, sticky='w', pady=5)
        self.event_location = ttk.Entry(form_frame, width=50)
        self.event_location.grid(row=5, column=1, columnspan=2, sticky='w', pady=5)

        # Image upload
        ttk.Label(form_frame, text="Image:").grid(row=6, column=0, sticky='w', pady=5)
        self.event_image_path = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.event_image_path, width=40).grid(row=6, column=1, sticky='w', pady=5)
        ttk.Button(form_frame, text="Browse", command=lambda: self.browse_file(self.event_image_path)).grid(row=6, column=2, sticky='w', pady=5)

        # Featured checkbox
        self.event_featured = tk.BooleanVar()
        ttk.Checkbutton(form_frame, text="Featured", variable=self.event_featured).grid(row=7, column=1, sticky='w', pady=5)

        # Submit button
        ttk.Button(form_frame, text="Add Event", command=self.add_event).grid(row=8, column=0, columnspan=3, pady=20)

    def init_service_form(self):
        # Service categories
        self.service_categories = [
            'relocation', 'housing', 'legal', 'community', 'family',
            'petcare', 'wellness', 'homeservices', 'cultural', 'experiences'
        ]

        # Create form frame
        form_frame = ttk.LabelFrame(self.services_tab, text="Add New Service", padding="10")
        form_frame.pack(fill='x', padx=10, pady=5)

        # Name
        ttk.Label(form_frame, text="Name:").grid(row=0, column=0, sticky='w', pady=5)
        self.service_name = ttk.Entry(form_frame, width=50)
        self.service_name.grid(row=0, column=1, columnspan=2, sticky='w', pady=5)

        # Category
        ttk.Label(form_frame, text="Category:").grid(row=1, column=0, sticky='w', pady=5)
        self.service_category = ttk.Combobox(form_frame, values=self.service_categories, width=47)
        self.service_category.grid(row=1, column=1, columnspan=2, sticky='w', pady=5)

        # Description
        ttk.Label(form_frame, text="Description:").grid(row=2, column=0, sticky='w', pady=5)
        self.service_description = tk.Text(form_frame, width=50, height=4)
        self.service_description.grid(row=2, column=1, columnspan=2, sticky='w', pady=5)

        # Contact Name
        ttk.Label(form_frame, text="Contact Name:").grid(row=3, column=0, sticky='w', pady=5)
        self.service_contact_name = ttk.Entry(form_frame, width=50)
        self.service_contact_name.grid(row=3, column=1, columnspan=2, sticky='w', pady=5)

        # Phone
        ttk.Label(form_frame, text="Phone:").grid(row=4, column=0, sticky='w', pady=5)
        self.service_phone = ttk.Entry(form_frame, width=50)
        self.service_phone.grid(row=4, column=1, columnspan=2, sticky='w', pady=5)

        # Email
        ttk.Label(form_frame, text="Email:").grid(row=5, column=0, sticky='w', pady=5)
        self.service_email = ttk.Entry(form_frame, width=50)
        self.service_email.grid(row=5, column=1, columnspan=2, sticky='w', pady=5)

        # Website
        ttk.Label(form_frame, text="Website:").grid(row=6, column=0, sticky='w', pady=5)
        self.service_website = ttk.Entry(form_frame, width=50)
        self.service_website.grid(row=6, column=1, columnspan=2, sticky='w', pady=5)

        # Address
        ttk.Label(form_frame, text="Address:").grid(row=7, column=0, sticky='w', pady=5)
        self.service_address = ttk.Entry(form_frame, width=50)
        self.service_address.grid(row=7, column=1, columnspan=2, sticky='w', pady=5)

        # Service Area
        ttk.Label(form_frame, text="Service Area:").grid(row=8, column=0, sticky='w', pady=5)
        self.service_area = ttk.Entry(form_frame, width=50)
        self.service_area.grid(row=8, column=1, columnspan=2, sticky='w', pady=5)

        # Business Hours
        ttk.Label(form_frame, text="Business Hours:").grid(row=9, column=0, sticky='w', pady=5)
        self.service_hours = ttk.Entry(form_frame, width=50)
        self.service_hours.grid(row=9, column=1, columnspan=2, sticky='w', pady=5)

        # Image upload
        ttk.Label(form_frame, text="Image:").grid(row=10, column=0, sticky='w', pady=5)
        self.service_image_path = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.service_image_path, width=40).grid(row=10, column=1, sticky='w', pady=5)
        ttk.Button(form_frame, text="Browse", command=lambda: self.browse_file(self.service_image_path)).grid(row=10, column=2, sticky='w', pady=5)

        # Featured checkbox
        self.service_featured = tk.BooleanVar()
        ttk.Checkbutton(form_frame, text="Featured", variable=self.service_featured).grid(row=11, column=1, sticky='w', pady=5)

        # Submit button
        ttk.Button(form_frame, text="Add Service", command=self.add_service).grid(row=12, column=0, columnspan=3, pady=20)

    def init_brand_form(self):
        # Brand categories
        self.brand_categories = [
            'food', 'beverages', 'clothing', 'crafts', 'household', 
            'cosmetics', 'technology', 'furniture', 'accessories',
            'automotive', 'entertainment', 'other'
        ]

        # Create form frame
        form_frame = ttk.LabelFrame(self.brands_tab, text="Add New Potosino Brand", padding="10")
        form_frame.pack(fill='x', padx=10, pady=5)

        # Name
        ttk.Label(form_frame, text="Brand Name:").grid(row=0, column=0, sticky='w', pady=5)
        self.brand_name = ttk.Entry(form_frame, width=50)
        self.brand_name.grid(row=0, column=1, columnspan=2, sticky='w', pady=5)

        # Category
        ttk.Label(form_frame, text="Category:").grid(row=1, column=0, sticky='w', pady=5)
        self.brand_category = ttk.Combobox(form_frame, values=self.brand_categories, width=47)
        self.brand_category.grid(row=1, column=1, columnspan=2, sticky='w', pady=5)

        # Year Founded
        ttk.Label(form_frame, text="Year Founded:").grid(row=2, column=0, sticky='w', pady=5)
        self.brand_year_founded = ttk.Entry(form_frame, width=50)
        self.brand_year_founded.grid(row=2, column=1, columnspan=2, sticky='w', pady=5)

        # Address
        ttk.Label(form_frame, text="Address:").grid(row=3, column=0, sticky='w', pady=5)
        self.brand_address = ttk.Entry(form_frame, width=50)
        self.brand_address.grid(row=3, column=1, columnspan=2, sticky='w', pady=5)

        # City
        ttk.Label(form_frame, text="City:").grid(row=4, column=0, sticky='w', pady=5)
        self.brand_city = ttk.Entry(form_frame, width=50)
        self.brand_city.grid(row=4, column=1, columnspan=2, sticky='w', pady=5)

        # Phone
        ttk.Label(form_frame, text="Phone:").grid(row=5, column=0, sticky='w', pady=5)
        self.brand_phone = ttk.Entry(form_frame, width=50)
        self.brand_phone.grid(row=5, column=1, columnspan=2, sticky='w', pady=5)

        # Website
        ttk.Label(form_frame, text="Website:").grid(row=6, column=0, sticky='w', pady=5)
        self.brand_website = ttk.Entry(form_frame, width=50)
        self.brand_website.grid(row=6, column=1, columnspan=2, sticky='w', pady=5)

        # Instagram
        ttk.Label(form_frame, text="Instagram:").grid(row=7, column=0, sticky='w', pady=5)
        self.brand_instagram = ttk.Entry(form_frame, width=50)
        self.brand_instagram.grid(row=7, column=1, columnspan=2, sticky='w', pady=5)

        # Description
        ttk.Label(form_frame, text="Description:").grid(row=8, column=0, sticky='w', pady=5)
        self.brand_description = tk.Text(form_frame, width=50, height=4)
        self.brand_description.grid(row=8, column=1, columnspan=2, sticky='w', pady=5)

        # Products
        ttk.Label(form_frame, text="Notable Products:").grid(row=9, column=0, sticky='w', pady=5)
        self.brand_products = ttk.Entry(form_frame, width=50)
        self.brand_products.grid(row=9, column=1, columnspan=2, sticky='w', pady=5)

        # Where to buy
        ttk.Label(form_frame, text="Where to Buy:").grid(row=10, column=0, sticky='w', pady=5)
        self.brand_where_to_buy = ttk.Entry(form_frame, width=50)
        self.brand_where_to_buy.grid(row=10, column=1, columnspan=2, sticky='w', pady=5)

        # Image upload
        ttk.Label(form_frame, text="Brand Logo/Image:").grid(row=11, column=0, sticky='w', pady=5)
        self.brand_image_path = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.brand_image_path, width=40).grid(row=11, column=1, sticky='w', pady=5)
        ttk.Button(form_frame, text="Browse", command=lambda: self.browse_file(self.brand_image_path)).grid(row=11, column=2, sticky='w', pady=5)

        # Featured checkbox
        self.brand_featured = tk.BooleanVar()
        ttk.Checkbutton(form_frame, text="Featured", variable=self.brand_featured).grid(row=12, column=0, sticky='w', pady=5)

        # Submit button
        ttk.Button(form_frame, text="Add Brand", command=self.add_brand).grid(row=13, column=0, columnspan=3, pady=20)

    def browse_file(self, path_var):
        file_path = filedialog.askopenfilename(
            filetypes=[("Image files", "*.jpg *.jpeg *.png *.gif *.webp")]
        )
        if file_path:
            path_var.set(file_path)

    def add_place(self):
        try:
            # Upload image if selected
            image_url = None
            if self.place_image_path.get():
                image_url = self.upload_image(self.place_image_path.get(), 'places')
                if not image_url:
                    return

            # Process tags
            tags = []
            if self.place_potosino_tag.get():
                tags.append('potosino')
            if self.place_local_tag.get():
                tags.append('local')
            
            # Add other tags if provided
            other_tags = self.place_other_tags.get().strip()
            if other_tags:
                # Split by comma and strip whitespace from each tag
                additional_tags = [tag.strip().lower() for tag in other_tags.split(',') if tag.strip()]
                tags.extend(additional_tags)

            data = {
                'name': self.place_name.get(),
                'category': self.place_category.get(),
                'address': self.place_address.get(),
                'city': self.place_city.get(),
                'phone': self.place_phone.get(),
                'website': self.place_website.get(),
                'instagram': self.place_instagram.get(),
                'description': self.place_description.get('1.0', 'end-1c'),
                'image_url': image_url,
                'hours': self.place_hours.get(),
                'featured': self.place_featured.get(),
                'tags': tags
            }

            # Validate required fields
            if not data['name'] or not data['category'] or not data['address']:
                messagebox.showerror("Error", "Name, category, and address are required fields!")
                return

            # Insert into database
            result = supabase.table('places').insert(data).execute()
            
            if result.data:
                messagebox.showinfo("Success", "Place added successfully!")
                self.clear_place_form()
            else:
                messagebox.showerror("Error", "Failed to add place")

        except Exception as e:
            messagebox.showerror("Error", f"An error occurred: {str(e)}")

    def add_event(self):
        try:
            # Upload image if selected
            image_url = None
            if self.event_image_path.get():
                image_url = self.upload_image(self.event_image_path.get(), 'events')
                if not image_url:
                    return

            # Validate dates and convert to timestamp with timezone
            try:
                # Parse the date and add time component
                start_date = datetime.strptime(self.event_start_date.get(), '%Y-%m-%d')
                end_date = datetime.strptime(self.event_end_date.get(), '%Y-%m-%d')
                
                # Convert to UTC timestamps
                start_timestamp = start_date.isoformat() + 'Z'  # 'Z' indicates UTC
                end_timestamp = end_date.isoformat() + 'Z'
                
                print(f"Start timestamp: {start_timestamp}")
                print(f"End timestamp: {end_timestamp}")
            except ValueError as e:
                print(f"Date parsing error: {str(e)}")
                messagebox.showerror("Error", "Invalid date format. Please use YYYY-MM-DD")
                return

            # Prepare data
            data = {
                'title': self.event_title.get(),
                'category': self.event_category.get(),
                'description': self.event_description.get('1.0', 'end-1c'),
                'start_date': start_timestamp,
                'end_date': end_timestamp,
                'location': self.event_location.get(),
                'image_url': image_url,
                'featured': self.event_featured.get()
            }

            # Debug prints
            print("\nAttempting to insert event with data:")
            for key, value in data.items():
                print(f"{key}: {value} (type: {type(value)})")

            # Validate required fields
            if not data['title'] or not data['category'] or not data['start_date'] or not data['end_date'] or not data['location']:
                messagebox.showerror("Error", "Title, category, dates, and location are required fields!")
                return

            # Insert into database with error handling
            try:
                print("\nSending request to Supabase...")
                result = supabase.table('events').insert(data).execute()
                print(f"Supabase response: {result}")
                
                if result.data:
                    messagebox.showinfo("Success", "Event added successfully!")
                    self.clear_event_form()
                else:
                    print("No data in result")
                    messagebox.showerror("Error", "Failed to add event - no data returned")

            except Exception as db_error:
                print(f"\nDatabase error details: {str(db_error)}")
                if hasattr(db_error, 'response'):
                    print(f"Response content: {db_error.response.content}")
                raise

        except Exception as e:
            print(f"\nDetailed error: {str(e)}")
            print(f"Error type: {type(e)}")
            if hasattr(e, '__dict__'):
                print(f"Error attributes: {e.__dict__}")
            messagebox.showerror("Error", f"An error occurred: {str(e)}")

    def add_service(self):
        try:
            # Upload image if selected
            image_url = None
            if self.service_image_path.get():
                image_url = self.upload_image(self.service_image_path.get(), 'services')
                if not image_url:
                    return

            data = {
                'name': self.service_name.get(),
                'category': self.service_category.get(),
                'description': self.service_description.get('1.0', 'end-1c'),
                'contact_name': self.service_contact_name.get(),
                'phone': self.service_phone.get(),
                'email': self.service_email.get(),
                'website': self.service_website.get(),
                'address': self.service_address.get(),
                'service_area': self.service_area.get(),
                'hours': self.service_hours.get(),
                'image_url': image_url,
                'featured': self.service_featured.get()
            }

            # Validate required fields
            if not data['name'] or not data['category'] or not data['contact_name'] or not data['phone']:
                messagebox.showerror("Error", "Name, category, contact name, and phone are required fields!")
                return

            # Insert into database
            result = supabase.table('services').insert(data).execute()
            
            if result.data:
                messagebox.showinfo("Success", "Service added successfully!")
                self.clear_service_form()
            else:
                messagebox.showerror("Error", "Failed to add service")

        except Exception as e:
            messagebox.showerror("Error", f"An error occurred: {str(e)}")

    def add_brand(self):
        try:
            # Upload image if selected
            image_url = None
            if self.brand_image_path.get():
                image_url = self.upload_image(self.brand_image_path.get(), 'brands')
                if not image_url:
                    return

            # Create timestamp for created_at
            timestamp = datetime.now().isoformat()

            data = {
                'name': self.brand_name.get(),
                'category': self.brand_category.get(),
                'year_founded': self.brand_year_founded.get(),
                'address': self.brand_address.get(),
                'city': self.brand_city.get(),
                'phone': self.brand_phone.get(),
                'website': self.brand_website.get(),
                'instagram': self.brand_instagram.get(),
                'description': self.brand_description.get('1.0', 'end-1c'),
                'notable_products': self.brand_products.get(),
                'where_to_buy': self.brand_where_to_buy.get(),
                'image_url': image_url,
                'featured': self.brand_featured.get(),
                'created_at': timestamp,
                'updated_at': timestamp
            }

            # Validate required fields
            if not data['name'] or not data['category']:
                messagebox.showerror("Error", "Name and category are required fields!")
                return

            # Insert into database
            result = supabase.table('brands').insert(data).execute()
            
            if result.data:
                messagebox.showinfo("Success", "Brand added successfully!")
                self.clear_brand_form()
            else:
                messagebox.showerror("Error", "Failed to add brand")

        except Exception as e:
            messagebox.showerror("Error", f"An error occurred: {str(e)}")

    def clear_place_form(self):
        self.place_name.delete(0, 'end')
        self.place_category.set('')
        self.place_address.delete(0, 'end')
        self.place_city.delete(0, 'end')
        self.place_phone.delete(0, 'end')
        self.place_website.delete(0, 'end')
        self.place_instagram.delete(0, 'end')
        self.place_description.delete('1.0', 'end')
        self.place_image_path.set('')
        self.place_hours.delete(0, 'end')
        self.place_potosino_tag.set(False)
        self.place_local_tag.set(False)
        self.place_other_tags.delete(0, 'end')
        self.place_featured.set(False)

    def clear_event_form(self):
        self.event_title.delete(0, 'end')
        self.event_category.set('')
        self.event_description.delete('1.0', 'end')
        self.event_start_date.delete(0, 'end')
        self.event_end_date.delete(0, 'end')
        self.event_location.delete(0, 'end')
        self.event_image_path.set('')
        self.event_featured.set(False)

    def clear_service_form(self):
        self.service_name.delete(0, 'end')
        self.service_category.set('')
        self.service_description.delete('1.0', 'end')
        self.service_contact_name.delete(0, 'end')
        self.service_phone.delete(0, 'end')
        self.service_email.delete(0, 'end')
        self.service_website.delete(0, 'end')
        self.service_address.delete(0, 'end')
        self.service_area.delete(0, 'end')
        self.service_hours.delete(0, 'end')
        self.service_image_path.set('')
        self.service_featured.set(False)

    def clear_brand_form(self):
        self.brand_name.delete(0, 'end')
        self.brand_category.set('')
        self.brand_year_founded.delete(0, 'end')
        self.brand_address.delete(0, 'end')
        self.brand_city.delete(0, 'end')
        self.brand_phone.delete(0, 'end')
        self.brand_website.delete(0, 'end')
        self.brand_instagram.delete(0, 'end')
        self.brand_description.delete('1.0', 'end')
        self.brand_products.delete(0, 'end')
        self.brand_where_to_buy.delete(0, 'end')
        self.brand_image_path.set('')
        self.brand_featured.set(False)

if __name__ == "__main__":
    root = tk.Tk()
    app = AdminTool(root)
    root.mainloop() 