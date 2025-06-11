// Business data structure and sample data
const businessData = {
    businesses: [
        {
            id: 1,
            name: "Maria's Family Kitchen",
            category: "restaurant",
            description: "Authentic Italian cuisine made with family recipes passed down through generations. Fresh pasta, wood-fired pizza, and homemade desserts.",
            phone: "+2349065202144",
            email: "maria@familykitchen.com",
            address: "123 Main Street, Downtown",
            website: "https://mariasfamilykitchen.com",
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop",
            rating: 4.8,
            reviews: 127
        },
        {
            id: 2,
            name: "TechFix Solutions",
            category: "services",
            description: "Professional computer repair and IT support for homes and small businesses. Same-day service available.",
            phone: "+2349065202144",
            email: "info@techfixsolutions.com",
            address: "456 Oak Avenue, Tech District",
            website: "https://techfixsolutions.com",
            image: "https://images.unsplash.com/photo-1581091226825-c6a89e7e4801?w=400&h=200&fit=crop",
            rating: 4.9,
            reviews: 89
        },
        {
            id: 3,
            name: "Bloom & Blossom Florist",
            category: "retail",
            description: "Fresh flowers for every occasion. Wedding arrangements, funeral tributes, and daily fresh bouquets. Local delivery available.",
            phone: "+2349065202144",
            email: "orders@bloomblossom.com",
            address: "789 Garden Lane, Flower District",
            website: "https://bloomblossom.com",
            image: "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=400&h=200&fit=crop",
            rating: 4.7,
            reviews: 156
        },
        {
            id: 4,
            name: "Sunrise Yoga Studio",
            category: "health",
            description: "Peaceful yoga classes for all levels. Morning meditation, evening relaxation, and specialized workshops. New student specials available.",
            phone: "+2349065202144",
            email: "hello@sunriseyoga.com",
            address: "321 Wellness Way, Health Quarter",
            website: "https://sunriseyoga.com",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
            rating: 4.9,
            reviews: 203
        },
        {
            id: 5,
            name: "AutoCare Plus",
            category: "automotive",
            description: "Full-service automotive repair and maintenance. Oil changes, brake service, engine diagnostics, and more. ASE certified technicians.",
            phone: "+2349065202144",
            email: "service@autocareplus.com",
            address: "654 Motor Street, Auto Row",
            website: "https://autocareplus.com",
            image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=200&fit=crop",
            rating: 4.6,
            reviews: 94
        },
        {
            id: 6,
            name: "Sweet Dreams Bakery",
            category: "restaurant",
            description: "Custom cakes, pastries, and daily fresh bread. Specializing in wedding cakes and special occasion desserts. Gluten-free options available.",
            phone: "+2349065202144",
            email: "orders@sweetdreamsbakery.com",
            address: "987 Baker Street, Artisan Quarter",
            website: "https://sweetdreamsbakery.com",
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=200&fit=crop",
            rating: 4.8,
            reviews: 178
        }
    ]
};

// Application state
let filteredBusinesses = [...businessData.businesses];
let currentFilter = '';

// DOM elements
const businessGrid = document.getElementById('businessGrid');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const searchForm = document.getElementById('searchForm');
const filterTags = document.getElementById('filterTags');
const modal = document.getElementById('addBusinessModal');
const addBusinessForm = document.getElementById('addBusinessForm');
const loading = document.getElementById('loading');
const noResults = document.getElementById('noResults');

// Initialize the application
function initApp() {
    loadBusinessesFromStorage();
    renderBusinesses();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    searchForm.addEventListener('submit', handleSearch);
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    categorySelect.addEventListener('change', handleCategoryChange);
    addBusinessForm.addEventListener('submit', handleAddBusiness);

    // Filter tags event listeners
    filterTags.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-tag')) {
            handleFilterClick(e.target);
        }
    });

    // Modal event listeners
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Load businesses from localStorage
function loadBusinessesFromStorage() {
    const storedBusinesses = localStorage.getItem('localBusinesses');
    if (storedBusinesses) {
        const parsed = JSON.parse(storedBusinesses);
        businessData.businesses = [...businessData.businesses, ...parsed];
        filteredBusinesses = [...businessData.businesses];
    }
}

