$(()=>{
    console.log('depois de recarregar');
    prepararTabulerio();
});
var tabulerio = $('<div>', {class:'tabuleiro'});
var pieceChess = {};

function createPieceChess(icon, cor, rowInitial, colInitial) {
    if(pieceChess[cor] == undefined) pieceChess[cor] = {};
    if(pieceChess[cor][icon] == undefined) pieceChess[cor][icon] = [];

    pieceChess[cor][icon].push(
        $('<i>', {
            id:`${icon}_${cor}_${pieceChess[cor][icon].length + 1}`, 
            class:`fa-solid fa-chess-${icon} ${cor}`,
            piece:icon,
            rowInitial,
            colInitial,
        }).on('click', onClickPiece)
    );

    return pieceChess[cor][icon][ (pieceChess[cor][icon].length - 1) ];
}

function getPieceBoard(row, col) {
    let res = { value:'', class:'' };
    let mapPositions = {
        0:{ 1:'A', 2:'B', 3:'C', 4:'D', 5:'E', 6:'F', 7:'G', 8:'H' },
        1:{ 0:'1', 1:'rook', 2:'knight', 3:'bishop', 4:'king', 5:'queen', 6:'bishop', 7:'knight', 8:'rook', 9:'1' },
        2:{ 0:'2', 1:'pawn', 2:'pawn', 3:'pawn', 4:'pawn', 5:'pawn', 6:'pawn', 7:'pawn', 8:'pawn', 9:'2' },
        3:{ 0:'3', 9:'3' },
        4:{ 0:'4', 9:'4' },
        5:{ 0:'5', 9:'5' },
        6:{ 0:'6', 9:'6' },
        7:{ 0:'7', 1:'pawn', 2:'pawn', 3:'pawn', 4:'pawn', 5:'pawn', 6:'pawn', 7:'pawn', 8:'pawn', 9:'7' },
        8:{ 0:'8', 1:'rook', 2:'knight', 3:'bishop', 4:'king', 5:'queen', 6:'bishop', 7:'knight', 8:'rook', 9:'8' },
        9:{ 1:'A', 2:'B', 3:'C', 4:'D', 5:'E', 6:'F', 7:'G', 8:'H' },
    };

    if(mapPositions[row] && mapPositions[row][col]) res['value'] = mapPositions[row][col];

    if(col > 0 && col < 9){
        if(row > 0 && row < 3) res['class'] = 'preto';
        if(row > 6 && row < 9) res['class'] = 'branco';
    }

    return res;
}

function prepararTabulerio() {
    tabulerio = $('<div>', {class:'tabuleiro'});

    for (let r = 0; r < 10; r++) {
        let row = $('<div>', {class:`row row_${r}`})
        for (let c = 0; c < 10; c++) {
            let aux = getPieceBoard(r, c);
            let conteudo = ( (aux['value'].length < 2) ? aux['value'] : createPieceChess(aux['value'], aux['class'], r, c) );

            if(r==4 && c==2) conteudo = createPieceChess('bishop', 'preto', r, c);
            if(r==4 && c==4) conteudo = createPieceChess('queen', 'branco', r, c);
            if(r==4 && c==5) conteudo = createPieceChess('knight', 'branco', r, c);
            if(r==5 && c==4) conteudo = createPieceChess('rook', 'branco', r, c);
            if(r==5 && c==5) conteudo = createPieceChess('pawn', 'branco', r, c);

            row.append(
                $('<div>', {class:`col col_${c} ${ (((r + c) % 2) > 0) ? 'W' : 'B' }`, refRow:r, refCol:c}).append(conteudo)
            )
        }
        tabulerio.append(row);
    }

    $('body').append(tabulerio);
}

