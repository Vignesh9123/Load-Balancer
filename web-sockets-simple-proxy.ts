import { createServer } from "node:http";
import { createProxyServer } from "http-proxy";

const proxy = createProxyServer({})

const server = createServer()

server.on('upgrade', (req, socket, head)=>{
    proxy.ws(req, socket, head, {target:'ws://localhost:8080'}, (err)=>{
        socket.destroy()
    })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, ()=>{
    console.log(`WS Load balancer running on port ${PORT} `)
})