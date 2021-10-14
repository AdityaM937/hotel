const query = require('../lib/query');
const path = require('path');
const {AppError} = require('../utils/appError');
const bcryptjs = require('bcrypt');
const {body,params, validationResult} = require('express-validator');

exports.validate = (method) => {
    switch (method) {
        case 'addGuest' : {
           return [
               body('name', 'Name cannot be empty').notEmpty(),
               body('check-in', 'Check in has to be specified').notEmpty(),
               body('useremail', 'Invalid email').exists().isEmail(),
               body('address', 'company cannot be empty').exists().notEmpty(),
               body('phone', 'Invalid phone number').notEmpty().isNumeric().isLength({min:10}),
            ];
        }
        case 'searchGuest' :{
           return[ body('id','Guest Id cannot be empty').notEmpty(),
            body('name', 'Name cannot be empty').notEmpty()
        ];
        }
        case 'updateGuest' :{
           return[
            body('name', 'Name cannot be empty').notEmpty(),
            body('check-in', 'Check-in has to be specified').notEmpty(),
            body('check-out', 'Check out has to be specified').notEmpty(),
            body('useremail', 'Invalid email').exists().isEmail(),
            body('password').exists().notEmpty(),
            body('phone', 'Invalid phone number').notEmpty().isNumeric().isLength({min:10}),
        ];
        }
        case 'deleteGuest' : {
            return [
            body('id','Guest Id cannot be empty').notEmpty(),
            body('name', 'Name cannot be empty').notEmpty()
            ];
        }
    }
}

/** add guest */

exports.addGuest = async (req,res,next) => {
try{
    const errors = validationResult(req);
    if(!errors.notEmpty()) {
        return ( new AppError(400, 'Validation Error', errors.errors,res));
    }
    let bindVars;
    let queryText;
    let result;
// Re-stating the value of cursor of serial in postgres
    queryText = ` select last_value from tbl_guest_guestid_seq`;
    result = await query(queryText,[]);
    let value = result.rows[0].last_value;

    queryText = `select guestid from tbl_guest`;
    result = await query(queryText,[]);
    const check = (value) => {
        if(result.rows.find(({guestid}) => guestid===value))
        {
            return check(value+1);
        }
        else{
           return value;
        }
    };
    value = check(value);
   
    bindVars =[
        value,
        req.body.guestname,
        req.body.guestcompany,
        req.body.guestphone,
        req.body.guestemail,
        req.body.guestgender,
        req.body.guestaddress
    ];

    queryText = `insert into tbl_guest(guestid,guestname,guestcompany,guestphone,guestemail,guestgender,guestaddress)
    values($1,$2,$3,$4,$5,$6,$7) returning guestid`;
    result = await query(queryText, bindVars);
    bindVars =[
        req.body.checkin,
        req.body.checkout, 
        result.rows[0].guestid
    ];
    
    queryText = `insert into tbl_reservation(checkin,checkout,guest_id) values($1,$2,$3)
    `;
    result = await query(queryText, bindVars);
    queryText = `select (date(checkout) - date(checkin)) as totalnight from tbl_reservation where guest_id = $1`;
    result = await query(queryText,[bindVars[2]]);
    queryText = `update tbl_reservation set totalnight = $2 where guest_id=$1`;
    result = await query(queryText,[bindVars[2],result.rows[0].totalnight]);
    bindVars = bindVars[2];

    // queryText = `select g.guestid, g.guestname,g.guestcompany,g.guestphone,
    // g.guestemail,g.guestgender,g.guestaddress,
    // r.checkin, r.checkout, r.totalnight
    // from tbl_guest g 
    // full join tbl_reservation r on r.guest_id = g.guestid
    // where r.guest_id=$1`;
    // result = await query(queryText, [bindVars]);

    if(result.rowCount > 0 ) {
        res.status(200).json({
            status :true,
            message : `success`,
            id : [bindVars]
        });
     }else{
         res.status(201).json({
             status:false,
             message:`failed`,
         });
     }
    }catch(err){
        next(err);
    }

}

