let flowers =[];

let socket;
let draggingFlower = null;
let socketInitialized = false; // 标志，表示 socket 是否初始化完成
let watering = false; // 是否显示水壶
let pouring = false; // 是否正在浇水
let waterParticles = []; // 用于存储水滴粒子
let wateringCan = { x: 200, y: 200, angle: 0 }; // 水壶的初始位置和角度
let span = {x: 200, y: 200};
let bgImage;
let currentFlower = null; // 当前正在放置的花朵
let isFlowerPlanted = false; // 标记是否已经固定花朵
let spanning = false;
let canPlant = false;
let bee = {
  x: 0,
  y: 200,
  size: 25,
  speed: 2,
  wingAngle: 0,
  wingFlapSpeed: 0.2,
  visible: true,
  oscillationHeight:20,
  oscillationSpeed: 0.5,
};
let oscillationAngle = 0;
let wingAnimationTime = 0;

function preload() {
  bgImage = loadImage('https://cdn.glitch.global/8c93b6c9-9dc6-4089-8240-b26b2c58c581/pots_v05.png?v=1730724313078');
}

function setup() {
  createCanvas(windowWidth, windowHeight).parent('sketch-holder');
  let sprite = createSprite(400, 300, 50, 50);
  sprite.shapeColor = color(255, 0, 0);
  //world.gravity.y = 9.8;
  image(bgImage, 0, 0, width, height);
  
    
  if (window.socket) {
    console.log("initialize success");
    
    socket = window.socket;
    socket.on('msg', (data) => {
      createNewFlower(data);
    });
 
    socket.on('initialFlowers', (data) => {
      flowers = data; // Load initial flowers from server
      flowers.forEach((flower) => {
        createNewFlower(flower);
        console.log("get the initialflowers");// 初始化花朵
        socketInitialized = true;
      });
    });
  } 
  else {
    console.error("Socket is not defined. Ensure app.js is loaded before sketch.js.");
  }
  let button = createButton('Watering');
  button.position(10, 10);
  button.mousePressed(() => {
    // 显示水壶
    pouring = false;  // 确保初始时不开始浇水
    wateringCan.angle = 0;
    setTimeout(() => {
      // 延迟 50ms 后允许浇水
      watering = true;
    }, 50);
  });
  let button2 = createButton('spanning');
  button2.position(150, 10);
  button2.mousePressed(() => {
    // 显示水壶
    spanning = false;  // 确保初始时不开始浇水
    
    setTimeout(() => {
      // 延迟 50ms 后允许浇水
      spanning = true;
    }, 50);
  });
}

function createNewFlower(data) {
  //console.log("get in the create correctly");
  let flower = createSprite(random(50, 350), random(200, 350), 20, 40); // 使用 p5.play 的 createSprite 创建花朵
  flower.id = data.id;
  flower.name = data.name;
  flower.message = data.message;
  //console.log("the message is ",flower.message);
  flower.type = data.plant;
  flower.ifplanted = data.ifplanted;
  //flower.x=data.x;
  //flower.y=data.y;
  flower.force=random(5,15);
  flower.frequency=random(0.5,0.8);
  flower.canDraw = true;
  flower.size = 1;
  if(flower.ifplanted == true)
  {
    flower.x =data.x;
    flower.y =data.y;
  }
  else{currentFlower=flower;}
  flower.barrage = {
  text: `${flower.name}: ${flower.message}`,
  x: flower.x,
  y: flower.y - 30,
  opacity: 255
  };
  flower.canDraw = true;
  flower.draw = function () 
  {
    // 计算摆动角度和控制偏移量
    let sway = sin(frameCount *flower.frequency + flower.x * 0.1) * flower.force; // Subtle sway angle (increase sway effect)
    let controlOffset = sway * 1.5; // Adjust the curvature amount
    //let isFlowerPlanted = flower.ifplanted;
         //console.log(flower.frequency);
    // 绘制花茎部分
    stroke(34, 139, 34);
    strokeWeight(6); // 增加花茎的粗细
    noFill();
    beginShape();
    vertex(0, 0); // Bottom of the stem
    quadraticVertex(controlOffset, -30, sway, -60); // Curve control and top point (increased length)
    endShape();

    // 绘制花瓣部分
    noStroke();
    fill(255, 182, 193);
    push();
    translate(sway, -30*flower.size); // 调整花瓣的高度
    ellipse(-10*flower.size, -10*flower.size, 10*flower.size, 10*flower.size); // 增加花瓣的大小
    ellipse(10*flower.size, -10*flower.size, 10*flower.size, 10*flower.size);
    ellipse(0, -20*flower.size, 12.5*flower.size, 12.5*flower.size); // 变大中心花瓣
    ellipse(0, -5*flower.size, 10*flower.size, 10*flower.size); // 变大底部花瓣
    fill(255, 215, 0);
    ellipse(0, -12.5*flower.size, 6*flower.size, 6*flower.size); // 增大花朵中心
    if (typeof flower.draw !== 'function') {
        console.error('Error: flower does not have a draw method:', flower);
    }
    pop();
};
  
  
  // 将绘制逻辑直接添加到 flower 的 draw 方法中
//   flower.draw = function () {
//     // 计算摆动角度和控制偏移量
//     let sway = sin(frameCount *flower.frequency + this.position.x * 0.1) * flower.force; // Subtle sway angle (increase sway effect)
//     let controlOffset = sway * 1.5; // Adjust the curvature amount
//     let isFlowerPlanted = flower.ifplanted;

//     // 绘制花茎部分
//     stroke(34, 139, 34);
//     strokeWeight(6); // 增加花茎的粗细
//     noFill();
//     beginShape();
//     vertex(0, 0); // Bottom of the stem
//     quadraticVertex(controlOffset, -30, sway, -60); // Curve control and top point (increased length)
//     endShape();

//     // 绘制花瓣部分
//     noStroke();
//     fill(255, 182, 193);
//     push();
//     translate(sway, -60); // 调整花瓣的高度
//     ellipse(-20, -20, 20, 20); // 增加花瓣的大小
//     ellipse(20, -20, 20, 20);
//     ellipse(0, -40, 25, 25); // 变大中心花瓣
//     ellipse(0, -10, 20, 20); // 变大底部花瓣
//     fill(255, 215, 0);
//     ellipse(0, -25, 12, 12); // 增大花朵中心
//     pop();
// };
  

  // if(flower.message!=undefined)
  flowers.push(flower);
  // console.log("花朵创建入栈成功");
  // console.log(flower);}
}

