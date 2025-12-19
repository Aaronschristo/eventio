const Event = require('../models/Event');

class EventService {
    async getAllEvents() {
        try {
            return await Event.find().sort({ date: 1 });
        } catch (error) {
            console.error('Error fetching events from MongoDB:', error);
            throw new Error('Could not fetch events');
        }
    }

    async getEventById(id) {
        try {
            return await Event.findById(id);
        } catch (error) {
            console.error(`Error fetching event ${id} from MongoDB:`, error);
            throw new Error('Could not fetch event');
        }
    }

    async createEvent(eventData) {
        try {
            const newEvent = new Event(eventData);
            return await newEvent.save();
        } catch (error) {
            console.error('Error creating event in MongoDB:', error);
            throw new Error('Could not create event');
        }
    }
}

module.exports = new EventService();
