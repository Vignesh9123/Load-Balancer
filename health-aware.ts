import { createServer } from "node:http";
import {createProxyServer} from 'http-proxy'

const proxy = createProxyServer({});
const servers = ['http://localhost:5001', 'http://localhost:5002', 'http://localhost:5003'];
let healthyServers = [...servers];
const healthStatus: Record<string, boolean> = {}
let current = 0;

const healthCheck = ()=>{
    console.log("Checking health")
    servers.forEach((server)=>{
        fetch(server)
        .then((res)=>{
            if(res.ok) healthStatus[server] = true;
            else healthStatus[server] = false;
        })
        .catch(()=>{
            healthStatus[server] = false
        })
        .finally(()=>{
            healthyServers = servers.filter((s)=>healthStatus[s])
        })
    })
}

setInterval(healthCheck, 2000)

const server = createServer((req, res)=>{
    if (healthyServers.length === 0) {
        res.writeHead(503);
        return res.end('No healthy servers available');
      }
    const targetServer = healthyServers[current % healthyServers.length]
    current = (current+1) % healthyServers.length
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