function onClickPiece() {
    // console.log(this);
    let curPos = getCurrentPosition(this);
    let curPiece = $(this).attr('piece');
    let pieceCor = ( $(this).hasClass('branco') ? 'branco' : 'preto');
    clearMarkings();

    // console.log('posições posiveis', getAllPositions(getCurrentPosition(this), curPiece) );
    getAllPositionsDiff(getCurrentPosition(this), curPiece);

    let markingPositions = rankingPositions(curPiece, pieceCor, getCurrentPosition(this), getAllPositions(getCurrentPosition(this), curPiece));

    //marcando peça no lugar atual
    count = logCount = 0;
    markingSquare(curPos['row'], curPos['col'], 'blue');
    // console.log(markingPositions)

    $.each(markingPositions, (color, positions)=>{
        $.each(positions, (i, pos)=>{
            // console.log(color, pos.row, pos.col, pos.element);
            markingSquare(pos.row, pos.col, color);
        });
    });

    /* switch (curPiece) {
        case 'pawn':
            if(pieceCor == 'branco'){
                markingSquare(curPos['row'] - 1, curPos['col'], 'green');
                markingSquare(curPos['row'] - 1, (curPos['col'] - 1), 'red');
                markingSquare(curPos['row'] - 1, (curPos['col'] + 1), 'red');

                if(curPos['row'] == curPos['rowInitial'])
                    markingSquare(curPos['row'] - 2, curPos['col'], 'green');
            }else{
                markingSquare(curPos['row'] + 1, curPos['col'], 'green');
                markingSquare(curPos['row'] + 1, (curPos['col'] - 1), 'red');
                markingSquare(curPos['row'] + 1, (curPos['col'] + 1), 'red');

                if(curPos['row'] == curPos['rowInitial'])
                    markingSquare(curPos['row'] + 2, curPos['col'], 'green');
            }
        break;
        case 'knight':
            markingSquare(curPos['row'] - 1, (curPos['col'] - 2), 'green');
            markingSquare(curPos['row'] - 1, (curPos['col'] + 2), 'green');
            markingSquare(curPos['row'] - 2, (curPos['col'] - 1), 'green');
            markingSquare(curPos['row'] - 2, (curPos['col'] + 1), 'green');

            markingSquare(curPos['row'] + 1, (curPos['col'] - 2), 'green');
            markingSquare(curPos['row'] + 1, (curPos['col'] + 2), 'green');
            markingSquare(curPos['row'] + 2, (curPos['col'] - 1), 'green');
            markingSquare(curPos['row'] + 2, (curPos['col'] + 1), 'green');
        break;
        case 'bishop':
            for (let i = 1; i < 8; i++) {
                markingSquare(curPos['row'] - i, (curPos['col'] - i), 'green');
                markingSquare(curPos['row'] - i, (curPos['col'] + i), 'green');
                markingSquare(curPos['row'] + i, (curPos['col'] - i), 'green');
                markingSquare(curPos['row'] + i, (curPos['col'] + i), 'green');
            }
        break;
        case 'rook':
            for (let i = 1; i < 8; i++) {
                markingSquare(curPos['row'], (curPos['col'] - i), 'green');
                markingSquare(curPos['row'], (curPos['col'] + i), 'green');
                markingSquare((curPos['row'] - i), curPos['col'], 'green');
                markingSquare((curPos['row'] + i), curPos['col'], 'green');
            }
        break;
        case 'queen':
            for (let i = 1; i < 8; i++) {
                markingSquare(curPos['row'] - i, (curPos['col'] - i), 'green');
                markingSquare(curPos['row'] - i, (curPos['col'] + i), 'green');
                markingSquare(curPos['row'] + i, (curPos['col'] - i), 'green');
                markingSquare(curPos['row'] + i, (curPos['col'] + i), 'green');

                markingSquare(curPos['row'], (curPos['col'] - i), 'green');
                markingSquare(curPos['row'], (curPos['col'] + i), 'green');
                markingSquare((curPos['row'] - i), curPos['col'], 'green');
                markingSquare((curPos['row'] + i), curPos['col'], 'green');
            }
        break;
        case 'king':
            markingSquare(curPos['row'] - 1, (curPos['col'] - 1), 'green');
            markingSquare(curPos['row'] - 1, (curPos['col'] + 1), 'green');
            markingSquare(curPos['row'] + 1, (curPos['col'] - 1), 'green');
            markingSquare(curPos['row'] + 1, (curPos['col'] + 1), 'green');

            markingSquare(curPos['row'], (curPos['col'] - 1), 'green');
            markingSquare(curPos['row'], (curPos['col'] + 1), 'green');
            markingSquare((curPos['row'] - 1), curPos['col'], 'green');
            markingSquare((curPos['row'] + 1), curPos['col'], 'green');
        break;
    } */
}