function draw() {
if (socketInitialized) {
    image(bgImage, 0, 0, width, height);

    // 绘制花朵
    console.log(flowers);
    for (let flower of flowers) {
      if (flower.ifplanted == false) 
      {
        flower.x = mouseX;
        flower.y = mouseY;
        currentFlower = flower;
        flower.draw();
      }
      flower.draw();
      
      if (dist(mouseX, mouseY, flower.x, flower.y) < 25) {
        fill(255);
        noStroke();
        text(`${flower.name}: ${flower.message}`, flower.x, flower.y - 10);
      }

      if (watering) {
    wateringCan.x = mouseX;
    wateringCan.y = mouseY;

    drawWateringCan(wateringCan.x, wateringCan.y, wateringCan.angle); // 绘制水壶
  }

      if (pouring) {
    // 每一帧都生成水滴粒子
    createWaterParticles();
    updateWaterParticles();
    drawWaterParticles();
    for (let i = waterParticles.length - 1; i >= 0; i--) {
      let particle = waterParticles[i];
      for (let flower of flowers) {
        if (dist(particle.x, particle.y, flower.x, flower.y) < 30) {
          // 让花朵生长
          flower.size = (flower.size || 1) + 0.001; // 增长花朵的大小
          flower.size = min(flower.size, 2); // 限制最大大小为2倍
          flower.frequency +=0.0001;
          waterParticles.splice(i, 1); // 移除水滴
//           if (flower.size ==2){
//             fill(255, 255, 255, flower.barrage.opacity);
//             noStroke();
//             textAlign(CENTER);
//             text(flower.barrage.text, flower.barrage.x, flower.barrage.y);

//             // 弹幕逐渐上移并淡出
//             flower.barrage.y -= 1;
//             flower.barrage.opacity -= 2;

//             // 移除淡出完成的弹幕
//             if (flower.barrage.opacity <= 0) {
//             flower.barrage = null;
//             }
//         }
          flower.draw();
          break;
        }
      }
    }
  }
    
      if(spanning){
    span.x=mouseX;
    span.y=mouseY;
    drawShovel(span.x,span.y);
  }
    }
  drawSprites(); // 通过 p5.play 的 drawSprites 来绘制所有精
  
  //bee
  if(bee.visible){
      drawBee(bee.x, bee.y, bee.size, bee.wingAngle);
      updateBee();
  }

}
}



