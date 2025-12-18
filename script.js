/* Mock Data */
const events = [
    {
        id: 1,
        title: "Inter-College Hackathon 2024",
        date: "2024-03-15",
        organizer: "Tech Club, IIT",
        category: "Tech",
        image: "assets/event-placeholder.png",
        description: "Join us for 24 hours of coding, innovation, and fun. Build solutions for real-world problems and win exciting prizes. Food and drinks provided!",
        venue: "Main Auditorium, Block A",
        time: "10:00 AM - 10:00 AM (Next Day)",
        googleFormLink: "https://forms.google.com/example-hackathon",
        registrationStatus: "Open"
    },
    {
        id: 2,
        title: "Cultural Fest 'Aarambh'",
        date: "2024-04-02",
        organizer: "Student Council",
        category: "Cultural",
        image: "assets/event-placeholder.png",
        description: "The biggest cultural extravangza of the year. Music, Dance, Drama, and Fashion Show. Don't miss the star night performance!",
        venue: "College Ground",
        time: "5:00 PM Onwards",
        googleFormLink: "https://forms.google.com/example-fest",
        registrationStatus: "Coming Soon"
    },
    {
        id: 3,
        title: "AI & ML Workshop",
        date: "2024-03-20",
        organizer: "CS Department",
        category: "Workshop",
        image: "assets/event-placeholder.png",
        description: "A hands-on workshop on Artificial Intelligence and Machine Learning. Learn to build your first neural network.",
        venue: "Lab 3, CS Block",
        time: "2:00 PM - 5:00 PM",
        googleFormLink: "https://forms.google.com/example-ai",
        registrationStatus: "Open"
    },
    {
        id: 4,
        title: "Robotics Expo",
        date: "2024-03-25",
        organizer: "Robotics Society",
        category: "Tech",
        image: "assets/event-placeholder.png",
        description: "Showcase of the latest robotics projects by students. Drone racing, bot wars, and more.",
        venue: "Indoor Stadium",
        time: "10:00 AM - 4:00 PM",
        googleFormLink: "https://forms.google.com/example-robotics",
        registrationStatus: "Open"
    },
    {
        id: 5,
        title: "Music Night",
        date: "2024-04-10",
        organizer: "Music Club",
        category: "Cultural",
        image: "assets/event-placeholder.png",
        description: "An evening of soulful melodies and rock beats. Featuring the college band 'Decibels'.",
        venue: "Open Air Theatre",
        time: "6:00 PM - 9:00 PM",
        googleFormLink: "https://forms.google.com/example-music",
        registrationStatus: "Coming Soon"
    },
    {
        id: 6,
        title: "Startup Summit",
        date: "2024-05-05",
        organizer: "E-Cell",
        category: "Workshop",
        image: "assets/event-placeholder.png",
        description: "Meet successful entrepreneurs and learn how to pitch your startup idea. Networking session included.",
        venue: "Seminar Hall",
        time: "11:00 AM - 3:00 PM",
        googleFormLink: "https://forms.google.com/example-startup",
        registrationStatus: "Open"
    }
];

/* State */
let isLoggedIn = false;
let user = null;

/* DOM Elements */
const eventFeed = document.getElementById('eventFeed');
const eventDetail = document.getElementById('eventDetail');
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const filterButtons = document.querySelectorAll('.filter hero-content-btn'); // Typo fix: selector might be wrong in my mind, checking HTML... it was .filter-btn
const filterContainer = document.querySelector('.filter-container'); // Use container for delegation or re-select
const createEventBtn = document.getElementById('createEventBtn');
const authBtn = document.getElementById('authBtn');
const createModal = document.getElementById('createModal');
const authModal = document.getElementById('authModal');
const closeBtns = document.querySelectorAll('.close-btn');
const searchInput = document.getElementById('searchInput');
const backBtn = document.getElementById('backBtn');

/* Initialization */
document.addEventListener('DOMContentLoaded', () => {
    renderEvents(events);
    checkTheme();
});

/* Functions */

// Render Events
function renderEvents(data) {
    eventFeed.innerHTML = '';

    if (data.length === 0) {
        eventFeed.innerHTML = '<p class="no-events">No events found.</p>';
        return;
    }

    data.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.onclick = (e) => {
            // Prevent triggering if clicking a button (though we might remove button actions on card if card clicks open detail)
            // Actually, let's allow button to be "Register" (quick action? or just detail?)
            // Requirement: "Register button" on card.
            // Let's make the Register button open Detail too for now, or maybe the card click does.
            // If checking event.target to see if it was the button...
            showEventDetail(event.id);
        };

        const statusClass = event.registrationStatus === 'Open' ? 'status-open-text' : 'status-closed-text'; // Just for text color maybe?

        card.innerHTML = `
            <img src="${event.image}" alt="${event.title}" class="card-image" onerror="this.src='https://via.placeholder.com/300x180?text=Event'">
            <div class="card-content">
                <div class="card-meta">
                    <span class="card-date">${formatDate(event.date)}</span>
                    <span class="chip">#${event.category}</span>
                </div>
                <h3 class="card-title">${event.title}</h3>
                <p class="card-organizer">${event.organizer}</p>
                <div class="card-actions">
                    <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); showEventDetail(${event.id})">View Details</button>
                    <!-- <button class="btn btn-secondary btn-sm">Register</button> -->
                </div>
            </div>
        `;
        eventFeed.appendChild(card);
    });
}

