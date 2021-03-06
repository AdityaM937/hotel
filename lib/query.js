
const pool = require('../config/pgConfig');

module.exports = (queryText , bindVars) => {
    return new Promise((resolve, reject) =>{

        pool.connect((err,client,release) =>{
            //if connection failure we dont need to release anything here
            if(err) return reject(err);

            client.query(queryText, bindVars, (err, results) =>{

                release();
                if(err) reject(err);
                else resolve(results);

            });
        });
    });

}