function rankingPositions(currentPiece, currentPieceColor, currentPosition, allPositions) {
    let res = { blue:[], green:[], red:[], orange:[], yellow:[] };

    // console.log(currentPiece, currentPieceColor, currentPosition, allPositions);
    // console.log( allPositions.length );
    let itemBloqueandoLinha = false;
    $.each(allPositions, (i, pos)=>{
        // console.log(pos);
        let square = tabulerio.find(`.col[refrow="${pos.row}"][refcol="${pos.col}"]`);
        pos.element = square;

        if(pos.row == currentPosition.row){
            res.blue.push(pos);
            // console.log(itemBloqueandoLinha, pos.col, pos)
            // if(itemBloqueandoLinha){
            // }

            // if (square.html().length > 0) {
            //     itemBloqueandoLinha = pos;
            //     // console.log('VERDE');
            //     // res.green.push(pos);
            // }

        }else if(pos.col == currentPosition.col){
            res.yellow.push(pos);
        }else{

            // console.log(square.html().length);
            if (square.html().length == 0) {
                // console.log('VERDE');
                res.green.push(pos);
            }else{
                let piece = square.find('i');
                if(piece.hasClass(currentPieceColor)){
                    // console.log('mesma cor');
                    res.orange.push(pos);
                }else{
                    // console.log('cor do adversario');
                    res.red.push(pos);
                }
                // console.log('Verificar qual item tem', piece);
            }
        }
    });

    // let casasNaMesmaLinha = [];
    // let casasNaMesmaColuna = [];
    // $.each(allPositions, (i,v)=>{
    //     // console.log(i,v);
    //     if(v.row == currentPosition.row) casasNaMesmaLinha.push(v);
    //     if(v.col == currentPosition.col) casasNaMesmaColuna.push(v);
    // });
    // console.log(casasNaMesmaLinha);
    // console.log(casasNaMesmaColuna);
    // console.log(res);
    return res;
}

