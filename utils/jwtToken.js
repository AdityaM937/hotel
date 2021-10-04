const jwt = require('jsonwebtoken');
const query = require('../lib/query');
exports.jwtToken = (data) => {
    return new Promise((resolve, reject) => {

        jwt.sign(data,'Morphling@!', {expiresIn : '1 day'},function(err,token){
            if(err) reject(err);
            else{ resolve(token);
                console.log(token);}
        });
    });
}

exports.jwtVerifyToken = (data) => {
    return new Promise((resolve, reject) => {
        jwt.verify(data,'Morphling@!',(err,decoded)=>{
            if(decoded.is_admin){
                const queryText = `select * from tbl_admin_login where id=$1`;
              //  query(queryText,[req.decoded.user_id]);
                resolve(decoded);
            }else{
                resolve(decoded);
            }
        });
    });
}

exports.jwtRegisterToken = (data) => {
    return new Promise((resolve, reject)=>{
        jsonWebToken.sign(data,'Morphling@!',{expiresIn: '1 day'}, (err, token) => {
            if(err) reject(err);
            else {resolve(token); console.log(token);}
        });
    });
}