const query =require('../lib/query');

exports.authorize = async (req, res, next)=> {
    const is_admin = req.decoded.is_admin;
    const user_type = req.decoded.user_type;
    if(!is_admin && req.originalUrl.split('/').find(element => element ==='admin')){
        return res.json({
            status : 'Access Denied',
            success : false,
            message : 'You are not authorized to access this page'
        });
    }else{
        const queryText = `select * from tbl_user_type where id=$1 `;
        const result = await query(queryText,[user_type]);
        const rows= result.rows[0];
        const url = req.originalUrl.split('/');
        if(user_type <=1)
        return next();
        else if(user_type == 3 && req.method ==='GET' && url.find(element => element==='room'))
        return next();
        else if( user_type == 2 && url.find(element=>element==='guest'))
        return next();
        else if( user_type == 2 && url.find(element=>element==='room') && req.method !== 'DELETE')
        return next();
        else if( user_type == 2 && url.find(element=>element=='staff') && req.method ==='GET')
        return next();
        else{
            return res.status(400).json({
                status: 'Access Denied',
                success:false,
                message: 'You are not authorized to access this resource'
            });
        }      
    }

}