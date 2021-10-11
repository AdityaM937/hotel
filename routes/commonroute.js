const guestRoutes = require('./guestRoutes');
const staffRoutes = require('./staffRoute');
const authRoutes = require('./authRoutes');

module.exports = (app,verifyjwtToken) => {
    app.use('/api/admin',authRoutes);
    app.use('/api/admin',verifyjwtToken,guestRoutes);
    app.use('/api/admin',verifyjwtToken,staffRoutes);
    
 
}