const guestRoutes = require('./guestRoutes');
const staffRoutes = require('./staffRoute');
const authRoutes = require('./authRoutes');
const roomRoutes = require('./roomRoute');
module.exports = (app,verifyjwtToken,acl) => {
    app.use('/api/admin',authRoutes);
    app.use('/api/common',verifyjwtToken,acl.authorize,roomRoutes);
    app.use('/api/admin',verifyjwtToken,acl.authorize,guestRoutes);
    app.use('/api/admin',verifyjwtToken,acl.authorize,staffRoutes);
   
 
}