// Zealery battle

var debug = true;
var count = 5;
var times = 10;
var round = 1;
var duration = 3;
var second = duration - 1;
var imgPre = "http://www.revoemag.com/img";
var itemPool = [
    {id: 0, img: "/item/item19.jpg",desc: "Zara Super De-Coldy Jacket"},
    {id: 1, img: "/item/item18.jpg",desc: "Wild Bunch Urbane Garment Hoodie"},
    {id: 2, img: "/item/item10.jpg",desc: "Dickies Silky Hoodie Dark Blue"},
    {id: 3, img: "/item/item24.jpg",desc: "H&M Red Heart Designing T-Shirt"},
    {id: 4, img: "/item/item17.jpg",desc: "Camel Bussiness Polo"}
];
var timer;
var dict = new Array(count);
var score = new Array(count);
var done = new Array(count);
for(var i=0; i<dict.length; ++i) {
    dict[i] = new Array(count);
    for(var j=0; j<dict[i].length; ++j) {
        dict[i][j] = 0;
    }
}
for(var i=0; i<dict.length; ++i) {
    dict[i][i] = -1;
}
for(var i=0; i<score.length; ++i) {
    score[i] = 0;
}
for(var i=0; i<done.length; ++i) {
    done[i] = count - 1;
}
debug && console.log("Initializing Done.\n");
debug && printToConsole();

function clean() {
    debug && console.log("Doing cleaning up.");
    document.getElementById("spanRound").innerHTML = "0";
    //document.getElementById("spanLeft").innerHTML = "X";
    //document.getElementById("spanRight").innerHTML = "Y";
    document.getElementById("hdnLeftId").value = -1;
    document.getElementById("hdnRightId").value = -1;
    //document.getElementById("divLeft").style.backgroundColor = "black";
    //document.getElementById("divRight").style.backgroundColor = "black";
}

function start() {
    debug && console.log("Game is starting.");
    document.getElementById("btnStart").style.display = "none";
    document.getElementById("btnStop").style.display = "block";
    document.getElementById("spanClock").innerHTML = "<b>" + duration + "</b>";
    document.getElementById("spanRound").innerHTML = "<b>" + round + "</b>";
    timer = setInterval(function(){ timerDone(); }, 1000);
    loadTwo(0, 1);
    document.getElementById("divBattle").style.display = "block";
}

function stop(stoppedbyUser) {
    var line = stoppedbyUser ? "Game is stopped by user." : "Game over because it's done.";
    debug && console.log(line);
    clearInterval(timer);
    //document.getElementById("btnStart").disabled = false;
    document.getElementById("btnStop").style.display = "none";
    document.getElementById("spanClock").innerHTML = "";
}

function timerDone() {
    document.getElementById("spanClock").innerHTML = "<b>" + second-- + "</b>";
    if(second < 0) {
        second = duration;
        next();
    }
}

function gameOver() {
    debug && console.log("Game over.");
    stop(false);
    //document.getElementById("divLeft").onclick = null;
    //document.getElementById("divRight").onclick = null;
    var result = new Array(count);
    var scoreTemp = new Array(count);
    for(var i=0; i<count; ++i) {
        result[i] = 0;
        scoreTemp[i] = score[i];
    }
    for(var i=0; i<result.length; ++i) {
        var maxScore = -1;
        var maxIndex = -1;
        for(var j=0; j<scoreTemp.length; ++j) {
            if(scoreTemp[j] > maxScore) {
                maxScore = scoreTemp[j];
                maxIndex = j;
            }
        }
        result[i] = maxIndex;
        scoreTemp[maxIndex] = -1;
    }
    var retHtml = "";
    var line = "";
    for(var i=0; i<result.length; ++i) {
        line += result[i] + " ";
        retHtml += "<div class='item bat-res-item ng-scope' ><div class='pic'><img src='"+imgPre+itemPool[result[i]].img +"'></div>"+
        "<div class='info'><h3><a href='#' class='ng-binding'>"+itemPool[result[i]].desc+"</a></h3></div>"+
        "<div class='res'>No.<b class='ng-binding'>"+(i+1)+"</b></div><div class='btns'>"+
        "<div class='icon icon-36 icon-close icon-btn'></div><div class='icon icon-36 icon-wish icon-btn'></div>"+
        "<div class='icon icon-36 icon-cart icon-btn'></div></div><div class='clear'></div></div>";
    }
    document.getElementById("divRetInner").innerHTML = retHtml;
    debug && console.log(line);
    document.getElementById("divBattle").style.display = "none";
    document.getElementById("divResult").style.display = "block";
    clean();
}

