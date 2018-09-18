<template>
  <div id="app">
    <p>{{msg}}</p>
    <div class="canvas" id="canvas" @drop="drop" @dragover="allowDrop" @mousemove="mouseMove" @click="mouseClick">
      <img class="image-logo" src="./assets/logo.png" draggable="true" @dragstart="drag" @mousewheel="wheel"
           :style="{transform: 'rotate(' + rotate + 'deg)'}">
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import amqp from 'amqp'

  export default {
    name: 'app',
    data() {
      return {
        msg: '테스트 개어렵네',
        imageDom: [],
        dragImage: {},
        dragElement: {},
        rotate: 0,
        draw: {
          mouse: {
            x: 0,
            y: 0,
            startX: 0,
            startY: 0
          },
          element: null
        }
      }
    },
    created: function () {
      let connection = amqp.createConnection({host: '127.0.0.1'})

      // add this for better debuging
      connection.on('error', (e) => {
        console.log("Error from amqp: ", e)
      });

      // Wait for connection to become established.
      connection.on('ready', function () {
        // Use the default 'amq.topic' exchange
        connection.queue('my-queue', function (q) {
          // Catch all messages
          q.bind('#')

          // Receive messages
          q.subscribe(function (message) {
            // Print messages to stdout
            console.log(message)
          })
        })
      })
    },
    mounted: function () {
      this.imageDom = window.document.getElementsByClassName("image-logo");
      this.dragImage = require("./assets/logo.png");
      this.dragElement = window.document.createElement("img");
      this.dragElement.src = this.dragImage;
      this.dragElement.width = 100;
      this.dragElement.height = 100;
    },
    methods: {
      drag: function (ev) {
        ev.dataTransfer.setDragImage(this.dragElement, 50, 50);
      },
      drop: function (ev) {
        this.imageDom[0].style.left = ev.clientX - 50 + "px";
        this.imageDom[0].style.top = ev.clientY - 50 + "px";
        ev.preventDefault();
      },
      allowDrop: function (ev) {
        ev.preventDefault();
      },
      wheel: function (ev) {
        this.rotate += ev.wheelDeltaY;
        if (this.rotate > 360) {
          this.rotate = 360;
        }
        if (this.rotate < 0) {
          this.rotate = 0;
        }
      },
      setMousePosition: function (e) {
        let ev = e || window.event; //Moz || IE
        if (ev.pageX) { //Moz
          this.draw.mouse.x = ev.pageX;
          this.draw.mouse.y = ev.pageY;
        } else if (ev.clientX) { //IE
          this.draw.mouse.x = ev.clientX + window.document.body.scrollLeft;
          this.draw.mouse.y = ev.clientY + window.document.body.scrollTop;
        }
      },
      mouseMove: function (e) {
        this.setMousePosition(e);
        if (this.draw.element !== null) {
          this.draw.element.style.width = Math.abs(this.draw.mouse.x - this.draw.mouse.startX) + 'px';
          this.draw.element.style.height = Math.abs(this.draw.mouse.y - this.draw.mouse.startY) + 'px';
          this.draw.element.style.left = (this.draw.mouse.x - this.draw.mouse.startX < 0) ? this.draw.mouse.x + 'px' : this.draw.mouse.startX + 'px';
          this.draw.element.style.top = (this.draw.mouse.y - this.draw.mouse.startY < 0) ? this.draw.mouse.y + 'px' : this.draw.mouse.startY + 'px';
        }
      },
      mouseClick: function (e) {
        let canvas = window.document.getElementById("canvas");
        if (this.draw.element !== null) {
          this.draw.element.appendChild(this.imageDom[0]);
          this.draw.element = null;
          canvas.style.cursor = "default";
        } else {
          this.draw.mouse.startX = this.draw.mouse.x;
          this.draw.mouse.startY = this.draw.mouse.y;
          this.draw.element = window.document.createElement('div');
          this.draw.element.className = 'rectangle';
          this.draw.element.style.left = this.draw.mouse.x + 'px';
          this.draw.element.style.top = this.draw.mouse.y + 'px';
          canvas.appendChild(this.draw.element);
          canvas.style.cursor = "crosshair";
        }
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .canvas {
    border: red solid 3px;
    width: 3000px;
    height: 200px;
    margin: auto;
  }

  .image-logo {
    position: absolute;
  }

  .rectangle {
    border: 1px solid red;
    position: absolute;
  }
</style>

