# 🎬 Rajhans Cinemas - Movie Ticket Generator & Shareable Link App

A modern, responsive, and configurable web application to generate authentic **Rajhans Multiplex** movie tickets with automatic price calculation (`Total = Ticket Count × Ticket Price`), dynamic QR codes, shareable ticket links, and print/PDF support.

---

## 🚀 Features

- 🎟️ **Fully Configurable Inputs**:
  - Movie Name
  - Show Date & Time
  - Number of Tickets
  - Ticket Price (Rate per ticket)
  - Auto-calculated Total Amount (`Total = Count × Price`)
  - Seat Numbers & Customer Name
  - Cinema Hall / Screen Selector
- 🍿 **Rajhans Cinemas Branding**:
  - Signature dark velvet, crimson, and gold multiplex design.
  - Perforated tear line, barcode, and dynamic QR Code generation.
- 🔗 **Instant Shareable Ticket Links**:
  - Encodes configuration parameters into a live URL query string (`/ticket?movie=Stree+2&tickets=2&price=250...`).
- 🖨️ **Print & Save as PDF**:
  - `@media print` optimized layout to print clean paper tickets or save as PDF.
- ☁️ **Render Ready**:
  - Pre-configured Node.js Express server ready for Render deployment.

---

## 🛠️ Local Running Instructions

1. Open your terminal in the `tikit` project folder:
   ```bash
   cd c:/Users/ASUS/OneDrive/Desktop/tikit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

## 🌐 Step-by-Step Instructions to Deploy on Render.com

Follow these 4 simple steps to host your application live on Render for free and create shareable ticket links:

### Step 1: Initialize Git and Push to GitHub
Open your terminal in the `tikit` project directory and run:

```bash
git init
git add .
git commit -m "Initial commit for Rajhans Ticket Generator"
```

Next, create a new repository on [GitHub](https://github.com/new) named `rajhans-tikit-generator` and push your code:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/rajhans-tikit-generator.git
git push -u origin main
```

---

### Step 2: Create a Free Account on Render
1. Go to [https://render.com](https://render.com) and click **Sign Up**.
2. Log in using your **GitHub account**.

---

### Step 3: Create a New Web Service on Render
1. On your Render dashboard, click the **New +** button at the top right and select **Web Service**.
2. Select **Build and deploy from a Git repository**.
3. Connect your GitHub account and select your repository: `rajhans-tikit-generator`.
4. Configure the settings:
   - **Name**: `rajhans-ticket-generator` (or your preferred name)
   - **Region**: Choose the closest region to you (e.g., Singapore or Frankfurt)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Click **Create Web Service**.

---

### Step 4: Access Your Live Link!
Render will automatically build and deploy your project in under 1 minute. Once deployed, Render will generate a live URL at the top of your dashboard, such as:

```text
https://rajhans-ticket-generator.onrender.com
```

Now you can generate tickets, click **"Generate Shareable Link"**, copy the URL, and share it with anyone! 🎬🍿