function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Show Event Detail
function showEventDetail(id) {
    const event = events.find(e => e.id === id);
    if (!event) return;

    // Populate Data
    document.getElementById('detailImage').src = event.image;
    document.getElementById('detailTitle').textContent = event.title;
    document.getElementById('detailOrganizer').textContent = event.organizer;
    document.getElementById('detailDate').textContent = formatDate(event.date); // Maybe full date?
    document.getElementById('detailDescription').textContent = event.description;
    document.getElementById('detailVenue').textContent = event.venue;
    document.getElementById('detailTime').textContent = event.time;
    document.getElementById('detailLink').href = event.googleFormLink;

    const statusEl = document.getElementById('detailStatus');
    statusEl.textContent = event.registrationStatus;
    statusEl.className = 'badge-status ' + (event.registrationStatus === 'Open' ? 'status-open' : 'status-closed');

    // Update Link Button
    const linkBtn = document.getElementById('detailLink');
    if (event.registrationStatus !== 'Open') {
        linkBtn.classList.add('disabled'); // Add style for this if needed, or just change text
        linkBtn.textContent = 'Registration Closed / Coming Soon';
        linkBtn.style.opacity = '0.6';
        linkBtn.style.pointerEvents = 'none';
    } else {
        linkBtn.textContent = 'Register Now (Google Form)';
        linkBtn.style.opacity = '1';
        linkBtn.style.pointerEvents = 'auto';
    }

    // Toggle Views
    document.getElementById('hero').classList.add('hidden');
    document.querySelector('.filter-container').classList.add('hidden');
    eventFeed.classList.add('hidden');
    eventDetail.classList.remove('hidden');

    // Scroll to top
    window.scrollTo(0, 0);
}

// Close Event Detail
backBtn.addEventListener('click', () => {
    document.getElementById('hero').classList.remove('hidden');
    document.querySelector('.filter-container').classList.remove('hidden');
    eventFeed.classList.remove('hidden');
    eventDetail.classList.add('hidden');
});

// Filter Logic
// Re-select filter buttons properly
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');
        if (category === 'All') {
            renderEvents(events);
        } else {
            const filtered = events.filter(e => e.category === category);
            renderEvents(filtered);
        }
    });
});

// Search Logic
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = events.filter(event =>
        event.title.toLowerCase().includes(term) ||
        event.organizer.toLowerCase().includes(term)
    );
    renderEvents(filtered);
});

/* Theming */
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function checkTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    const sun = document.querySelector('.sun-icon');
    const moon = document.querySelector('.moon-icon');
    if (theme === 'dark') {
        sun.classList.add('hidden');
        moon.classList.remove('hidden');
    } else {
        sun.classList.remove('hidden');
        moon.classList.add('hidden');
    }
}

/* Modal Logic */
function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        closeModal(targetId);
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

/* Authentication Logic */
// Gatekeeping Create Event
createEventBtn.addEventListener('click', () => {
    if (!isLoggedIn) {
        openModal('authModal');
    } else {
        openModal('createModal');
    }
});

authBtn.addEventListener('click', () => {
    if (isLoggedIn) {
        logout();
    } else {
        openModal('authModal');
    }
});

// Mock Login (Email)
document.getElementById('authForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    // Simulate Login
    login(email);
});

// Mock Login (Google)
document.getElementById('googleAuthBtn').addEventListener('click', () => {
    // Simulate API delay
    const btn = document.getElementById('googleAuthBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Signing in...';

    setTimeout(() => {
        login('google_user@gmail.com');
        btn.innerHTML = originalText;
    }, 1000);
});

function login(email) {
    isLoggedIn = true;
    user = email;
    authBtn.textContent = 'Logout';
    createEventBtn.textContent = 'Create Event';
    closeModal('authModal');
    console.log(`User Logged in: ${email}`);
    alert(`Successfully logged in as ${email}`);
}

function logout() {
    isLoggedIn = false;
    user = null;
    authBtn.textContent = 'Login';
    console.log('User logged out');
}

/* Event Creation */
document.getElementById('createEventForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const newEvent = {
        title: document.getElementById('eventName').value,
        organizer: document.getElementById('eventOrganizer').value,
        date: document.getElementById('eventDate').value,
        category: document.getElementById('eventCategory').value,
        status: "Open" // Default
    };

    console.log("New Event Created:", newEvent);
    alert("Event Created! (Check Console)");
    closeModal('createModal');
    e.target.reset();
});

// Legacy register function removed in favor of Detail View
