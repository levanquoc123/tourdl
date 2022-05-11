const express = require("express");
const cors = require('cors');
const req = require("express/lib/request");
const connection = require("../connection");
const { query } = require("express");
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
var auth=require('../services/authentication');
var checkRole=require('../services/checkRole');


//user
//đăng ký
router.post('/signup',(req,res) => {
    let user = req.body;
    var  query = "select email,password,cmnd,role,status from user where email=?"
    connection.query(query,[user.email],(err,results) => {
        if (!err) {
            if (results.length <=0){
                query = "insert into user(email,password,fullName,SDT,cmnd,status,role) value(?,?,?,?,?,'true','user')";
                connection.query(query,[user.email,user.password,user.fullName,user.sdt,user.cmnd],(err,results)=>{
                    if(!err){
                        return res.status(200).json({massage:"Succesfully Registerd"});
                    }else{
                        return res.status(500).json(err);
                    }
                })
            }else{ 
                return res.status(400).json({message: "Email Already Exist."});
            }
        } else {
            return res.status(500).json(err);
        } 
    })
})

//đăng nhập
router.post('/login',(req,res)=>{
    const user = req.body;
    let query = "select email,password,role,status from user where email=?";
    connection.query(query,[user.email],(err,results)=>{
        if (!err){
            if(results.length<=0||results[0].password !=user.password){
                return res.status(401).json({message:"Incorrnect Username or password"});
            } 
            else if (results[0].status=='false'){
                return res.status(401).json({message:"Wait for Admin Approal"});
            }
            else if(results[0].password==user.password) {
                const response = { email:results[0].email,role:results[0].role}
                const accessToken = jwt.sign(response,process.env.ACCESS_TOKEN,{expiresIn:'8h'})
                res.status(200).json({token:accessToken})
            }
            else {
                return res.status(400).json({message:"Something went wrong.please try again"})
            }
        } else {
            return res.status(500).json(err)
        }
    })
})
//post mail
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

//lấy lại mk
router.post('/forgotPassword',(req,res)=>{
    const user = req.body;
    let query = "select email,password from user where email=?";
    connection.query(query,[user.email],(err,results)=>{
        if (!err){
            if (results.length<=0){
                return res.status(200).json({message:"Password sent successfully to your email"});
            }
            else {
                var mailOption ={
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: 'Password by Web Tour Du Lich',
                    html: '<p><b>Login details for Web Tour Du Lich</b><br><b>Email:</b>'+results[0].email+'<br><b>Password: </b>'+results[0].password+'<br><a href="http://localhost:4200/">Click here to login</a></p>'
                };
                transporter.sendMail(mailOption,function(err,info){
                    if(error){
                        console.log(error);
                    }
                    else {
                        console.log('Email sent: '+info.response)
                    }
                });
                return res.status(200).json({message:"Password sent successfully to your email"});
            }
        }
        else {
            return res.status(500).json(err)
        }
    })
})


//thay đổi mk
router.post('/changePassword',auth.authenticateToken,(req,res)=>{
    const user=req.body;
    const email=res.locals.email;
    var query = "select *from user where email=? and password=?";
    connection.query(query,[email,user.oldPassword],(err,results)=>{
        if(!err){
            if(results.length<=0){
                return res.status(400).json({message:"Incorrect Old Password"});
            }
            else if(results[0].password==user.oldPassword){
                query="update user set password=? where email=?";
                connection.query(query,[user.newPassword,email],(err,results)=>{
                    if(!err){
                        return res.status(200).json({message:"Password Update Successfully"});
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                res.status(400).json({message:"Something went wrong.Please try again later"});
            }
        }
        else {
            return res.status(500).json(err);
        }
    })

})
//xem thong tin ca nhan
router.get('/getemail',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    const email=res.locals.email;
    var query ="select FullName,sdt,cmnd,NgaySinh,GioiTinh,DiaChi from user where email=?";
    connection.query(query,[email],(err,results)=>{
        if (!err){
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

//admin
//xuất tài khoản
router.get('/get',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    var query ="select id,email,FullName,sdt,cmnd,NgaySinh,GioiTinh,DiaChi,status,role from user where role='user' or role='staff'";
    connection.query(query,(err,results)=>{
        if (!err){
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})
//cập nhật tài khoản user
router.patch('/role',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    let user = req.body;
    var role = "staff";
    var query = "update user set role=? where id=?";
    connection.query(query,[role,user.id],(err,results)=>{
        if(!err){
            if(results.affectedRow==0){
                return res.status(404).json({message:"User id does not exist"});
            }
            return res.status(200).json({message:"User Updated Successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

router.get('/checkToken',auth.authenticateToken,(req,res)=>{
    return res.status(200).json({message:"true"});
})
//thay doi quyen
router.patch('/update',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    let user = req.body;
    var query = "update user set status=? where id=?";
    connection.query(query,[user.status,user.id],(err,results)=>{
        if(!err){
            if(results.affectedRow==0){
                return res.status(404).json({message:"User id does not exist"});
            }
            return res.status(200).json({message:"User Updated Successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

module.exports = router;