
const jsonWebToken = require('jsonwebtoken');
exports.jwtToken = (data) => {
    return new Promise((resolve, reject) => {
        jsonWebToken.sign(data, 'Morphling@!', {expiresIn : '24 hours'},(err,token) => {
            if(err) reject(err);
            else{
              //  console.log('token : '+token);
                resolve(token);
            }
        });
    });
}

exports.jwtVerifyToken = (data) => {
    return new Promise((resolve, reject) => {
       
        jsonWebToken.verify(data, 'Morphling@!', (err,decoded) => {
            if(err) {reject(err);}
            if(typeof decoded.is_admin !== 'undefined') {
                resolve(decoded);
            }else{
               console.log(decoded);
            }

        });

    });
}

exports.jwtRegisterToken = (data)=>{
    return new Promise((resolve, reject)=>{
        jsonWebToken.sign(data,'Morphling@!',{expiresIn: '1 day'}, (err, token) => {
            if(err) reject(err);
            else {resolve(token); //console.log(token);
            }
        });
    });
}