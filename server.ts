import express from 'express'
const PORT = process.env.PORT || 5001
const app = express()

app.get("/",(req, res)=>{
    console.log(req.query)
    res.send(`Response from ${PORT}`)
})
app.get("/new", (req, res)=>{
    console.log(req.query)
    res.send(`This is new ser from ${PORT}`)
})

app.get('/err', (req, res)=>{
    res.status(401).send("Unauthorized ser soory")
})
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})