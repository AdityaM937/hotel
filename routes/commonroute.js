const guestRoutes = require('./guestRoutes');

module.exports = (app) => {
    app.use('/api', guestRoutes);
 
}