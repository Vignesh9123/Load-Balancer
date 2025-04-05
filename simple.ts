import { createServer } from "node:http";
import {createProxyServer} from 'http-proxy'

const proxy = createProxyServer({});
const servers = ['http://localhost:5001', 'http://localhost:5002', 'http://localhost:5003'];
let current = 0;

const server = createServer((req, res)=>{
    const targetServer = servers[current]
    current = (current+1) % servers.length
    console.log(`Fwding request to ${targetServer}`)
    proxy.web(req, res, {
        target: targetServer
    }, (err)=>{
        console.log("Load balancing failed")
        res.writeHead(502, "LB Failed")
        res.end("Bad gateway baddie")
    })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, ()=>{
    console.log(`Load balancer is running at port ${PORT}`)
})