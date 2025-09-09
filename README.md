# Fun@MUJ 🎉
A student guide to **fun things to do at Manipal University Jaipur (MUJ)**.  
This website/app helps students explore the best **eating spots, study spaces, hangout places, and events** on campus, plus share thoughts anonymously.  
The motto: *"Find, Explore, Enjoy MUJ!"*

---

## 📌 Features

### ✅ Features
- 🍔 **Comprehensive eating spots directory** (canteens, cafes, food trucks)
  - Location with maps, price range, cuisine type
  - Operating hours and popular menu items
  - Student budget-friendly options highlighted
- 📚 **Study spots locator** (libraries, quiet zones, group study areas)
  - Noise level indicators, WiFi availability
  - Power outlet availability and seating capacity
  - Current occupancy status (if possible)
- 💬 **Anonymous confessions board** 
  - Safe space for students to share thoughts
  - Moderated content with report system
  - Categories: Academic, Social, Campus Life, Random
- 🗺️ Interactive campus map with navigation to each spot
- 🔐 Student login/signup (basic authentication with college email verification)
- 📱 Simple, mobile-friendly responsive UI
- 🎭 **Enhanced categories**: Food, Study Spaces, Hangout spots, Clubs, Fun events, Confessions
- ⭐ **Ratings & Reviews** by verified students
  - For eating spots: taste, value for money, service
  - For study spots: quietness, comfort, WiFi quality
- 📍 **"Nearby spots" recommendations** based on current location within campus
- 🌙 **Dark/Light mode toggle** for better user experience
- 🔍 **Advanced search & filters**
  - Filter by: price range, cuisine, study spot type, noise level
  - Search by: location, name, features
- 📊 **Popular spots dashboard** (trending places, most reviewed)
- 📅 **Event calendar** (college fests, competitions, study group meetups)
- 🔔 **Push notifications**
  - New highly-rated spots, popular confessions, events
  - Study spot availability alerts
- 📸 **Photo sharing** for spots (with moderation)
- 💭 **Confession reactions** (anonymous likes/hearts)
- 🕒 **Real-time updates** on canteen queues, study spot availability

---

## 🎯 Core Sections

### 🍽️ Eating Spots
- **Main Canteen** - Budget meals, variety
- **Food Court** - Multiple cuisines, casual dining  
- **Cafés** - Coffee, snacks, study-friendly
- **Food Trucks/Stalls** - Quick bites, local flavors
- **Late-night options** - After-hours food availability

### 📖 Study Spots  
- **Central Library** - Silent study, research resources
- **Department Libraries** - Subject-specific materials
- **Study Halls** - Group discussions allowed
- **Outdoor Spots** - Garden areas, benches
- **24/7 Study Areas** - Round-the-clock access
- **AC Study Rooms** - Climate-controlled comfort

### 💭 Anonymous Confessions
- **Academic Stress** - Study pressure, exam fears
- **Social Life** - Friendship, relationships, loneliness  
- **Campus Experience** - Dorm life, homesickness
- **Random Thoughts** - Daily observations, humor
- **Appreciation Posts** - Gratitude, positive vibes

---

## 🛠️ Tech Stack
- **Frontend:** React.js with TypeScript (web) + PWA capabilities
- **Backend:** Node.js + Express.js with JWT authentication
- **Database:** MongoDB with separate collections for:
  - Users, Spots (eating/study), Reviews, Confessions, Events
- **Real-time:** Socket.io for live updates
- **UI Framework:** Tailwind CSS + Shadcn/ui components
- **Maps:** Mapbox/Google Maps API for campus navigation
- **Moderation:** Content filtering API for confessions
- **File Storage:** Cloudinary for images
- **Deployment:** Vercel (frontend) + Railway/Render (backend)
- **Version Control:** Git + GitHub

---

## 📱 App Structure
```
Fun@MUJ/
├── 🏠 Home (Quick access to popular spots)
├── 🍔 Eat (All food options with filters)
├── 📚 Study (Study spots with live availability)  
├── 💭 Confess (Anonymous confession board)
├── 🗺️ Map (Interactive campus map)
├── ⭐ Reviews (Your reviews and ratings)
└── 👤 Profile (Settings, achievements, logout)
```

---

## 🚀 How to Run the Project

### 1. Clone the repository
```bash
git clone https://github.com/your-username/FunAtMUJ.git
cd FunAtMUJ
```

### 2. Install dependencies
```bash
# Frontend
cd client
npm install

# Backend  
cd ../server
npm install
```

### 3. Environment Setup
```bash
# Create .env files
cp .env.example .env

# Add your config:
# - MongoDB connection string
# - JWT secret key
# - Map API keys
# - College email domain for verification
```

### 4. Start development servers
```bash
# Backend (Port 5000)
cd server
npm run dev

# Frontend (Port 3000)
cd client  
npm start
```

### 5. Seed initial data
```bash
cd server
npm run seed # Adds sample eating spots, study areas
```

---

## 🎨 Design Priorities
- **Mobile-first approach** (students primarily use phones)
- **Fast loading** (campus WiFi can be slow)
- **Intuitive navigation** (easy to find spots quickly)
- **Anonymous safety** (secure confession system)
- **Accessibility** (readable fonts, good contrast)

---

## 🤝 Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)  
5. Open Pull Request

**Special focus areas:**
- Adding new campus spots with accurate details
- Improving confession moderation system
- Enhancing study spot real-time availability
- Campus map accuracy and navigation

---

## 📄 License
MIT License - Feel free to fork and customize for your campus!