// Save businesses to localStorage
function saveBusinessesToStorage() {
    const customBusinesses = businessData.businesses.filter(business => business.id > 1000);
    localStorage.setItem('localBusinesses', JSON.stringify(customBusinesses));
}

// Render businesses to the grid
function renderBusinesses() {
    if (filteredBusinesses.length === 0) {
        businessGrid.innerHTML = '';
        showNoResults();
        return;
    }

    hideNoResults();
    businessGrid.innerHTML = filteredBusinesses.map(business => createBusinessCard(business)).join('');
    
    // Add fade-in animation
    const cards = businessGrid.querySelectorAll('.business-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
}

// Create business card HTML
function createBusinessCard(business) {
    const stars = '★'.repeat(Math.floor(business.rating)) + '☆'.repeat(5 - Math.floor(business.rating));
    
    return `
        <div class="business-card">
            <img src="${business.image}" alt="${business.name}" class="business-image" loading="lazy">
            <div class="business-info">
                <h3 class="business-name">${business.name}</h3>
                <p class="business-category">${getCategoryDisplayName(business.category)}</p>
                <p class="business-description">${business.description}</p>
                
                <div class="business-details">
                    <div class="detail-item">
                        <strong>📞</strong> ${business.phone}
                    </div>
                    <div class="detail-item">
                        <strong>📍</strong> ${business.address}
                    </div>
                    <div class="detail-item rating">
                        <span class="stars">${stars}</span>
                        <span>${business.rating} (${business.reviews} reviews)</span>
                    </div>
                </div>
                
                <div class="contact-buttons">
                    <button class="contact-btn primary" onclick="contactBusiness('${business.phone}')">Call Now</button>
                    <button class="contact-btn secondary" onclick="visitWebsite('${business.website}')">Visit Website</button>
                </div>
            </div>
        </div>
    `;
}

// Get display name for category
function getCategoryDisplayName(category) {
    const categoryNames = {
        restaurant: 'Restaurant',
        retail: 'Retail & Shopping',
        services: 'Professional Services',
        health: 'Health & Wellness',
        automotive: 'Automotive',
        home: 'Home & Garden',
        beauty: 'Beauty & Personal Care',
        entertainment: 'Entertainment'
    };
    return categoryNames[category] || category;
}

// Handle search functionality
function handleSearch(e) {
    if (e) e.preventDefault();
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categorySelect.value;
    
    showLoading();
    
    setTimeout(() => {
        filteredBusinesses = businessData.businesses.filter(business => {
            const matchesSearch = !searchTerm || 
                business.name.toLowerCase().includes(searchTerm) ||
                business.description.toLowerCase().includes(searchTerm) ||
                business.category.toLowerCase().includes(searchTerm);
            
            const matchesCategory = !selectedCategory || business.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });
        
        hideLoading();
        renderBusinesses();
    }, 500);
}

// Handle category change
function handleCategoryChange() {
    handleSearch();
}

// Handle filter tag clicks
function handleFilterClick(tag) {
    // Remove active class from all tags
    document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
    
    // Add active class to clicked tag
    tag.classList.add('active');
    
    // Get category and update filter
    const category = tag.dataset.category;
    currentFilter = category;
    categorySelect.value = category;
    
    handleSearch();
}

// Handle adding new business
function handleAddBusiness(e) {
    e.preventDefault();
    
    const formData = new FormData(addBusinessForm);
    const newBusiness = {
        id: Date.now(), // Simple ID generation
        name: formData.get('businessName'),
        category: formData.get('businessCategory'),
        description: formData.get('businessDescription'),
        phone: formData.get('businessPhone'),
        email: formData.get('businessEmail') || '',
        address: formData.get('businessAddress'),
        website: formData.get('businessWebsite') || '#',
        image: formData.get('businessImage') || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop',
        rating: 5.0,
        reviews: 1
    };
    
    // Add to businesses array
    businessData.businesses.push(newBusiness);
    filteredBusinesses = [...businessData.businesses];
    
    // Save to localStorage
    saveBusinessesToStorage();
    
    // Reset form and close modal
    addBusinessForm.reset();
    closeModal();
    
    // Re-render businesses
    renderBusinesses();
    
    // Show success message (simple alert for now)
    alert('Business added successfully!');
}

// Modal functions
function openModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Contact business function
function contactBusiness(phone) {
    window.location.href = `tel:${phone}`;
}

// Visit website function
function visitWebsite(website) {
    if (website && website !== '#') {
        window.open(website, '_blank');
    } else {
        alert('Website not available for this business.');
    }
}

// Show/hide loading state
function showLoading() {
    loading.classList.remove('hidden');
    businessGrid.classList.add('hidden');
    noResults.classList.add('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
    businessGrid.classList.remove('hidden');
}

// Show/hide no results state
function showNoResults() {
    noResults.classList.remove('hidden');
    businessGrid.classList.add('hidden');
}

function hideNoResults() {
    noResults.classList.add('hidden');
    businessGrid.classList.remove('hidden');
}

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Add some sample interaction for demonstration
console.log('Local Business Showcase loaded successfully!');
console.log(`Currently displaying ${businessData.businesses.length} businesses`);

// Example of conditional branching for business categories
function getBusinessIcon(category) {
    if (category === 'restaurant') {
        return '🍽️';
    } else if (category === 'services') {
        return '🔧';
    } else if (category === 'retail') {
        return '🛍️';
    } else if (category === 'health') {
        return '🏥';
    } else if (category === 'automotive') {
        return '🚗';
    } else {
        return '🏢';
    }
}

// Array methods demonstration
function getTopRatedBusinesses() {
    return businessData.businesses
        .filter(business => business.rating >= 4.5)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
}

// Template literals usage throughout the code
function generateBusinessSummary(business) {
    return `${business.name} is a ${getCategoryDisplayName(business.category).toLowerCase()} located at ${business.address}. 
            They have a ${business.rating}-star rating based on ${business.reviews} reviews.`;
}

// Object example - business analytics
const businessAnalytics = {
    totalBusinesses: businessData.businesses.length,
    categoryCounts: {},
    averageRating: 0,
    
    calculateStats() {
        this.totalBusinesses = businessData.businesses.length;
        
        // Count businesses by category
        this.categoryCounts = businessData.businesses.reduce((acc, business) => {
            acc[business.category] = (acc[business.category] || 0) + 1;
            return acc;
        }, {});
        
        // Calculate average rating
        const totalRating = businessData.businesses.reduce((sum, business) => sum + business.rating, 0);
        this.averageRating = (totalRating / this.totalBusinesses).toFixed(1);
        
        return this;
    },
    
    getMostPopularCategory() {
        const maxCount = Math.max(...Object.values(this.categoryCounts));
        return Object.keys(this.categoryCounts).find(key => this.categoryCounts[key] === maxCount);
    }
};

// DOM manipulation example - highlight featured businesses
function highlightFeaturedBusinesses() {
    const featuredBusinesses = getTopRatedBusinesses();
    const businessCards = document.querySelectorAll('.business-card');
    
    businessCards.forEach(card => {
        const businessName = card.querySelector('.business-name').textContent;
        const isFeatured = featuredBusinesses.some(business => business.name === businessName);
        
        if (isFeatured) {
            card.style.border = '2px solid var(--primary-red)';
            card.style.boxShadow = '0 5px 20px rgba(231, 76, 60, 0.2)';
        }
    });
}

// Event listener for dynamic content
businessGrid.addEventListener('click', function(e) {
    if (e.target.classList.contains('contact-btn')) {
        const businessCard = e.target.closest('.business-card');
        const businessName = businessCard.querySelector('.business-name').textContent;
        console.log(`User interacted with ${businessName}`);
        
        // Track interaction in analytics object
        if (!businessAnalytics.interactions) {
            businessAnalytics.interactions = [];
        }
        businessAnalytics.interactions.push({
            business: businessName,
            action: e.target.textContent,
            timestamp: new Date().toISOString()
        });
    }
});

// Additional functionality - keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
    
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
});