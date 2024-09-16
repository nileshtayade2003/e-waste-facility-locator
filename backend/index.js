import express from "express"

const port = 8000;
const app = express();

app.get('/',()=>{
  res.send("hello nilu you are pro player here.");
})

app.listen(port,()=>{
  console.log("app is up on : http://localhost:8000");
})