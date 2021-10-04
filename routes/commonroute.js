const guestRoutes = require('./guestRoutes');
const staffRoutes = require('./staffRoute');
const authRoutes = require('./authRoutes');
module.exports = (app,verifyjwtToken) => {
    app.use('/api', verifyjwtToken,guestRoutes);
    app.use('/api',verifyjwtToken, staffRoutes);
    app.use('/api',authRoutes);
 
}