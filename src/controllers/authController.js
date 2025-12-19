const login = (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email required' });
        }
        // Simplified auth for demo
        res.json({ success: true, user: email });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login
};