function drawShovel(x, y) {
  push();
  translate(x, y);
  rotate(240);
  // 绘制铲头（尖头铲，强调钢铁材质和尖锐形状）
  fill(180, 180, 180);  // 金属灰
  stroke(100, 100, 100);
  strokeWeight(4);
  
  // 绘制尖头铲的三角形头部
  beginShape();
  vertex(0, -80);     // 尖头的顶点
  vertex(60, 40);     // 右下角
  vertex(-60, 40);    // 左下角
  endShape(CLOSE);

  // 绘制铲柄（一体设计，与铲头连接）
  fill(150, 150, 150);  // 稍暗的金属色
  rect(-10, 40, 20, 180); // 铲柄的矩形，连接铲头

  // 末端的细节部分
  fill(100, 100, 100);
  beginShape();
  vertex(-15, 220);  // 铲柄底部
  vertex(15, 220);   // 铲柄底部
  vertex(30, 240);   // 向下延伸部分
  vertex(-30, 240);  // 向下延伸部分
  endShape(CLOSE);

  // 绘制铲柄握持区域的防滑纹理（简化的线条）
  stroke(50, 50, 50);
  strokeWeight(3);
  line(-8, 60, -8, 100); // 防滑纹理1
  line(8, 60, 8, 100);   // 防滑纹理2
  line(-8, 120, -8, 160); // 防滑纹理3
  line(8, 120, 8, 160);   // 防滑纹理4
  line(-8, 180, -8, 200); // 防滑纹理5
  line(8, 180, 8, 200);   // 防滑纹理6

  pop();
}

function drawWateringCan(x, y, angle) {
  push();
  translate(x, y);
  rotate(angle); // 使水壶跟随鼠标角度

  // 茶壶主体：缩小尺寸
  noStroke();
  fill(255, 220, 185); // 主体的基本颜色
  stroke(200, 150, 100);
  strokeWeight(2);
  ellipse(0, 0, 80, 60); // 缩小后的茶壶主体

  // 绘制茶壶的渐变效果
  let gradient = drawingContext.createRadialGradient(0, 0, 30, 0, 0, 60);
  gradient.addColorStop(0, 'rgba(255, 220, 185, 1)');
  gradient.addColorStop(1, 'rgba(200, 150, 100, 1)');
  drawingContext.fillStyle = gradient;
  ellipse(0, 0, 80, 60); // 重新绘制主体以应用渐变

  // 茶壶壶嘴：优雅弯曲
  fill(200, 150, 100); // 暖色系颜色
  beginShape();
  vertex(40, -3); // 壶嘴的起始点
  bezierVertex(50, -40, 60, 10, 40, 10); // 使用贝塞尔曲线来画弯曲的壶嘴
  endShape(CLOSE);

  // 茶壶把手：更小的椭圆形把手
  fill(255, 220, 185); // 颜色稍深一些
  stroke(200, 150, 100);
  strokeWeight(6);
  noFill();
  beginShape();
  // 调整把手为椭圆的一部分，弧度更大
  arc(-45, -5, 15,25 , 5*PI / 12, -4*PI / 12); // 更大的弧度，调整大小和角度
  endShape();

  // 茶壶壶盖：圆顶，带有小把手
  fill(255, 220, 185); // 壶盖的颜色可以和主体相同
  strokeWeight(4);
  ellipse(0, -30, 50, 13); // 缩小后的壶盖
  fill(180, 120, 80); // 壶盖的小把手
  ellipse(0, -40, 12, 12); // 壶盖把手

  pop();
}

function mousePressed() {
  // 判断鼠标是否点击到某朵花朵，开始拖拽
  // for (let flower of flowers) {
  //   if (dist(mouseX, mouseY, flower.x, flower.y) < 25) {
  //     flower.isDragging = true;
  //     draggingFlower = flower;
  //     break;
  //   }
  // }
  
  if(canPlant){
     //console.log(isFlowerPlanted+ " + "+currentFlower);
    //console.log(canPlant);
  if (!isFlowerPlanted&&currentFlower) {
    setTimeout(10);
    // Fix the flower's position
    currentFlower.x = mouseX;
    currentFlower.y = mouseY;
    currentFlower.ifplanted=true;

    isFlowerPlanted = true; // Mark the flower as planted
    canPlant = false;
    console.log("update the flower");
    socket.emit('update', {name:currentFlower.name,message:currentFlower.message,flowertype:currentFlower.type,x: currentFlower.x, y: currentFlower.y,ifplanted:isFlowerPlanted}); // Send new flower position to server
  }
  }
  if (watering && !pouring) {
    // 点击后，开始浇水
    wateringCan.angle = 0.5;
    setTimeout(() => {
      pouring = true;
      createWaterParticles(); // 开始生成水滴
    }, 10);
    
     // 倾斜水壶
    setTimeout(() => {
      // 持续生成水滴粒子
      createWaterParticles();
    }, 300);

    setTimeout(() => {
      // 1秒后停止浇水并隐藏水壶
      watering = false;
      pouring = false;
      waterParticles = [];
    }, 5000);
  }
  // if (!isFlowerPlanted && currentFlower) {
  //   currentFlower.position.x = mouseX;
  //   currentFlower.position.y = mouseY;
  // }
  
  // Check if the bee is visible and the mouse is within its body
  if (bee.visible && dist(mouseX, mouseY, bee.x, bee.y) < bee.size / 2) {
    bee.visible = false; // Make the bee disappear
    
    // Reappear after 5 seconds
    setTimeout(() => {
      bee.visible = true;
      bee.x = -bee.size; // Reset position
      bee.y = random(50, height - 50); // Randomize y position
    }, 5000);
  }
 
}

