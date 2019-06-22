var canvasWidth = 800;
var canvasHeight = canvasWidth;
var isMouseDown = false;
var lastLoc = {x: 0, y: 0};
var lastTimestamp = 0;
var lastLineWidth = -1;
var strokeStyle = 'black';

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

canvas.width = canvasWidth;
canvas.height = canvasHeight;

drawGrid();

var clear = document.getElementById('clear_btn');
clear.addEventListener('click', function(e) {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    drawGrid();
})

var btns = document.getElementsByClassName('color_btn');
for(var i = 0; i<btns.length; i++){
    btns[i].onclick = function(ind){
        return function(){
            addClass(this, "color_btn_selected");
            strokeStyle = window.getComputedStyle(this).backgroundColor;
            var sib = siblings(this);
            for(var j = 0; j<sib.length; j++){
                removeClass(sib[j], "color_btn_selected");
            }
        }
    }(i)
}
function addClass(obj, name){       //添加样式函数
    obj.className = obj.className + " " + name;
}
function siblings(obj){    //获取到除当前按钮以外其他按钮
    var sibArr = obj.parentNode.children;
    var sibNewArr = [];
    for(var i = 0;i<sibArr.length;i++){
        if(sibArr[i] != obj){
            sibNewArr.push(sibArr[i]);
        }
    }
    return sibNewArr;     
}
function removeClass(obj, name){   //删除样式函数
    var classStr = obj.className;
    var classArr = classStr.split(" ");
    var classNewArr = [];
    for(var i = 0;i<classArr.length;i++){
        if(classArr[i] != name){
            classNewArr.push(classArr[i]);
        }
    }
    obj.className = classNewArr.join(" ");
}

canvas.onmousedown = function(e) {
    e.preventDefault();
    isMouseDown = true;
    lastLoc = windowToCanvas(e.clientX, e.clientY);
    lastTimestamp = new Date().getTime();
}
canvas.onmouseup = function(e) {
    e.preventDefault();
    isMouseDown = false;
}
canvas.onmouseout = function(e) {
    e.preventDefault();
    isMouseDown = false;
}
canvas.onmousemove = function(e) {
    e.preventDefault();
    if (isMouseDown) {
        var curLoc = windowToCanvas(e.clientX, e.clientY);
        var curTimestamp = new Date().getTime();
        var s = calcDistance(curLoc, lastLoc);
        var t = curTimestamp - lastTimestamp;

        var lineWidth = calcLineWidth(t, s);
        // draw
        context.beginPath();

        context.moveTo(lastLoc.x, lastLoc.y);
        context.lineTo(curLoc.x, curLoc.y);

        context.strokeStyle = strokeStyle;
        context.lineWidth = lineWidth;
        context.lineCap = 'round';
        context.lineJoin = 'round';

        context.stroke();

        lastLoc = curLoc;
        lastTimestamp = curTimestamp;
        lastLineWidth = lineWidth;
    }
}

function calcDistance(loc1, loc2) {
    return Math.sqrt((loc1.x - loc2.x)*(loc1.x - loc2.x) + (loc1.y - loc2.y)*(loc1.y - loc2.y));
}

var maxLineWidth = 30;
var minLineWidth = 1;
var maxStrokeV = 10;
var minStrokeV = 0.1;
function calcLineWidth(t, s) {
    var v = s / t;
    var result;
    if (v < minStrokeV) {
        result = maxLineWidth;
    } else if(v >= maxStrokeV) {
        result = minLineWidth;
    } else {
        result = maxLineWidth - (v-minStrokeV)/(maxStrokeV-minStrokeV)*(maxLineWidth-minLineWidth);
    }

    if (lastLineWidth === -1) {
        return result;
    }

    return lastLineWidth*5/6 + result*1/6;
}

function windowToCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {
        x: x - bbox.left,
        y: y - bbox.top
    }
}

function drawGrid() {
    context.save();
    context.strokeStyle='rgb(230, 11, 9)';

    context.beginPath();
    context.moveTo(3, 3);
    context.lineTo(canvasWidth - 3, 3);
    context.lineTo(canvasWidth - 3, canvasHeight - 3);
    context.lineTo(3, canvasHeight - 3);
    context.closePath();

    context.lineWidth = 6;
    context.stroke();

    context.beginPath();

    context.moveTo(0, 0);
    context.lineTo(canvasWidth, canvasHeight);

    context.moveTo(canvasWidth, 0);
    context.lineTo(0, canvasHeight);

    context.moveTo(canvasWidth/2, 0);
    context.lineTo(canvasWidth/2, canvasHeight);

    context.moveTo(0, canvasHeight/2);
    context.lineTo(canvasWidth, canvasHeight/2);

    context.lineWidth = 1;
    context.setLineDash([6, 6]);
    
    context.stroke();
    context.restore();
}




