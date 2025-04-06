import { createProxyServer } from "http-proxy";
import { createServer } from "node:http";

const PORT = process.env.PORT || 8000
const servers = ['ws://localhost:8081', 'ws://localhost:8082', 'ws://localhost:8083']

const server = createServer()
const proxy = createProxyServer()

server.on('upgrade',(req, socket, head)=>{
    const targetServer = servers[Math.floor(Math.random() * servers.length)]
    proxy.ws(req,socket, head, {
        target: targetServer
    }, (err)=>{
        console.log("Conn failed")
        socket.destroy();
    })
} )

server.listen(PORT, ()=>{
    console.log(`WS LB running on port ${PORT}`)
})