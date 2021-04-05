const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3003
app.use(express.urlencoded({extended : false}));

const koneksiDB = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "week1"
});

koneksiDB.connect((err)=>{
    if(err){
        console.log("database tidak konek");
    }else{
        console.log("databse konek");
    }
});

app.get("/api/foods", (req, res)=>{
    let sql ="SELECT * FROM foods";
    koneksiDB.query(sql, (err, result)=>{
        if(err){
            res.send({
                msg: "gagal mendapat data",
                status : 500,
                err,
            })
        }else{
            res.send({
                msg: "data didapatkan",
                status: 200,
                data: result,
            })
        }
    })
});

app.post("/api/foods", (req, res)=>{
    let{body}=req;
    let sql = "INSERT INTO foods SET ?";
    koneksiDB.query(sql, body,(err,results)=>{
        if(err){
            res.send({
                msg: "gagal menambah data",
                status : 500,
                err,
            })
        }else{
            let newBody = {
                id: results.insertId,
                ...body,
            };
            res.send({
                msg: "data berhasil ditambah",
                status: 200,
                data: newBody,
            });
        }
    })
});

app.get("/api/foods/:id", (req,res)=>{
    let{id} = req.params;
    let sql = `SELECT * FROM foods WHERE id = ${id}`;
    koneksiDB.query(sql, (err, results)=>{
        if(err){
            res.send({
                msg: "pengambilan data error",
                status: 500,
                err,
            })
        }else{
            res.send({
                msg: "pengambilan data berhasil",
                status: 200,
                data: results,
            })
        }
    })
});

app.delete("/api/foods/:id", (req, res)=>{
    let{id} = req.params;
    let sql = `DELETE FROM foods WHERE id = ${id}`;
    koneksiDB.query(sql, (err, results)=>{
        if(err){
            res.send({
                msg: "Error While delete data",
                status: 500,
                err,
            })
        }else{
            res.send({
                msg: "data berhasil dihapus",
                status: 200,
                results,
            })
        }
    })
});

app.put("/api/foods/:id",(req, res)=>{
    let{id} = req.params;
    let{body} = req;
    let sql = `UPDATE foods SET ? WHERE id=${id}`;
    koneksiDB.query(sql,body, (err, results)=>{
        if(err){
            res.send({
                msg: "data tidak dapat diupdate",
                status: 500,
                err,
            })
        }else{
            res.send({
                msg: "data berhasil di update",
                status: 200,
                results,
            })
        }
    })
});

app.listen(port, () =>{
    console.log("server jalan pada port : "+ port);
});