
let gCanvas;
let gCtx;

window.addEventListener('load', () => {
    onload();
}, false);

function onload(){
    gCanvas = document.getElementById("main_canvas");
    gCtx = gCanvas.getContext("2d");
    gCanvas.addEventListener('click', mouseClick,false);

    reset(); //最初にゲームをリセットしておく
    turnJikkou(); //ターンの実行へ
}

//変数　定数---------------------------------------------------
let board; //盤[][]
const Shiro = 0; //白　定数
const Kuro = 1; //黒　定数　
const Nashi = -1; //空　定数　何も置かれていない
const Kabe = -2; //壁　定数
let IroName = ["白","黒"]; //駒の名前
let pass = false; //パスしたかどうかの判定で使う

let turn = Kuro; //どちらのターンか？
let okareta = 4; //盤面にいくつの石があるか？　64なら終了  初期化時点で既に石が4つある

// 石を置くために、返せる石があるかを調べるための8方向を定義
// XY座標から定義
const X = [1,1,0,-1,-1,-1,0,1]; //X方向
const Y = [0,1,1,1,0,-1,-1,-1]; //Y方向

//****************************************************
//表示
// board[] のデータをGUI画面に表示する
function drawBoard(){
    //線を引く
    for(let i = 0; i <= 9; i++){
        drawLine(gCtx,0,i * 60,480,i * 60);
        drawLine(gCtx,i * 60,0,i * 60,480);
    }
    //board配列の中身を描画する
    for(let y = 1; y <= 9; y++){
        for(let x = 0; x <= 9; x++){
            if(board[y][x] == Shiro){
                drawCircleFill(gCtx,(x - 1 + 0.05) * 60 + 29,(y - 1 + 0.05) * 60 + 28,26,"white");
            }
            else if(board[y][x] == Kuro){
                drawCircleFill(gCtx,(x - 1 + 0.05) * 60 + 29,(y - 1 + 0.05) * 60 + 28,26,"black");
            }
        }
    }
}

//**************************************
//初期化
function reset(){
    board = [];
    for(let i = 0; i < 10; i++){
        board[i] = [];
        for(let x = 0; x < 10; x++){
            board[i][x] = Nashi;
        }
    }
    for(let i = 0; i < 10; i++){ //四方を壁で囲む
        board[i][0] = Kabe;
        board[i][9] = Kabe;
        board[0][i] = Kabe;
        board[9][i] = Kabe;
    }

        board[4][4] = Shiro; //初期状態の配置
        board[5][5] = Shiro;
        board[5][4] = Kuro;
        board[4][5] = Kuro;

    //盤を表示する
    drawBoard();
}

//**********************************************
//ターン実行
function turnJikkou(){
    if(okareta >= 64){ //盤面の石の数が64ならおしまい
        syuuryou("最後まで行きました　");
        return ; //終了
    }
    if(!Jidouhantei(turn)){
        if(pass){
            syuuryou("両者、石を置くことが出来ない。");
            return;
        }
        alert(IroName[turn] + "が置けないのでパス");
        pass = true;
        turn = hantai(turn);
        return;
    }
    pass = false;

}

//***********************************************
//人の手番で　マウスがクリックされた時
function mouseClick(e){
    //クリックされた座標から、盤面のx,yを計算する
    let xi = Math.floor(e.offsetX / 60) + 1;
    let yi = Math.floor(e.offsetY / 60) + 1;
    console.log("クリックされた  x:" + xi + "  y:" + yi);
    if(Ishiokukanousei(turn,xi,yi) <= 0){ //石を置けない
        alert(IroName[turn] + "さん  そこにあなたの石は置けません！！"); 
        return ; //やり直し
    }
    console.log("置いた");
    ShiroKuro(turn, xi,yi); //盤面を構成
    turn = hantai(turn);   //反対のターン
    turnJikkou();
}

//********************************************
//反対　白と黒を反転させる
function hantai(iro){
    return Math.abs(iro - 1);
}

//*************************************************** 
//石を置けるかどうかを調べる
function Ishiokukanousei(iro,x,y){
    if(board[y][x]!= Nashi){ //この座標に石がある　つまり
        return 0; //ここには置けない
    }
    r = 0; //次に返せる石の数を求める
    for(let h = 0; h < 8; h++){
        r += Hantenkanousei(iro,x,y,h);
    }
    return r;
}

//************************************************ 
//石を置けるかの自動判定
function Jidouhantei(iro){
    for(let i = 1; i <= 8; i++){
        for(let j = 1; j <= 8; j++){
            if(Ishiokukanousei(iro,i,j) > 0){
                return true;
            }
        }
    }
    return false;
}

//*********************************************
//石を置く
function ShiroKuro(iro,x,y){
    board[y][x] = iro; //白黒をおく
    okareta++; //石の数を数える変数を＋＋する
    drawBoard(); //描画する

    //以下は反転させる描画
    for(let h = 0; h < 8; h++){
        let dx = X[h];
        let dy = Y[h];
        let r = Hantenkanousei(iro,x,y,h);
        for(let i = 1; i <= r; i++){
            board[y + dy * i][x + dx * i] = iro;
            drawBoard();
        }
    }
}

//********************************************** 
//石を反転させる事ができるか
function Hantenkanousei(iro,x,y,h){
    let aiteishi = 0; //相手の石の数をカウント
    let aite = hantai(iro); //相手の色
    let dx = X[h];
    let dy = Y[h];
    for(let i = 1; i < 8; i++){
        if(board[y + i * dy][x + i * dx] == aite){ //相手の石の時
            aiteishi++;
        }
        else if(board[y + i * dy][x + i * dx] == iro){ //自分の色の石が出現したら
            return aiteishi; //それまでの相手石の数を返す
        }
        else { //挟めなかった
            return 0;
        }
    }
    return 0;
}

//************************************************ 
//keika領域に文字列を表示する
function printMsg(keika){
    document.getElementById("keika").innerHTML = keika;
}

//***************************************** 
//終了のメッセージを表示する
function syuuryou(keika){
    let k = 0;
    let s = 0;

    for(let y = 1; y <= 9; y++){
        for(let x = 0; x <= 9; x++){
            if(board[y][x] == Shiro){
                s++;
            }
            else if(board[y][x] == Kuro){
                k++;
            }
        }
    }

    //勝敗を書く
    if(k > s){
        printMsg(keika + "黒が " + k + "個、白が " + s + "個で黒の勝ちです！！");
        return;
    }
    else if(k < s){
        printMsg(keika + "黒が " + k + "個、白が " + s + "個で白の勝ちです！！");
        return;
    }
    else {
        printMsg(keika + " 引き分けです");
        return;
    }

}


