const express = require("express");
const api = require("./api");

const app = express();

app.use(express.static(process.cwd()+"/static"));
app.use("/api", api);



app.listen(3000, ()=> {
    console.log("running on http://localhost:3000/");
})