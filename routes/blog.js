
const { query } = require('express');
const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth =require('../services/authentication');
var checkRole = require('../services/checkRole');

//staff
//them tour
router.post('/add',auth.authenticateToken,checkRole.checkRoleUser,(req,res)=>{
    const email=res.locals.email;
    let blog = req.body;
    let query = "insert into tour (name,description,place,user,status) value(?,?,?,?,'true')";
    connection.query(query,[blog.name,blog.description,blog.place,email],(err,results)=>{
        if(!err){
            return res.status(200).json({message:"Tour Added Successfully"});
        }
        else {
            return res.status(500).json(err);
        }
    })
})

//xem tour cua minh
router.get('/blog',auth.authenticateToken,checkRole.checkRoleUser,(req,res,next)=>{
    const email=res.locals.email;
    var query = "select id,name, description from tour where user=?";

    connection.query(query,[email],(err,results)=>{
        if(!err){
            return res.status(404).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})

//cap nhat
router.patch('/update',auth.authenticateToken,checkRole.checkRoleUser,(req,res,next)=>{
    let tour = req.body;
    var query = "update tour set name=?,description=?,status=? where id=?";
    connection.query(query,[tour.name,tour.description,tour.status,tour.id],(err,results)=>{
        if(!err){
            if(results.affectedRow==0){
                return res.status(404).json({message:"Tour id does not exist"});
            }
            return res.status(200).json({message:"Tour Updated Successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})



//admin
router.get('/getid',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let blog = req.body;
    var query = "select name, status from tour where id=?";
    connection.query(query,[blog.id],(err,results)=>{
        if(!err){
            return res.status(404).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})


//user 
router.get('/get',(req,res,next)=>{
    var query = "select c.name, c.description from tour as c inner join img as d where c.id=d.tourId";
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(404).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})

router.get('/getByTour/:id',(req,res,next)=>{
    const id=req.params.id;
    var query = "select id, name, description from tour where id=? and status = 'true'";
    connection.query(query,[id],(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/seach',(req,res,next)=>{
    let 
    var query = ""
})
module.exports = router;