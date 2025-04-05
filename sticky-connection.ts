import { createServer } from "node:http";
import { createProxyServer } from 'http-proxy'
import { v4 as uuid } from "uuid";
const proxy = createProxyServer({});
const servers = ['http://localhost:5001', 'http://localhost:5002', 'http://localhost:5003'];
const assignedServers: Record<string, string> = {}
const server = createServer((req, res) => {
    const COOKIE_NAME = "LB_SESSION"
    const cookieString = req.headers.cookie
    let targetServer;
    const cookies = cookieString?.split(';').map((cook) => {
        const [key, value] = cook.trim().split("=")
        return { key, value }
    }) || []
    console.log("Cookies are: ", cookies)
    const existingCookie = cookies.find(c => c.key == COOKIE_NAME)
    if (existingCookie &&  assignedServers[existingCookie.value]) {
        targetServer = assignedServers[existingCookie.value]
    }
    else {

        const newSessionId = uuid()
        assignedServers[newSessionId] = servers[Math.floor(Math.random() * 10) % servers.length]
        res.setHeader('Set-Cookie', `${COOKIE_NAME}=${newSessionId}; Path=/`)
        targetServer = assignedServers[newSessionId]
    }
    if(req.url == '/assigned'){
        res.write(JSON.stringify(assignedServers))
        res.end()
        return
    }
    proxy.web(req, res, {
        target: targetServer
    }, (err) => {
        console.log("Load balancing failed")
        res.writeHead(502, "LB Failed")
        res.end("Bad gateway baddie")
    })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`Load balancer is running at port ${PORT}`)
})