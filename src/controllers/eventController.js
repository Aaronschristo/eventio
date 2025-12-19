const eventService = require('../services/eventService');

const getAllEvents = async (req, res, next) => {
    try {
        const events = await eventService.getAllEvents();
        res.json(events);
    } catch (error) {
        next(error);
    }
};

const getEventById = async (req, res, next) => {
    try {
        const event = await eventService.getEventById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        next(error);
    }
};

const createEvent = async (req, res, next) => {
    try {
        const newEvent = await eventService.createEvent(req.body);
        res.status(201).json(newEvent);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllEvents,
    getEventById,
    createEvent
};
