import { WebSocket, WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";
const PORT = Number(process.env.PORT || 8080)

const server = new WebSocketServer({
    port: PORT
})

interface WS extends WebSocket{
    id: string
}

server.on('connection', (socket:WS)=>{
    console.log(`Connected ${socket}`)
    socket.id = uuid()
    server.clients.forEach((c)=>{
        if(c != socket)
        c.send(`New user joined ${socket.id}`, {
            binary: false
        })
    })
    socket.on('message', (data, isBinary)=>{
        console.log('Received data', data.toString(), 'from', socket.id)
        socket.send(`${data}`, {
            binary: isBinary
        })
    })
})

