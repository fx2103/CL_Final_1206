window.addEventListener("load", function () {
  let socket;

  const welcomePage = document.getElementById('welcomePage');
  const mainPage = document.getElementById('mainPage');
  const enterButton = document.getElementById('enterButton');
  const visitorButton = document.getElementById('visitorButton');
  const nameInput = document.getElementById("name-input");
  const msgInput = document.getElementById("msg-input");
  const plantDropDown = document.getElementById("dropdownMenu");
  const flowerid = 0;
  let isValidInput = false;

  function initializeSocket() {
    socket = io();  // 初始化 socket 连接

    socket.on("connect", function () {
      console.log("Connected to the server");
    });

    //接收服务器广播的花朵数据并创建花朵
    // socket.on("msg", function (data) {
    //   console.log("New flower data received:", data);
    //   createNewFlower(data);  // 创建花朵
    // });

    socket.once("initialFlowers", function (flowers) {
      flowers.forEach((flower) => {
        createNewFlower(flower);  // 初始化花朵
      });
    });

    window.socket = socket;  // 将 socket 对象存储到全局变量
  }

  initializeSocket();

  // 输入框验证函数
  function checkInputs() {
    const name = nameInput.value.trim();
    const message = msgInput.value.trim();
    const plant = plantDropDown.value;

    if (name && message && plant !== "default") {
      isValidInput = true;
      enterButton.disabled = false;
    } else {
      isValidInput = false;
      enterButton.disabled = true;
    }
  }

  // 输入框事件监听
  nameInput.addEventListener("input", checkInputs);
  msgInput.addEventListener("input", checkInputs);
  plantDropDown.addEventListener("change", checkInputs);

 
  enterButton.addEventListener('click', function () {
    if (isValidInput) {
      isFlowerDataSent = true;  // 防止多次点击
      welcomePage.style.display = 'none';
      mainPage.style.display = 'block';

      const name = nameInput.value.trim();
      const message = msgInput.value.trim();
      const plant = plantDropDown.value;
      const ifplanted = false;
      // 将花朵数据发送到服务器
      const flowerData = { name, message: message, flowertype:plant, x: 210, y: 100 ,ifplanted};
      window.socket=socket;
      socket.emit("msg", flowerData);  // 发送花朵数据到服务器
      console.log("Sending flower data:", flowerData);
      
    }
  });

  // 游客按钮点击事件
  visitorButton.addEventListener('click', function () {
    welcomePage.style.display = 'none';
    mainPage.style.display = 'block';
  });
});
