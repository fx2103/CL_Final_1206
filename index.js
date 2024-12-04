let express = require('express');
let app = express();
app.use('/', express.static('public'));

let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

let io = require('socket.io')(server);

const fs = require('fs');  // 引入文件系统模块
const dataFile = 'plantedFlowers.json'; // 存储花朵数据的 JSON 文件

// Helper function to load flowers from the JSON file
function loadFlowers() {
    try {
        const data = fs.readFileSync(dataFile, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading the file:', err);
        return [];  // 如果读取失败，返回一个空数组
    }
}

// Helper function to save flowers to the JSON file
function saveFlowers(flowers) {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(flowers, null, 2), 'utf8');
        console.log('Flowers saved to file:', flowers);  // 打印保存的数据
    } catch (err) {
        console.error('Error saving the file:', err);
    }
}

// Initialize plantedFlowers with data from the JSON file
let plantedFlowers = loadFlowers();

// Send the existing flowers to new clients when they connect
io.sockets.on('connection', function (socket) {
    console.log("We have a new client: " + socket.id);

    // Send existing flowers to the new client
    socket.emit('initialFlowers', plantedFlowers);

    // Listen for a message named 'msg' from this client
    socket.on('update', function (data) {
        console.log("Received a 'update' event");
        console.log(data); // Log the complete data object

        const newFlower = {

            name: data.name,
            message: data.message,                 // message should be 'msg'
            flowertype: data.flowerType,  // flowerType should be 'plant'
 
            x: data.x,
            y: data.y,
            ifplanted: data.ifplanted || false // 只有当 ifplanted 为 true 时才保存
        };

        // 只有当 ifplanted 为 true 时才保存花朵
        if (newFlower.ifplanted) {
            plantedFlowers.push(newFlower);
            saveFlowers(plantedFlowers); // 将数据保存到文件
        }

        io.sockets.emit('update', newFlower);  // 广播新的花朵给所有客户端
        
    });
    socket.on('msg', function (data) {
        console.log("Received a 'update' event");
        console.log(data); // Log the complete data object

        const newFlower = {

            name: data.name,
            message: data.message,                 // message should be 'msg'
            flowertype: data.flowerType,  // flowerType should be 'plant'
 
            x: data.x,
            y: data.y,
            ifplanted: data.ifplanted || false // 只有当 ifplanted 为 true 时才保存
        };

        // 只有当 ifplanted 为 true 时才保存花朵
       

        io.sockets.emit('msg', newFlower);  // 广播新的花朵给所有客户端
        
    });
    // Listen for this client to disconnect
    socket.on('disconnect', function () {
        console.log("A client has disconnected: " + socket.id);
    });
});
