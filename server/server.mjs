import { create } from "domain";
import { createServer } from "http";
import {Server} from "socket.io";

import { exec } from "child_process";
const httpServer=createServer();
function runiperf3server(){
    return new Promise((resolve,reject)=>{
        let command=`iperf3.exe -s `;
        

        exec(command,(error,stdout,stderr)=>{
            if(error){
                reject(error);
            }
            else{
                resolve({stdout,stderr});
            }
        })
    })
}
function runiperf3client(serverhost,options={}){
    return new Promise((resolve,reject)=>{
        let command=`iperf3.exe -c ${serverhost}`;
        if (options && typeof options === 'object') {
            Object.keys(options).forEach(key => {
                command += ` -${key} ${options[key]}`;
            });
        }

        exec(command,(error,stdout,stderr)=>{
            if(error){
                reject(error);
            }
            else{
                resolve({stdout,stderr});
            }
        })
    })
}

const io=new Server(httpServer,{
    cors:{
        origin:"*",
        methods: ["GET", "POST"],
    }
})
io.on("connection",(socket)=>{
    

    //Server Connection
    socket.on("StartServer",()=>{
        console.log("Server Start button clicked");
        runiperf3server()
        .then(({stdout,stderr})=>{
            console.log({stdout,stderr});
            io.emit("stdoutserver",stdout);
        })
        .catch(error=>{
            console.log(error);
            io.emit("errorserver",error);
        });
        io.emit("ServerStarted","Server is on");
    })

    //Client Connection
    socket.on("StartClient",()=>{
        const serverhost='localhost';
        const options={
            t:10,
        }

        runiperf3client(serverhost,options)
        .then(({stdout,stderr})=>{
            console.log({stdout,stderr});
            io.emit("stdout",stdout);
            io.emit("stderr",stderr);
        })
        .catch(error=>{
            console.log(error);
            io.emit("error",error);
        })
    })
})
httpServer.listen(5000,()=>{
    console.log("Connected")
});