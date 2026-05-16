# SURVE / Site Solver Platform

SURVE is a web-based generative design and urban planning platform. It allows users to rapidly prototype site layouts, calculate feasibility metrics, and generate formal land survey diagrams.

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **bun**

### 2. Installation
```bash
# Install dependencies
npm install
```

### 3. Setup Environment
Create a `.env.local` file in the root directory and add your Google Auth credentials:
```env
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000
```

### 4. Launch Studio
```bash
# Start the development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to begin planning.

---

## 🛠 Design Workflow

1. **Locate Site**: Search for your property and lock the site context.
2. **Define Boundary**: Use the **Boundary Tool** to draw the property extent.
3. **Infrastructure**:
   - Draw **Roads** (Highway, Local, etc.) with auto-placed assets.
   - Define **Parking Areas**.
   - Adjust **Setback Offsets**.
4. **Subdivide**: Click **Auto-Subdivide Site** to generate parcels that respect your infrastructure.
5. **Analyze & Export**:
   - View **Insights** for yield and efficiency reports.
   - Generate **Survey Records** (South African SG Diagram standards).
   - Use **Export Mode** for print-ready studio documents.

## 📦 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Spatial Analysis**: @turf/turf
- **Styling**: Tailwind CSS
- **Auth**: NextAuth.js (Google)
- **Icons**: Lucide React
