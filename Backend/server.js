import http from 'http'
import {Server} from 'socket.io'
import app from './src/app.js'

const server = http.createServer(app)

export const io = new Server(server , {
    cors : {
        origin : '*'
    }
})

io.on("connection" ,(socket) => {
    console.log("User Connected : ", socket.id)

    socket.on("join-user",(userId) => {
        socket.join(userId)
    })

    socket.on("join-department", (departmentId) => {
        socket.join(departmentId)
        console.log(`Socket ${socket.id} joined department ${departmentId}`)
    })

    socket.on("disconnect" , () => {
        console.log("User Disconnected")
    })
})

server.listen(3000, () => {
    console.log("Server is live on port http://localhost:3000")
})


