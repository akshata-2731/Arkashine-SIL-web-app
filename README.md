# 🌾 Arkashine School Innovation Lab (SIL) - Quick Guide & Hosting

A clean, modern, responsive web application for the **Arkashine School Innovation Lab – Summer Vacation Innovation Program (72 Hours)**.

---

## ⚡ Super Easy Setup (Run Locally in 2 Minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start the local app
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## 🚀 How to Host on Render (Free & Fast)

You can host this React application on **Render.com** in 3 simple steps:

### Option A: Static Site on Render (Recommended - 100% Free)
1. Push your code to your **GitHub** repository:
   ```bash
   git add .
   git commit -m "Arkashine dashboard initial release"
   git push origin main
   ```
2. Log in to [dashboard.render.com](https://dashboard.render.com/) and click **New +** → **Static Site**.
3. Connect your GitHub repository.
4. Fill in these settings:
   - **Name**: `arkashine-sil-dashboard` (or any name you like)
   - **Branch**: `main` or `master`
   - **Root Directory**: (leave empty)
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
5. Click **Create Static Site**. Render will build and give you a live URL like `https://arkashine-sil-dashboard.onrender.com`!

### Option B: Rewrite Rule for Single Page App (SPA)
In your Render dashboard:
- Go to your static site → **Redirects/Rewrites**.
- Add rule:
  - **Source**: `/*`
  - **Destination**: `/index.html`
  - **Action**: `Rewrite`

---

## 📚 4 Curriculum Modules (Theory vs Practical)

As requested, the curriculum is organized so students master both theory and hands-on laboratory practice:

| Module | Nature | Title | Hours | Assessment |
| :--- | :--- | :--- | :--- | :--- |
| **Module 1** | **Theory** 📖 | **Introduction to Agriculture & Soil Science** | 18 Hours | Comprehensive Quiz |
| **Module 2** | **Practical** 🧪 | **Soil Sample Collection & Preparation** | 18 Hours | Quiz + Field Auger Assignment |
| **Module 3** | **Practical** ⚡ | **Soil Testing using SoiLENZ Device** | 18 Hours | Quiz + Hands-on Rapid Scan Challenge |
| **Module 4** | **Practical** 🌾 | **Soil Health Reports & Farmer Advisory** | 18 Hours | Quiz + Village Farmer Advisory Capstone |

**Total Program**: **72 Hours** across 4 weeks (18 hours/week).

---

## 📝 Faculty Daily Attendance & Storing

Faculty coordinators can complete their daily update in **under 3 minutes** from any phone or laptop:

1. Click the **Role Switcher** in the top bar → Select **Faculty Coordinator**.
2. Click **Today's Update**:
   - **Select Module & Session Type**: Pick Module 1 (Theory) or Modules 2, 3, 4 (Practical / Field).
   - **Set Hours Taught**: Stepper button (default 2.5 hours).
   - **1-Tap Attendance**: Tap any student name to toggle **Present** 🟢 → **Late** 🟡 → **Absent** 🔴 (or click **All Present**).
   - **Samples & Farmers**: Enter number of SoiLENZ scans and farmers advised.
   - **Draft Auto-Saved**: Changes auto-save locally so data is never lost if internet disconnects.
3. Click **"Submit Daily Log & Publish to Heat Map"**:
   - The attendance and testing figures are permanently stored in local database storage.
   - The Principal, Partner, and Arkashine HQ heat maps update instantly in real time!

---

## 🎨 Changing Dashboard Colors Live (For Demos)

You can change all colors in 1 click during client or partner presentations:
1. Look at the **top right corner** next to the role switcher.
2. Click **Theme Colors** 🎨.
3. Choose any curated preset:
   - 🌲 **Forest Emerald** (Nature / Agritech)
   - 🌊 **Deep Navy & Sky** (Corporate Ed-Tech)
   - 🌾 **Warm Earth & Amber** (Soil & Agriculture)
   - 💎 **Modern Ocean Teal** (Sustainability)
   - 🔮 **Royal Purple & Violet** (Science & Innovation)
   - 🖤 **Minimal Slate & Charcoal** (Clean Monochrome)
4. Or click **"Fine Tune"** to pick any custom color code with the live color picker!

---

## 👥 Demo Logins

Use the top dropdown pill to view the app as:
- **Arkashine HQ** (Super Admin overview, 6 schools, heat maps, certificates, ESG impact)
- **Enabling Partner** (Selection funnel, lab readiness, support tickets)
- **School Principal** (School scorecard, daily log review, at-risk students)
- **Faculty Coordinator** (Daily update, 1-tap attendance, SoiLENZ testing log)
- **Student Portal** (8-step Soil Journey, badges, and Soil Partner Certificate preview)
