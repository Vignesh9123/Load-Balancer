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
    console.log(`Connected at ${PORT}`)
    socket.id = uuid()
    socket.send(`You are connected to port ${PORT}`, {
        binary: false
    })
    socket.on('message', (data, isBinary)=>{
        console.log('Received data', data.toString(), 'from', socket.id)
        socket.send(`${data}`, {
            binary: isBinary
        })
    })
})

