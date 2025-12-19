/* State */
let events = [];
let isLoggedIn = false;
let user = null;

const API_URL = 'http://localhost:3000/api';

/* DOM Elements */
const eventFeed = document.getElementById('eventFeed');
const eventDetail = document.getElementById('eventDetail');
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const filterContainer = document.querySelector('.filter-container');
const createEventBtn = document.getElementById('createEventBtn');
const authBtn = document.getElementById('authBtn');
const createModal = document.getElementById('createModal');
const authModal = document.getElementById('authModal');
const closeBtns = document.querySelectorAll('.close-btn');
const searchInput = document.getElementById('searchInput');
const backBtn = document.getElementById('backBtn');

/* Initialization */
document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();
    checkTheme();
});

/* Functions */

// Fetch Events from Backend
async function fetchEvents() {
    try {
        const response = await fetch(`${API_URL}/events`);
        events = await response.json();
        renderEvents(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        eventFeed.innerHTML = '<p class="no-events">Failed to load events. Is the server running?</p>';
    }
}

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
        card.onclick = () => showEventDetail(event._id || event.id);

        card.innerHTML = `
            <img src="${event.image || 'assets/event-placeholder.png'}" alt="${event.title}" class="card-image" onerror="this.src='https://via.placeholder.com/300x180?text=Event'">
            <div class="card-content">
                <div class="card-meta">
                    <span class="card-date">${formatDate(event.date)}</span>
                    <span class="chip">#${event.category}</span>
                </div>
                <h3 class="card-title">${event.title}</h3>
                <p class="card-organizer">${event.organizer}</p>
                <div class="card-actions">
                    <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); showEventDetail('${event._id || event.id}')">View Details</button>
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
    const event = events.find(e => (e._id || e.id) == id);
    if (!event) return;

    document.getElementById('detailImage').src = event.image || 'assets/event-placeholder.png';
    document.getElementById('detailTitle').textContent = event.title;
    document.getElementById('detailOrganizer').textContent = event.organizer;
    document.getElementById('detailDate').textContent = formatDate(event.date);
    document.getElementById('detailDescription').textContent = event.description || 'No description available.';
    document.getElementById('detailVenue').textContent = event.venue || 'TBA';
    document.getElementById('detailTime').textContent = event.time || 'TBA';
    document.getElementById('detailLink').href = event.googleFormLink || '#';

    const statusEl = document.getElementById('detailStatus');
    statusEl.textContent = event.registrationStatus || 'Open';
    statusEl.className = 'badge-status ' + ((event.registrationStatus || 'Open') === 'Open' ? 'status-open' : 'status-closed');

    const linkBtn = document.getElementById('detailLink');
    const actionsContainer = document.querySelector('.detail-actions');
    if (!event.googleFormLink) {
        actionsContainer.classList.add('hidden');
    } else {
        actionsContainer.classList.remove('hidden');
        if (event.registrationStatus !== 'Open' && event.registrationStatus) {
            linkBtn.classList.add('disabled');
            linkBtn.textContent = 'Registration Closed / Coming Soon';
            linkBtn.style.opacity = '0.6';
            linkBtn.style.pointerEvents = 'none';
        } else {
            linkBtn.textContent = 'Register Now (Google Form)';
            linkBtn.style.opacity = '1';
            linkBtn.style.pointerEvents = 'auto';
            linkBtn.classList.remove('disabled');
        }
    }

    document.getElementById('hero').classList.add('hidden');
    document.querySelector('.filter-container').classList.add('hidden');
    eventFeed.classList.add('hidden');
    eventDetail.classList.remove('hidden');
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

document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (data.success) {
            login(data.user);
        }
    } catch (error) {
        console.error('Login error:', error);
    }
});

document.getElementById('googleAuthBtn').addEventListener('click', () => {
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
    alert(`Successfully logged in as ${email}`);
}

function logout() {
    isLoggedIn = true; // Wait, logout should set to false
    isLoggedIn = false;
    user = null;
    authBtn.textContent = 'Login';
}

/* Event Creation */
document.getElementById('createEventForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const newEvent = {
        title: document.getElementById('eventName').value,
        organizer: document.getElementById('eventOrganizer').value,
        date: document.getElementById('eventDate').value,
        category: document.getElementById('eventCategory').value,
        time: document.getElementById('eventTime').value,
        venue: document.getElementById('eventVenue').value,
        image: document.getElementById('eventImage').value,
        description: document.getElementById('eventDescription').value,
        googleFormLink: document.getElementById('eventLink').value
    };

    try {
        const response = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEvent)
        });
        if (response.ok) {
            alert("Event Created!");
            closeModal('createModal');
            e.target.reset();
            fetchEvents(); // Refresh list
        }
    } catch (error) {
        console.error('Error creating event:', error);
    }
});
