# SLP Way Admin Tool

A Next.js web application for managing the SLP Way directory content, including places, events, services, and brands.

## Features

- Secure authentication with Supabase
- Protected admin routes
- Dashboard with statistics
- CRUD operations for:
  - Places
  - Events
  - Services
  - Brands
- Modern UI with Tailwind CSS
- Responsive design

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account and project

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd slp-way-admin
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is configured for deployment on Netlify. To deploy:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Connect your repository to Netlify
3. Add your environment variables in Netlify's dashboard
4. Deploy!

## Database Schema

The application uses the following Supabase tables:

### Places
- id (uuid)
- name (text)
- category (text)
- address (text)
- city (text)
- phone (text)
- website (text)
- instagram (text)
- description (text)
- image_url (text)
- hours (text)
- featured (boolean)
- tags (text[])

### Events
- id (uuid)
- title (text)
- category (text)
- description (text)
- start_date (timestamp with timezone)
- end_date (timestamp with timezone)
- location (text)
- image_url (text)
- featured (boolean)

### Services
- id (uuid)
- name (text)
- category (text)
- description (text)
- contact_name (text)
- phone (text)
- email (text)
- website (text)
- address (text)
- service_area (text)
- hours (text)
- image_url (text)
- featured (boolean)

### Brands
- id (uuid)
- name (text)
- category (text)
- year_founded (text)
- address (text)
- city (text)
- phone (text)
- website (text)
- instagram (text)
- description (text)
- notable_products (text)
- where_to_buy (text)
- image_url (text)
- featured (boolean)
- created_at (timestamp with timezone)
- updated_at (timestamp with timezone)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 