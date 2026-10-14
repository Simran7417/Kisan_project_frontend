
import { useEffect, useState } from 'react'
import {
  Sprout,
  LayoutDashboard,
  ChartColumn,
  MapPin,
  Users,
  LogOut,
  Menu,
  X,
  Search,
  ShoppingCart,
  Package,
  Send,
} from 'lucide-react'
import './App.css'

const demoCrops = [
  { id: 1, name: 'Wheat', mandi: 'Meerut', price: 2450 },
  { id: 2, name: 'Rice', mandi: 'Ghaziabad', price: 3100 },
  { id: 3, name: 'Mustard', mandi: 'Hapur', price: 5680 },
]

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [activePage, setActivePage] = useState('Dashboard')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [search, setSearch] = useState('')
  const [crops, setCrops] = useState(demoCrops)

  const [listings, setListings] = useState([
    {
      id: 1,
      crop: 'Wheat',
      quantity: 50,
      price: 2450,
      location: 'Meerut',
      seller: 'Demo Farmer',
    },
    {
      id: 2,
      crop: 'Rice',
      quantity: 30,
      price: 3100,
      location: 'Ghaziabad',
      seller: 'Demo Farmer',
    },
  ])

  const [cropForm, setCropForm] = useState({
    crop: 'Wheat',
    quantity: '',
    price: '',
    location: 'Meerut',
  })

  const [inquiries, setInquiries] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/api/crops')
      .then((response) => {
        if (!response.ok) throw new Error('API unavailable')
        return response.json()
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCrops(data)
        }
      })
      .catch(() => {
        setCrops(demoCrops)
      })
  }, [])

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Market Prices', icon: ChartColumn },
    { name: 'Nearby Mandis', icon: MapPin },
    { name: 'Marketplace', icon: Users },
  ]

  function handleLogin(event) {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      alert('Please enter email and password.')
      return
    }

    setLoggedIn(true)
  }

  function handleLogout() {
    setLoggedIn(false)
    setPassword('')
    setActivePage('Dashboard')
  }

  function handleAddCrop(event) {
    event.preventDefault()

    const newListing = {
      id: Date.now(),
      crop: cropForm.crop,
      quantity: Number(cropForm.quantity),
      price: Number(cropForm.price),
      location: cropForm.location.trim(),
      seller: email.split('@')[0] || 'Farmer',
    }

    setListings((previous) => [newListing, ...previous])

    setCropForm({
      crop: 'Wheat',
      quantity: '',
      price: '',
      location: 'Meerut',
    })

    setMessage('Your crop listing has been published successfully!')
  }

  function handleInquiry(listing) {
    setInquiries((previous) => [
      ...previous,
      {
        id: Date.now(),
        crop: listing.crop,
        seller: listing.seller,
      },
    ])

    setMessage(
      `Your inquiry for ${listing.crop} has been recorded successfully!`
    )
  }

  const filteredCrops = crops.filter((crop) =>
    `${crop.name} ${crop.mandi}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  if (!loggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="brand-logo">
            <Sprout size={32} />
          </div>

          <h1>AgriLink</h1>
          <p className="login-subtitle">
            Smart Farmer Market Intelligence
          </p>

          <h2>Welcome Back!</h2>
          <p className="login-description">
            Login to explore better farming opportunities.
          </p>

          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <button type="submit" className="primary-button">
              Login to AgriLink
            </button>
          </form>

          <p className="login-note">
            Demo login: enter any valid email and password.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-layout">
      {mobileMenu && (
        <button
          className="mobile-overlay"
          onClick={() => setMobileMenu(false)}
          aria-label="Close menu"
        />
      )}

      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo small-logo">
            <Sprout size={25} />
          </div>
          <div>
            <h2>AgriLink</h2>
            <span>SMART AGRICULTURE</span>
          </div>

          <button
            className="close-menu"
            onClick={() => setMobileMenu(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <p className="menu-label">MAIN MENU</p>

        <nav className="sidebar-navigation">
          {navigation.map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  activePage === item.name ? 'active' : ''
                }`}
                onClick={() => {
                  setActivePage(item.name)
                  setMobileMenu(false)
                  setMessage('')
                }}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="farmer-profile">
            <div className="profile-avatar">F</div>
            <div className="profile-details">
              <strong>{email.split('@')[0]}</strong>
              <span>AgriLink Member</span>
            </div>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() => setMobileMenu(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div>
            <span className="topbar-small">WELCOME TO AGRILINK</span>
            <h2>Welcome, {email.split('@')[0]}!</h2>
          </div>

          <div className="topbar-status">
            <span className="status-dot" />
            Market Updates
          </div>
        </header>

        <div className="page-content">
          {message && (
            <div className="success-message">
              <span>{message}</span>
              <button
                onClick={() => setMessage('')}
                aria-label="Dismiss message"
              >
                ×
              </button>
            </div>
          )}

          {activePage === 'Dashboard' && (
            <section>
              <div className="welcome-banner">
                <div>
                  <span className="section-kicker">
                    YOUR FARM, YOUR FUTURE
                  </span>
                  <h1>Grow Better. Earn Better.</h1>
                  <p>
                    Find market prices, nearby mandis and potential buyers
                    for your crops.
                  </p>
                  <button
                    className="banner-button"
                    onClick={() => setActivePage('Marketplace')}
                  >
                    Explore Marketplace →
                  </button>
                </div>
                <div className="banner-icon">
                  <Sprout size={90} strokeWidth={1.3} />
                </div>
              </div>

              <div className="section-heading">
                <div>
                  <h2>Market Overview</h2>
                  <p>Your agriculture market at a glance.</p>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <Package size={23} />
                  </div>
                  <p>Available Crops</p>
                  <h3>{crops.length}</h3>
                  <span>Market price records</span>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <Users size={23} />
                  </div>
                  <p>Nearby Buyers</p>
                  <h3>12</h3>
                  <span>Sample marketplace data</span>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <MapPin size={23} />
                  </div>
                  <p>Market Locations</p>
                  <h3>3</h3>
                  <span>Meerut, Ghaziabad, Hapur</span>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <ShoppingCart size={23} />
                  </div>
                  <p>Crop Listings</p>
                  <h3>{listings.length}</h3>
                  <span>Available in this session</span>
                </div>
              </div>

              <div className="section-heading market-heading">
                <div>
                  <h2>Latest Market Prices</h2>
                  <p>Check the sample prices before exploring the market.</p>
                </div>
                <button
                  className="text-button"
                  onClick={() => setActivePage('Market Prices')}
                >
                  View All →
                </button>
              </div>

              <div className="crop-grid">
                {crops.slice(0, 3).map((crop) => (
                  <div className="crop-card" key={crop.id}>
                    <div className="crop-card-top">
                      <span className="crop-emoji">🌾</span>
                      <span className="sample-badge">Sample</span>
                    </div>
                    <h3>{crop.name}</h3>
                    <p>
                      <MapPin size={14} />
                      {crop.mandi}
                    </p>
                    <div className="crop-price">
                      ₹{Number(crop.price).toLocaleString('en-IN')}
                      <small> / quintal</small>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activePage === 'Market Prices' && (
            <section className="content-section">
              <div className="section-heading">
                <div>
                  <span className="section-kicker">MARKET INTELLIGENCE</span>
                  <h2>Market Prices</h2>
                  <p>Search crops and compare sample mandi prices.</p>
                </div>
              </div>

              <div className="search-box">
                <Search size={19} />
                <input
                  type="text"
                  placeholder="Search crop or mandi..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              <div className="price-table">
                <div className="table-header">
                  <span>Crop Name</span>
                  <span>Mandi Location</span>
                  <span>Price / Quintal</span>
                </div>

                {filteredCrops.map((crop) => (
                  <div className="table-row" key={crop.id}>
                    <strong>🌾 {crop.name}</strong>
                    <span>{crop.mandi}</span>
                    <strong className="table-price">
                      ₹{Number(crop.price).toLocaleString('en-IN')}
                    </strong>
                  </div>
                ))}

                {filteredCrops.length === 0 && (
                  <p className="empty-message">No crops found.</p>
                )}
              </div>

              <p className="data-disclaimer">
                These are demo prices for project presentation, not verified
                live mandi rates.
              </p>
            </section>
          )}

          {activePage === 'Nearby Mandis' && (
            <section className="content-section">
              <div className="section-heading">
                <div>
                  <span className="section-kicker">LOCAL MARKETS</span>
                  <h2>Nearby Mandis</h2>
                  <p>Explore sample market locations and crop prices.</p>
                </div>
              </div>

              <div className="mandi-grid">
                {[
                  {
                    name: 'Meerut Mandi',
                    crop: 'Wheat',
                    price: 2450,
                  },
                  {
                    name: 'Ghaziabad Mandi',
                    crop: 'Rice',
                    price: 3100,
                  },
                  {
                    name: 'Hapur Mandi',
                    crop: 'Mustard',
                    price: 5680,
                  },
                ].map((mandi) => (
                  <div className="mandi-card" key={mandi.name}>
                    <div className="mandi-icon">
                      <MapPin size={25} />
                    </div>
                    <h3>{mandi.name}</h3>
                    <p>Available crop: {mandi.crop}</p>
                    <div className="crop-price">
                      ₹{mandi.price.toLocaleString('en-IN')}
                      <small> / quintal</small>
                    </div>
                    <span className="sample-badge">Demo Price</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activePage === 'Marketplace' && (
            <section className="content-section">
              <div className="section-heading">
                <div>
                  <span className="section-kicker">BUYER & SELLER NETWORK</span>
                  <h2>AgriLink Marketplace</h2>
                  <p>Farmers can list crops and buyers can send inquiries.</p>
                </div>
              </div>

              <div className="marketplace-columns">
                <div className="seller-panel">
                  <div className="marketplace-title">
                    <span className="marketplace-emoji">🌱</span>
                    <div>
                      <h3>Sell Your Crop</h3>
                      <p>Publish your crop details.</p>
                    </div>
                  </div>

                  <form onSubmit={handleAddCrop} className="seller-form">
                    <label htmlFor="cropName">Crop Name</label>
                    <select
                      id="cropName"
                      value={cropForm.crop}
                      onChange={(event) =>
                        setCropForm({
                          ...cropForm,
                          crop: event.target.value,
                        })
                      }
                    >
                      <option>Wheat</option>
                      <option>Rice</option>
                      <option>Mustard</option>
                      <option>Sugarcane</option>
                      <option>Potato</option>
                      <option>Tomato</option>
                    </select>

                    <label htmlFor="quantity">Quantity (quintals)</label>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      required
                      placeholder="Enter quantity"
                      value={cropForm.quantity}
                      onChange={(event) =>
                        setCropForm({
                          ...cropForm,
                          quantity: event.target.value,
                        })
                      }
                    />

                    <label htmlFor="price">Expected Price per Quintal (₹)</label>
                    <input
                      id="price"
                      type="number"
                      min="1"
                      required
                      placeholder="Enter expected price"
                      value={cropForm.price}
                      onChange={(event) =>
                        setCropForm({
                          ...cropForm,
                          price: event.target.value,
                        })
                      }
                    />

                    <label htmlFor="location">Location</label>
                    <input
                      id="location"
                      type="text"
                      required
                      placeholder="Enter mandi location"
                      value={cropForm.location}
                      onChange={(event) =>
                        setCropForm({
                          ...cropForm,
                          location: event.target.value,
                        })
                      }
                    />

                    <button className="primary-button" type="submit">
                      <Package size={17} />
                      Publish Crop Listing
                    </button>
                  </form>
                </div>

                <div className="buyer-panel">
                  <div className="marketplace-title">
                    <span className="marketplace-emoji">🛒</span>
                    <div>
                      <h3>Explore Available Crops</h3>
                      <p>Browse listings and contact sellers through demo inquiries.</p>
                    </div>
                  </div>

                  <div className="buyer-listings">
                    {listings.map((listing) => (
                      <article className="buyer-listing" key={listing.id}>
                        <div className="listing-top">
                          <span className="crop-emoji">🌾</span>
                          <span className="sample-badge">Available</span>
                        </div>

                        <h3>{listing.crop}</h3>
                        <p>Seller: {listing.seller}</p>
                        <p>Location: {listing.location}</p>
                        <p>Quantity: {listing.quantity} quintals</p>

                        <div className="crop-price">
                          ₹{Number(listing.price).toLocaleString('en-IN')}
                          <small> / quintal</small>
                        </div>

                        <button
                          className="inquiry-button"
                          onClick={() => handleInquiry(listing)}
                        >
                          <Send size={15} />
                          Send Buyer Inquiry
                        </button>
                      </article>
                    ))}
                  </div>

                  <p className="inquiry-count">
                    Inquiries recorded in this session: {inquiries.length}
                  </p>
                </div>
              </div>

              <p className="data-disclaimer">
                Demo only: listings and inquiries are stored temporarily.
                No real message is sent to a seller.
              </p>
            </section>
          )}

          <footer className="main-footer">
            <p>© 2026 AgriLink. Smart Farmer Market Intelligence.</p>
            <span>Growing together 🌱</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
