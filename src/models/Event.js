const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true
    },
    organizer: {
        type: String,
        required: [true, 'Organizer is required'],
        trim: true
    },
    date: {
        type: String, // Or Date, keeping String for consistency with previous setup for now
        required: [true, 'Date is required']
    },
    category: {
        type: String,
        enum: ['Tech', 'Cultural', 'Workshop', 'Sports', 'Others'],
        required: [true, 'Category is required']
    },
    image: {
        type: String,
        default: 'assets/event-placeholder.png'
    },
    description: {
        type: String,
        trim: true
    },
    venue: {
        type: String,
        trim: true
    },
    time: {
        type: String,
        trim: true
    },
    googleFormLink: {
        type: String,
        trim: true
    },
    registrationStatus: {
        type: String,
        enum: ['Open', 'Closed', 'Coming Soon'],
        default: 'Open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Event', eventSchema);
