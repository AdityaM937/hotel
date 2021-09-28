const guestRoutes = require('./guestRoutes');
const staffRoutes = require('./manager/staffRoute');
module.exports = (app) => {
    app.use('/api', guestRoutes);
    app.use('/api', staffRoutes);
 
}