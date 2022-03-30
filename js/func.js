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

            if(r==4 && c==4) conteudo = createPieceChess('bishop', 'branco', r, c);
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
    console.log(this);
    let curPos = getPosition(this);
    let pieceCor = ( $(this).hasClass('branco') ? 'branco' : 'preto');
    clearMarkings();

    console.log('posições posiveis', pieceCor);
    //marcando peça no lugar atual
    markingSquare(curPos['row'], curPos['col'], 'blue');

    switch ($(this).attr('piece')) {
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
    }
}

function getPosition(piece) {
    let curCol = $(piece).closest('.col');
    return { 
        row: parseInt(curCol.attr('refRow')),
        col: parseInt(curCol.attr('refCol')),
        rowInitial: parseInt($(piece).attr('rowInitial')),
        colInitial: parseInt($(piece).attr('colInitial')),
    };
}

function markingSquare(row, col, color = 'green') {
    let el = tabulerio.find(`.col[refrow="${row}"][refcol="${col}"]`);
    if(el.attr('class')){
        $.each(el.attr('class').split(' '), (j, classe)=>{
            if(classe.indexOf('mark-') == 0) el.removeClass(classe);
        });
    }
    el.addClass(`mark-${color}`);
}

function clearMarkings() {
    $.each($('.tabuleiro').find('[class*="mark-"]'), function (i, obj) {
        $.each($(obj).attr('class').split(' '), (j, classe)=>{
            if(classe.indexOf('mark-') == 0)
                $(obj).removeClass(classe);
        });
    });
}