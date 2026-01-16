# Veggie Swap - Neighborhood Produce Exchange

A Progressive Web App for neighbors to share and swap homegrown vegetables, fruits, and produce.

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Development
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### 3. Build for Production
```bash
npm run build
```

This creates a `dist/` folder with your production-ready app.

### 4. Deploy to Netlify

#### Option A: Drag & Drop
1. Run `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the entire `dist/` folder
4. Done!

#### Option B: Connect Git Repository
1. Push your code to GitHub
2. Go to https://app.netlify.com
3. Click "New site from Git"
4. Select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

### 5. Custom Domain (Optional)
1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Follow the instructions to update your DNS settings

## 📱 PWA Icons

You need to create two icon files and place them in `public/icons/`:

- `icon-192x192.png` (192×192 pixels)
- `icon-512x512.png` (512×512 pixels)

**How to create icons:**
1. Design your icon (green/vegetable theme recommended)
2. Use an online tool like [RealFaviconGenerator](https://realfavicongenerator.net/)
3. Or use any image editor to resize your logo to 192×192 and 512×512
4. Save as PNG files in `public/icons/`

**Quick placeholder:** You can temporarily use any 192×192 and 512×512 PNG images for testing.

## 🌟 Features

- ✅ Admin approval system (first user becomes admin)
- ✅ Photo uploads for listings and profiles
- ✅ Swap or free giveaway options
- ✅ Expiry dates with auto-cleanup
- ✅ Profile system with what you grow/want
- ✅ Search and filter functionality
- ✅ Installable as PWA on mobile devices
- ✅ Works offline (after first visit)
- ✅ Responsive design

## 📝 First-Time Setup

1. Create your profile first (you'll automatically become admin)
2. Add a test listing
3. Approve it from the Admin panel
4. Share the URL with neighbors!

## 🔧 Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- PWA (Service Worker)
- LocalStorage (for shared data)
```

---

## **21. public/icons/README.txt**
```
ICONS REQUIRED:

Place two PNG icon files in this folder:

1. icon-192x192.png (192 x 192 pixels)
2. icon-512x512.png (512 x 512 pixels)

Recommended design:
- Green color scheme (matches app theme)
- Vegetable/plant icon or logo
- Simple, recognizable design

You can use tools like:
- Canva (free templates)
- Figma
- RealFaviconGenerator.net
- Any image editor (resize your logo)

For testing, you can use any PNG images at these sizes.
```

---

## **22. _redirects** (Create this file in `public/` folder)
```
/*    /index.html   200
