import { WebSocket, WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";
import {parse} from 'node:url'
const PORT = Number(process.env.PORT || 8080)

const server = new WebSocketServer({
    port: PORT
})

const roomSockets:Record<string, WebSocket[]> = {}




server.on('connection', (socket, req)=>{
    console.log(`Connected at ${PORT}`)
    const roomId: string | undefined = req.url && parse(req.url, true).query.roomId as string || undefined
    if(roomId){
        if(roomSockets[roomId] && roomSockets[roomId].length > 0)
            roomSockets[roomId].push(socket)
        else
            roomSockets[roomId] = [socket]
    }
    socket.send(`You are connected to port ${PORT}`, {
        binary: false
    })
    socket.on('message', (data, isBinary)=>{
        console.log('Received data',JSON.parse(data.toString()))
        const parsedData = JSON.parse(data.toString())
        roomSockets[parsedData.roomId].forEach(s=>{
            if(s!=socket)
                s.send(parsedData.message, {binary: false})
        })
    })
})

