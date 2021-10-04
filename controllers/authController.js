const query = require('../lib/query');
const jwt = require('../utils/jwtToken');
const bcryptjs = require('bcryptjs');
const {body,params,validationResult} = require('express-validator');

exports.validate = (method)=>{
    switch(method){
        case 'adminLogin' : {
            return [
                body('user_email','Email must be provided').notEmpty(),
                body('user_email','Invalid mail , it must be in email format').isEmail(),
                body('password','Password must be provided').notEmpty(),
            ];
        }
    }
};

exports.adminLogin = async (req, res, next) => {
    try{
        const bindVars = [
            req.body.user_email,
            req.body.password,
        ];

        const queryText = `select * from tbl_admin_login where user_email=$1`;
        const result = await query(queryText, [req.body.user_email]);
        if(result.rows.length > 0){
            const match  = await bcryptjs.compare(bindVars[1],result.rows[0].password);
            if(!match){
                res.status(200).json({
                    statusCode: 204,
                    message: "Password not match!!"
                });
            }else{
                const user = {
                    user_id: result.rows[0].id,
                    user_email: result.rows[0].user_email,
                    user_name: result.rows[0].user_name,
                    is_admin : 1
                };
                const token = await jwt.jwtToken(user);
                console.log(token);
                result.rows[0].password="";
                res.status(200).json({
                    statusCode: 200,
                    response: {
                        accessToken : token,
                        userData : result.rows[0]   
                    },
                    
                });
            }
        }

    }catch(err){
        next(err);
    }
};