// function mouseReleased() {
//   // 停止拖拽
//   if (draggingFlower) {
//     draggingFlower.isDragging = false;
//     draggingFlower = null;
//   }
// }

function createWaterParticles() {
  let count = 16; // 每帧生成40个水滴粒子
  let angleStart = -15; // 水流起始角度
  let angleEnd = 15; // 水流结束角度
  let angleRange = angleEnd - angleStart;
  for (let i = 0; i < count; i++) {
    // 计算水滴的角度，确保它们在 -15° 到 +15° 范围内
    let angle = radians(random(angleStart, angleEnd));
    
    // 基于角度生成水滴的水平和垂直速度
    let vx = cos(angle) * random(1, 3);  // 水平速度
    let vy = sin(angle) * random(-3, -1); // 垂直速度
    
    let particle = {
      x: wateringCan.x + 55,
      y: wateringCan.y+10,
      vx: vx,
      vy: vy,
      size: random(4, 6), // 增加水滴的大小
      life: 60 // 生命周期（帧数）
    };
    waterParticles.push(particle);
  }
}

function updateWaterParticles() {
  for (let i = waterParticles.length - 1; i >= 0; i--) {
    let particle = waterParticles[i];
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx -= 0.01;
    particle.vy += 0.15;
    particle.life--;
    if (particle.life <= 0) {
      waterParticles.splice(i, 1); // 删除寿命到期的水滴
    }
  }
}

function drawWaterParticles() {
  for (let particle of waterParticles) {
    fill(173, 216, 230,150);
    noStroke();
    ellipse(particle.x, particle.y, particle.size, particle.size);
  }
}

function drawBee(x, y, size, wingAngle) {
  // Body
  stroke(0);
  fill(255, 204, 0); 
  ellipse(x, y, size, size * 0.9);

  // Stripes
  fill(0);
  rect(x - size*0.35 , y - size * 0.3, size*0.8, size * 0.05);
  rect(x - size*0.45 , y - size * 0.15, size*0.9, size * 0.05);
  rect(x - size*0.45, y + size * 0.01, size * 0.9, size * 0.05);
  rect(x - size*0.45, y + size * 0.18, size * 0.9, size * 0.05);


  // Wings
  fill(255, 255, 255, 150); // Transparent white
  push();
  translate(x, y);
  rotate(wingAngle);
  ellipse(size * 0.3, -size * 0.4, size * 0.6, size * 0.3); // Right wing
  rotate(-2 * wingAngle);
  ellipse(-size * 0.3, -size * 0.4, size * 0.6, size * 0.3); // Left wing
  pop();

  // Eye
  fill(255);
  ellipse(x + size * 0.5, y - size * 0.2, size * 0.48); 
  ellipse(x + size * 0.2, y - size * 0.2, size * 0.5); 
  
  fill(0);
  ellipse(x + size * 0.6, y - size * 0.2, size * 0.1);
  ellipse(x + size * 0.3, y - size * 0.2, size * 0.1);
}

function updateBee() {
  // Move the bee across the canvas
  bee.x += bee.speed;
  
  //Flap wings
  wingAnimationTime += bee.wingFlapSpeed;
  bee.wingAngle = sin(wingAnimationTime) * QUARTER_PI;
  
  //Oscillate
  oscillationAngle += bee.oscillationSpeed;
  bee.y = 200 + sin(oscillationAngle) * bee.oscillationHeight * 10;
  //console.log(oscillationAngle + "+" + bee.oscillationHeight);
  
  // Reset position if it goes off-screen
  if (bee.x - bee.size / 2 > width) {
    bee.x = -bee.size;
    bee.y = random(50, height - 50);
  }
}



function windowResized() {
  // 确保窗口尺寸变化时画布能适配
  resizeCanvas(windowWidth, windowHeight);
}
