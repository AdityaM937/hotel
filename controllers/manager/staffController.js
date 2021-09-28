const query = require('../../lib/query');
const path = require('path');
const {validation, body} = require('express-validator');

exports.validate = (method) => {
    switch (method) {
        case 'addStaff' : {
           return [
               body('name', 'Name cannot be empty').notEmpty(),
               body('check-in', 'Check in has to be specified').notEmpty(),
               body('useremail', 'Invalid email').exists().isEmail(),
               body('address', 'company cannot be empty').exists().notEmpty(),
               body('phone', 'Invalid phone number').notEmpty().isNumeric().isLength({min:10}),
            ];
        }
        case 'searchStaff' :{
           return[ body('id','Staff Id cannot be empty').notEmpty(),
            body('name', 'Name cannot be empty').notEmpty()
        ];
        }
        case 'updateStaff' :{
           return[
            body('name', 'Name cannot be empty').notEmpty(),
            body('check-in', 'Check-in has to be specified').notEmpty(),
            body('check-out', 'Check out has to be specified').notEmpty(),
            body('useremail', 'Invalid email').exists().isEmail(),
            body('password').exists().notEmpty(),
            body('phone', 'Invalid phone number').notEmpty().isNumeric().isLength({min:10}),
        ];
        }
        case 'deleteStaff' : {
            return [
            body('id','Staff Id cannot be empty').notEmpty(),
            body('name', 'Name cannot be empty').notEmpty()
            ];
        }
    }
}


/** add staff */
/** TO CREATE SEQUENCE 
 * create sequence tbl_staff_staffid_seq owned by tbl_staff.staffid;
select setval('tbl_staff_staffid_seq', coalesce(max(staffid),0)+1,false) from tbl_staff;
alter table tbl_staff alter column staffid set default nextval('tbl_staff_staffid_seq');
*/
exports.addStaff = async (req,res,next) => {
    try{
        let bindVars;
        let queryText;
        let result;
    // Re-stating the value of cursor of serial in postgres
        queryText = ` select last_value from tbl_staff_staffid_seq`;
        result = await query(queryText,[]);
        let value = result.rows[0].last_value;
    
        queryText = `select staffid from tbl_staff`;
        result = await query(queryText,[]);
        const check = (value) => {
            if(result.rows.find(({staffid}) => staffid===value))
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
            req.body.employeename,
            req.body.employeeaddress,
            req.body.employeenic,
            req.body.employeesalary,
            req.body.employeeage,
            req.body.employeemail,
            req.body.employeedepartment
        ];
    
        queryText = `insert into tbl_staff(staffid,employeename,employeeaddress,employeenic,employeesalary,employeeage,employeemail,employeedepartment)
        values($1,$2,$3,$4,$5,$6,$7,$8) returning staffid`;
        result = await query(queryText, bindVars);
    
        if(result.rowCount > 0 ) {
            res.status(200).json({
                status :true,
                message : `success`,
                id : result.rows[0].staffid
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
    
    /** Update staff details */
    exports.updateStaff = async (req,res,next) => {
    try{
        let bindVars;
        let queryText;
        let result;
        bindVars = [
            req.body.staffid,
            req.body.employeename,
            req.body.employeeaddress,
            req.body.employeenic,
            req.body.employeesalary,
            req.body.employeeage,
            req.body.employeemail,
            req.body.employeedepartment
        ];
    
        queryText = `update tbl_staff set employeename=$2 where staffid=$1`;
        if(bindVars[1] !== 'undefined')
        result = await query(queryText,[bindVars[0],bindVars[1]]);
        queryText = `update tbl_staff set employeeaddress=$2 where staffid=$1`;
        if(bindVars[2] !== 'undefined')
        result = await query(queryText, [bindVars[0],bindVars[2]]);
        queryText = `update tbl_staff set employeenic=$2 where staffid=$1`;
        if(bindVars[3] !== 'undefined')
        result = await query(queryText, [bindVars[0],bindVars[3]]);
        queryText = `update tbl_staff set employeesalary=$2 where staffid=$1`;
        if(bindVars[4] !== 'undefined')
        result = await query(queryText, [bindVars[0],bindVars[4]]);
        queryText = `update tbl_staff set employeeage=$2 where staffid=$1`;
        if(bindVars[5] !== 'undefined')
        result = await query(queryText, [bindVars[0],bindVars[5]]);
        queryText = `update tbl_staff set employeemail=$2 where staffid=$1`;
        if(bindVars[6] !== 'undefined')
        result = await query(queryText, [bindVars[0],bindVars[6]]);
        queryText = `update tbl_staff set employeedepartment=$2 where staffid=$1`;
        if(bindVars[7] !== 'undefined')
        result = await query(queryText, [bindVars[0],bindVars[7]]);
    
        if(result.rowCount > 0){
            res.status(200).json({
                status:true,
                message:`success!!`,
                id:`${req.body.staffid} updated!`
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
    
    /**Delete Staff */
    
    exports.deleteStaff = async (req,res,next) => {
    try{
        let bindVars;
        let queryText;
        let result;
        bindVars =[
           req.params.id
        ];
    
        queryText= `alter sequence tbl_staff_staffid_seq restart with ${req.params.id}`;
        result = await query(queryText, []);
        queryText = `delete from tbl_staff where staffid = $1`;
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
    
    /** Get specific staff details */
    
    exports.getStaff = async (req,res,next) => {
        try{
            const bindVars = [
                req.params.id
            ];
            const queryText =`select * from tbl_staff
            where staffid=$1`;
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
    
    
    /** LIST ALL STAFF */
    
    
    exports.listStaff = async (req,res,next) => {
        try{
            const bindVars = [
    
            ];
            const queryText =`select * from tbl_staff
            order by staffid
            limit ${req.query.PageSize} offset ${req.query.PageSize}*${req.query.PageIndex-1}
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
    