/** Update guest details */
exports.updateGuest = async (req,res,next) => {
try{
    let bindVars;
    let queryText;
    let result;
    bindVars = [
        req.body.guestid,
        req.body.guestname,
        req.body.guestcompany,
        req.body.guestphone,
        req.body.guestemail,
        req.body.guestgender,
        req.body.guestaddress,
        req.body.checkout
    ];

    queryText = `update tbl_guest set guestname=$2 where guestid=$1`;
    if(bindVars[1] !== 'undefined')
    result = await query(queryText,[bindVars[0],bindVars[1]]);
    queryText = `update tbl_guest set guestcompany=$2 where guestid=$1`;
    if(bindVars[2] !== 'undefined')
    result = await query(queryText, [bindVars[0],bindVars[2]]);
    queryText = `update tbl_guest set guestphone=$2 where guestid=$1`;
    if(bindVars[3] !== 'undefined')
    result = await query(queryText, [bindVars[0],bindVars[3]]);
    queryText = `update tbl_guest set guestemail=$2 where guestid=$1`;
    if(bindVars[4] !== 'undefined')
    result = await query(queryText, [bindVars[0],bindVars[4]]);
    queryText = `update tbl_guest set guestgender=$2 where guestid=$1`;
    if(bindVars[5] !== 'undefined')
    result = await query(queryText, [bindVars[0],bindVars[5]]);
    queryText = `update tbl_guest set guestaddress=$2 where guestid=$1`;
    if(bindVars[6] !== 'undefined')
    result = await query(queryText, [bindVars[0],bindVars[6]]);
    queryText = `update tbl_reservation set checkout=$2 where guest_id=$1`;
    if(bindVars[7] !== 'undefined')
    result = await query(queryText, [bindVars[0],bindVars[7]]);

    if(result.rowCount > 0){
        res.status(200).json({
            status:true,
            message:`success!!`,
            id:`${req.body.guestid} updated!`
        });
    }else{
        res.status(201).json({
            status:false,
            message:`Some error occured!`
        });
    }

    
    
}catch(err) {
    next(err);
}

}

/**Delete Guest */

exports.deleteGuest = async (req,res,next) => {
try{
    let bindVars;
    let queryText;
    let result;
    bindVars =[
       req.params.id
    ];

    queryText = `delete from tbl_reservation where guest_id = $1`;
    result = await query(queryText, bindVars);

    queryText= `alter sequence tbl_guest_guestid_seq restart with ${req.params.id}`;
    result = await query(queryText, []);
    queryText = `delete from tbl_guest where guestid = $1`;
    result = await query(queryText, bindVars);

    if(result.rowCount > 0 ) {
        
        res.status(200).json({
            status :true,
            message : `success`
        });
     }else{
         res.status(201).json({
             status:false,
             message:`ID already deleted OR doesn't exist`,
         });
     }
    }catch(err){
        next(err);
    }
}

/** Get specific guest details */

exports.getGuest = async (req,res,next) => {
    try{
        const bindVars = [
            req.params.id
        ];
        const queryText =`select g.guestid, g.guestname,g.guestcompany,g.guestphone,
        g.guestemail,g.guestgender,g.guestaddress,
        r.checkin, r.checkout, r.totalnight
        from tbl_guest g 
        left outer join tbl_reservation r on r.guest_id = g.guestid
        where g.guestid=$1`;
        const result = await query(queryText,bindVars);
        if(result.rowCount >0)
        {
            res.status(200).json({
                status:true,
                message:`success!!`,
                data:result.rows
            });
        }else{
            res.status(201).json({
                status:true,
                message:`Id doesn't exist or deleted!!`
            });
        }
    }catch(err){
        next(err);
    }
}


/** LIST ALL GUEST */


exports.listGuest = async (req,res,next) => {
    try{
        const bindVars = [

        ];
        let queryText=``;
        if(req.query.PageIndex && req.query.PageSize)
        queryText =`select g.guestid, g.guestname,g.guestcompany,g.guestphone,
        g.guestemail,g.guestgender,g.guestaddress,
        r.checkin, r.checkout, r.totalnight , count(*) over() as fullcount
        from tbl_guest g 
        left outer join tbl_reservation r on r.guest_id = g.guestid
        order by g.guestid
        limit ${req.query.PageSize} offset ${req.query.PageSize}*${req.query.PageIndex-1}
        `;
        else
        queryText =`select g.guestid, g.guestname,g.guestcompany,g.guestphone,
        g.guestemail,g.guestgender,g.guestaddress,
        r.checkin, r.checkout, r.totalnight , count(*) over() as fullcount
        from tbl_guest g 
        left outer join tbl_reservation r on r.guest_id = g.guestid
        order by g.guestid
        `;
        const result = await query(queryText,bindVars);
        const rows = result.rows;
        if(rows.length >0)
        {
            res.status(200).json({
                status:true,
                message:`success!!`,
                data:result.rows,
                totalcount : rows[0].fullcount?rows[0].fullcount:rows.length
            });
        }else{
            res.status(201).json({
                status:false,
                message: `no data found on this page!`
            });
        }
    }catch(err){
        next(err);
    }
}