function getAllPositions(curPos, currentPiece) {
    let res = [];
    switch (currentPiece) {
        case 'pawn':
            if(curPos['rowInitial'] > 4){
                if( isValidOne((curPos['row'] - 1)) ){
                    if( isValidOne(curPos['col']) )
                        res.push( { row: (curPos['row'] - 1), col: curPos['col'], } );
                    if( isValidOne((curPos['col'] - 1)) )
                        res.push( { row: (curPos['row'] - 1), col: (curPos['col'] - 1), } );
                    if( isValidOne((curPos['col'] + 1)) )
                        res.push( { row: (curPos['row'] - 1), col: (curPos['col'] + 1), } );
                }

                if( (curPos['row'] == curPos['rowInitial']) && isValid((curPos['row'] - 2), curPos['col']) )
                    res.push( { row: (curPos['row'] - 2), col: curPos['col'], } );
            }else{
                if( isValidOne((curPos['row'] + 1)) ){
                    if( isValidOne(curPos['col']) )
                        res.push( { row: (curPos['row'] + 1), col: curPos['col'], } );
                    if( isValidOne((curPos['col'] - 1)) )
                        res.push( { row: (curPos['row'] + 1), col: (curPos['col'] - 1), } );
                    if( isValidOne((curPos['col'] + 1)) )
                        res.push( { row: (curPos['row'] + 1), col: (curPos['col'] + 1), } );
                }

                if( curPos['row'] == curPos['rowInitial'] && ( isValid((curPos['row'] + 2), curPos['col']) ))
                    res.push( { row: (curPos['row'] + 2), col: curPos['col'], } );
            }
        break;
        case 'knight':
            if( isValid((curPos['row'] - 1), (curPos['col'] - 2)) )
                res.push( { row: (curPos['row'] - 1), col: (curPos['col'] - 2), } );
            if( isValid((curPos['row'] - 1), (curPos['col'] + 2)) )
                res.push( { row: (curPos['row'] - 1), col: (curPos['col'] + 2), } );
            if( isValid((curPos['row'] - 2), (curPos['col'] - 1)) )
                res.push( { row: (curPos['row'] - 2), col: (curPos['col'] - 1), } );
            if( isValid((curPos['row'] - 2), (curPos['col'] + 1)) )
                res.push( { row: (curPos['row'] - 2), col: (curPos['col'] + 1), } );

            if( isValid((curPos['row'] + 1), (curPos['col'] - 2)) )
                res.push( { row: (curPos['row'] + 1), col: (curPos['col'] - 2), } );
            if( isValid((curPos['row'] + 1), (curPos['col'] + 2)) )
                res.push( { row: (curPos['row'] + 1), col: (curPos['col'] + 2), } );
            if( isValid((curPos['row'] + 2), (curPos['col'] - 1)) )
                res.push( { row: (curPos['row'] + 2), col: (curPos['col'] - 1), } );
            if( isValid((curPos['row'] + 2), (curPos['col'] + 1)) )
                res.push( { row: (curPos['row'] + 2), col: (curPos['col'] + 1), } );
        break;
        case 'king':
        case 'queen':
        case 'bishop':
        case 'rook':
            let limitLoop = 8;
            if(currentPiece == 'king') limitLoop = 2;

            for (let i = 1; i < limitLoop; i++) {
                if(currentPiece != 'rook'){
                    if( isValid((curPos['row'] - i), (curPos['col'] - i)) )
                        res.push( { row: (curPos['row'] - i), col: (curPos['col'] - i), } );
                    if( isValid((curPos['row'] - i), (curPos['col'] + i)) )
                        res.push( { row: (curPos['row'] - i), col: (curPos['col'] + i), } );
                    if( isValid((curPos['row'] + i), (curPos['col'] - i)) )
                        res.push( { row: (curPos['row'] + i), col: (curPos['col'] - i), } );
                    if( isValid((curPos['row'] + i), (curPos['col'] + i)) )
                        res.push( { row: (curPos['row'] + i), col: (curPos['col'] + i), } );
                }

                if(currentPiece != 'bishop'){
                    if( isValid(curPos['row'], (curPos['col'] - i)) )
                        res.push( { row: curPos['row'], col: (curPos['col'] - i), } );
                    if( isValid(curPos['row'], (curPos['col'] + i)) )
                        res.push( { row: curPos['row'], col: (curPos['col'] + i), } );
                    if( isValid((curPos['row'] - i), curPos['col']) )
                        res.push( { row: (curPos['row'] - i), col: curPos['col'], } );
                    if( isValid((curPos['row'] + i), curPos['col']) )
                        res.push( { row: (curPos['row'] + i), col: curPos['col'], } );
                }
            }
        break;
    }

    //ORDENANDO POR COLUNA DEPOIS POR LINHA
    res.sort((a,b) =>  ( (a.col > b.col) ? 1 : ( (a.col < b.col) ? -1 : 0 ) ) )
    .sort((a,b)=> ( (a.row > b.row) ? 1 : ( (a.row < b.row) ? -1 : 0 ) ) );

    // console.warn(res);
    return res;
}
function getAllPositionsDiff(curPos, currentPiece) {
    let res = [];
    let res2 = [];
    switch (currentPiece) {
        case 'queen':
        case 'bishop':
            let limitLoop = 8;
            if(currentPiece == 'king') limitLoop = 2;

            for (let i = 1; i < limitLoop; i++) {
                if(currentPiece != 'rook'){
                    if( isValid((curPos['row'] - i), (curPos['col'] - i)) )
                        res.push( { row: (curPos['row'] - i), col: (curPos['col'] - i), } );
                    if( isValid((curPos['row'] - i), (curPos['col'] + i)) )
                        res.push( { row: (curPos['row'] - i), col: (curPos['col'] + i), } );
                    if( isValid((curPos['row'] + i), (curPos['col'] - i)) )
                        res.push( { row: (curPos['row'] + i), col: (curPos['col'] - i), } );
                    if( isValid((curPos['row'] + i), (curPos['col'] + i)) )
                        res.push( { row: (curPos['row'] + i), col: (curPos['col'] + i), } );
                }

                if(currentPiece != 'bishop'){
                    if( isValid(curPos['row'], (curPos['col'] - i)) )
                        res.push( { row: curPos['row'], col: (curPos['col'] - i), } );
                    if( isValid(curPos['row'], (curPos['col'] + i)) )
                        res.push( { row: curPos['row'], col: (curPos['col'] + i), } );
                    if( isValid((curPos['row'] - i), curPos['col']) )
                        res.push( { row: (curPos['row'] - i), col: curPos['col'], } );
                    if( isValid((curPos['row'] + i), curPos['col']) )
                        res.push( { row: (curPos['row'] + i), col: curPos['col'], } );
                }
            }

            for (let i = curPos['row']; i < limitLoop; i++) {
                for (let j = curPos['col']; j < limitLoop; j++) {

                    if( isValid(curPos['row'], (curPos['col'] - j)) )
                        res2.push( { row: curPos['row'], col: (curPos['col'] - j), } );
                    if( isValid(curPos['row'], (curPos['col'] + j)) )
                        res2.push( { row: curPos['row'], col: (curPos['col'] + j), } );
                    if( isValid((curPos['row'] - i), curPos['col']) )
                        res2.push( { row: (curPos['row'] - i), col: curPos['col'], } );
                    if( isValid((curPos['row'] + i), curPos['col']) )
                        res2.push( { row: (curPos['row'] + i), col: curPos['col'], } );
                }
            }
        break;
    }
    console.warn(curPos);
    console.log(res);
    console.warn(res2);
    return res;
}