function process(winner, loser) {
    debug && console.log("winner[" + winner + "] and loser[" + loser + "]");
    score[winner] += 1;
    dict[winner][loser] = dict[loser][winner] = 1;
    done[winner] -= 1;
    done[loser] -= 1;
    debug && printToConsole();

    document.getElementById("spanClock").innerHTML = "<b>" + duration + "</b>"
    clearInterval(timer);
    second = duration - 1;
    timer = setInterval(function(){ timerDone(); }, 1000);
    next();
}

function next() {
    document.getElementById("spanRound").innerHTML = "<b>" + (++round) + "</b>";
    debug && console.log("---------------------");
    debug && console.log("Round: " + round);
    if(round > times) {
        gameOver();
        return;
    }

    var rowCount = 0;
    for(var i=0; i<done.length; ++i) {
        if(done[i] > 0) {
            rowCount += 1;
        }
    }
    if(rowCount > 0) {
        var rowList = new Array(rowCount);
        var rowIndex = 0;
        for(var i=0; i<done.length; ++i) {
            if(done[i] > 0) {
                rowList[rowIndex++] = i;
            }
        }
        debug && console.log(rowList.length + " Rows to pickup.");
        var nextRowIndex = randomNext(rowList);
        debug && console.log("Pick up row " + nextRowIndex);

        var colCount = 0;
        for(var i=0; i<dict[nextRowIndex].length; ++i) {
            if(dict[nextRowIndex][i] == 0) {
                colCount += 1;
            }
        }
        if(colCount > 0) {
            var colList = new Array(colCount);
            var colIndex = 0;
            for(var i=0; i<dict[nextRowIndex].length; ++i) {
                if(dict[nextRowIndex][i] == 0) {
                    colList[colIndex++] = i;//dict[nextRowIndex][i];
                }
            }
            debug && console.log(colList.length + " Columns to pickup.");
            var nextColIndex = randomNext(colList);
            debug && console.log("Pick up column " + nextColIndex);
            loadTwo(nextRowIndex, nextColIndex);
        } else {
            alert("You should not be here. Something is wrong...");
        }
    } else {
        gameOver();
    }
}

function randomNext(list) {
    if(list == undefined || list.length == 0) return 0;
    if(list.length == 1) return list[0];
    var num = Math.floor(Math.random() * list.length);
    if(debug) {
        var line = "";
        for(var i=0; i<list.length; ++i) {
            line += list[i] + " ";
        }
        console.log("Got random index["+num+"] from list["+line+"]");
    }
    return list[num];
}

function loadTwo(leftId, rightId) {
    var left = itemPool[leftId];
    var right = itemPool[rightId];
    document.getElementById("descLeft").innerHTML = left.desc;
    document.getElementById("descRight").innerHTML = right.desc;
    document.getElementById("hdnLeftId").value = left.id;
    document.getElementById("hdnRightId").value = right.id;
    document.getElementById("picLeft").src = imgPre + left.img;
    document.getElementById("picRight").src = imgPre + right.img;
}

function printToConsole() {
    for(var i=0; i<dict.length; ++i) {
        var line = "";
        for(var j=0; j<dict[i].length; ++j) {
            line += (dict[i][j] + " ");
        }
        console.log(line);
    }
    console.log("");
    var line = "";
    for(var i=0; i<score.length; ++i) {
        line += (score[i] + " ");
    }
    console.log(line);
    line = "";
    for(var i=0; i<done.length; ++i) {
        line += (done[i] + " ");
    }
    console.log(line);
    console.log("");
}


function chooseLeft() {
    process(document.getElementById("hdnLeftId").value, document.getElementById("hdnRightId").value)
}

function chooseRight() {
    process(document.getElementById("hdnRightId").value, document.getElementById("hdnLeftId").value)
}
