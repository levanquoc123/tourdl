const { query } = require('express');
const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth =require('../services/authentication');
var checkRole = require('../services/checkRole');

//staff,admin
//them 
router.post('/add',auth.authenticateToken,checkRole.checkRoleUser,(req,res)=>{
    let chuyenDi = req.body;
    let query = "insert into chuyendi (startTime,endTime,tourId,status) value(?,?,?,'true')";
    connection.query(query,[chuyenDi.startTime,chuyenDi.endTime,chuyenDi.tourId],(err,results)=>{
        if(!err){
            return res.status(200).json({message:"Chuyen Di Added Successfully"});
        }
        else {
            return res.status(500).json(err);
        }
    })
})
//chinh

//xoa

//all
//view chuyen di
router.get('/get',(req,res)=>{
    tour = req.body;
    let query = "select c.name, d.startTime, d.endTime from tour as c inner join chuyendi as d where c.id = d. tourId and d.id = ?"
    connection.query(query,[tour.id],(err,results)=>{
        if(!err){
            return res.status(404).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})

module.exports = router;