function isValid(row, col) {
    return ( ((row > 0 && row < 9) && (col > 0 && col < 9)) ? true : false );
}

function isValidOne(val) {
    return ( (val > 0 && val < 9) ? true : false );
}

function getCurrentPosition(piece) {
    let curCol = $(piece).closest('.col');
    return { 
        row: parseInt(curCol.attr('refRow')),
        col: parseInt(curCol.attr('refCol')),
        rowInitial: parseInt($(piece).attr('rowInitial')),
        colInitial: parseInt($(piece).attr('colInitial')),
    };
}
let count = 0;
let logCount = 0;
function markingSquare(row, col, color = 'green') {
    let el = tabulerio.find(`.col[refrow="${row}"][refcol="${col}"]`);
    if(el.attr('class')){
        $.each(el.attr('class').split(' '), (j, classe)=>{
            if(classe.indexOf('mark-') == 0) el.removeClass(classe);
        });
    }
    setTimeout(() => {
        // console.log('executou', logCount++);
        el.addClass(`mark-${color}`);
    }, (count++ * 100));
}

function clearMarkings() {
    $.each($('.tabuleiro').find('[class*="mark-"]'), function (i, obj) {
        $.each($(obj).attr('class').split(' '), (j, classe)=>{
            if(classe.indexOf('mark-') == 0)
                $(obj).removeClass(classe);
        });
    });
}