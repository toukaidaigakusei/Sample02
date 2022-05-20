//************************************************** 
//以下はライブラリ

//線を描く関数
//引数：　始点x,y 終点x,y 色 太さ
function drawLine(ctx,x1,y1,x2,y2,color="black",width=1){
    //色指定
    ctx.strokeStyle = color;
    //太さ指定
    ctx.lineWidth = width;
    //線を描くための手順
    ctx.beginPath();//パスを開始
    ctx.moveTo(x1,y1); //始点に移動
    ctx.lineTo(x2,y2); //終点に移動
    ctx.closePath(); // パスを閉じる
    ctx.stroke(); //描写
}

//円を描く
function drawCircle(ctx, cx,cy,r, color="black", width = 1){
     //色指定
     ctx.strokeStyle = color;
     //太さ指定
     ctx.lineWidth = width;
     //線を描くための手順
     ctx.beginPath();//パスを開始
     ctx.arc(cx,cy,r,0,Math.PI * 2,true);
     ctx.stroke(); //描写
}

//円を塗りつぶす
function drawCircleFill(ctx, cx,cy,r, color="black", width = 1){
    //色指定
    //ctx.strokeStyle = color;
    //塗りつぶす中の色
    ctx.fillStyle = color;
    //太さ指定
    ctx.lineWidth = width;
    //線を描くための手順
    ctx.beginPath();//パスを開始
    ctx.arc(cx,cy,r,0,Math.PI * 2,true);
    ctx.fill(); //描写
}

