const guestRoutes = require('./guestRoutes');
const staffRoutes = require('./staffRoute');
module.exports = (app,verifyWebToken) => {
    app.use('/api',verifyWebToken, guestRoutes);
    app.use('/api',verifyWebToken, staffRoutes);
 
}