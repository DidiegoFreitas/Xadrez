$(()=>{
    console.log('depois de recarregar');
    prepararTabulerio();
});

var tabulerio = $('<div>', {class:'tabuleiro'});
var bancoBranco = $('<div>', {class:'cemiterio'});
var bancoPreto = $('<div>', {class:'cemiterio'});
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
                $('<div>', {class:`col col_${c} ${ (((r + c) % 2) > 0) ? 'W' : 'B' }`, refRow:r, refCol:c})
                .on('click', onClickSquare)
                .append(conteudo)
            )
        }
        tabulerio.append(row);
    }

    $('body').append(bancoBranco);
    $('body').append(tabulerio);
    $('body').append(bancoPreto);
}

function movedAnimation(currentPiece, address, callback = ()=>{}) {
    let obj = {
        top:(parseInt(address.top) + 4),
        left:(parseInt(address.left) + 3) 
    };

    currentPiece
    .css('width', `${currentPiece.width()}px`)
    .css('height', `${currentPiece.height()}px`)
    .css('position', 'fixed')
    .css('z-index', '999')

    currentPiece.animate(obj, 2000, callback);
}

function onClickSquare() {
    let curPieceSquare = $(this).find('[piece]');
    let pieceMove = tabulerio.find('.mark-blue [piece]');
    if($(this).hasClass('mark-blue')){
        clearMarkings();
    }else if($(this).hasClass('mark-green')){
        movedAnimation(pieceMove, $(this).position(), ()=>{
            $(this).append(pieceMove);
            pieceMove.removeAttr('style');
            clearMarkings();
        });
    }else if($(this).hasClass('mark-red')){
        console.log('comer peca');
        console.log('Remover', curPieceSquare);
        console.log('Trazer', pieceMove);

        movedAnimation(pieceMove, $(this).position(), ()=>{
            curPieceSquare.remove();

            $(this).append(pieceMove);
            pieceMove.removeAttr('style');
            clearMarkings();
        });
    }else if($(this).hasClass('mark-orange')){
        clearMarkings();
        curPieceSquare.trigger('click');
    }
}

function onClickPiece() {
    if($(this).closest('[class*="mark-"]').length == 0){
        let curPos = getCurrentPosition(this);
        let curPiece = $(this).attr('piece');
        let pieceCor = ( $(this).hasClass('branco') ? 'branco' : 'preto');
        clearMarkings();

        //marcando peça no lugar atual
        count = logCount = 0;
        markingSquare(curPos['row'], curPos['col'], 'blue');

        let markingPositions = rankingPositions(pieceCor, getAllPositions(curPos, curPiece));
        $.each(markingPositions, (i, positions)=>{
            $.each(positions, (j, pos)=>{
                if(pos) markingSquare(pos.row, pos.col, pos.color);
            });
        });
    }
}

function removePosition(pos, index) {
    if(index > 0){
        for (let i = 0; i < index; i++) {
            if(pos[i] != undefined && pos[i]['color'] != 'green'){
                return true;
            }
        }
    }
    return false;
}

function rankingPositions(currentPieceColor, allPositions) {
    $.each(allPositions, (direction, positions)=>{
        $.each(positions, (i, pos)=>{
            let square = tabulerio.find(`.col[refrow="${pos.row}"][refcol="${pos.col}"]`);
            if(square.length > 0){
                if(square.html().length == 0){
                    if(removePosition(positions, i)) delete allPositions[direction][i];
                    pos.color = 'green';
                }else{
                    let piece = square.find('[piece]');
                    if(piece.hasClass(currentPieceColor)){
                        if(removePosition(positions, i)) delete allPositions[direction][i];
                        pos.color = 'orange';
                    }else{
                        if(removePosition(positions, i)) delete allPositions[direction][i];
                        pos.color = 'red';
                    }
                }
            }
        });
    });
    return allPositions;
}

function getAllPositions(curPos, currentPiece) {
    let res = { row_up:[], diag_up_right:[], col_right:[], diag_down_right:[], row_down:[], diag_down_left:[], col_left:[], diag_up_left:[], };

    switch (currentPiece) {
        case 'pawn':
            if(curPos['rowInitial'] > 4){
                if( isValidOne((curPos['row'] - 1)) ){
                    if( isValidOne(curPos['col']) )
                        res.row_up.push( { row: (curPos['row'] - 1), col: curPos['col'], } );
                    if( isValidOne((curPos['col'] - 1)) )
                        res.diag_up_left.push( { row: (curPos['row'] - 1), col: (curPos['col'] - 1), } );
                    if( isValidOne((curPos['col'] + 1)) )
                        res.diag_up_right.push( { row: (curPos['row'] - 1), col: (curPos['col'] + 1), } );
                }

                if( (curPos['row'] == curPos['rowInitial']) && isValid((curPos['row'] - 2), curPos['col']) )
                    res.row_up.push( { row: (curPos['row'] - 2), col: curPos['col'], } );
            }else{
                if( isValidOne((curPos['row'] + 1)) ){
                    if( isValidOne(curPos['col']) )
                        res.row_down.push( { row: (curPos['row'] + 1), col: curPos['col'], } );
                    if( isValidOne((curPos['col'] - 1)) )
                        res.diag_down_left.push( { row: (curPos['row'] + 1), col: (curPos['col'] - 1), } );
                    if( isValidOne((curPos['col'] + 1)) )
                        res.diag_down_right.push( { row: (curPos['row'] + 1), col: (curPos['col'] + 1), } );
                }

                if( curPos['row'] == curPos['rowInitial'] && ( isValid((curPos['row'] + 2), curPos['col']) ))
                    res.row_down.push( { row: (curPos['row'] + 2), col: curPos['col'], } );
            }
        break;
        case 'knight':
            if( isValid((curPos['row'] - 2), (curPos['col'] + 1)) )
                res.row_up.push( { row: (curPos['row'] - 2), col: (curPos['col'] + 1), } );
            if( isValid((curPos['row'] - 1), (curPos['col'] + 2)) )
                res.diag_up_right.push( { row: (curPos['row'] - 1), col: (curPos['col'] + 2), } );
            if( isValid((curPos['row'] + 1), (curPos['col'] + 2)) )
                res.col_right.push( { row: (curPos['row'] + 1), col: (curPos['col'] + 2), } );
            if( isValid((curPos['row'] + 2), (curPos['col'] + 1)) )
                res.diag_down_right.push( { row: (curPos['row'] + 2), col: (curPos['col'] + 1), } );
            if( isValid((curPos['row'] + 2), (curPos['col'] - 1)) )
                res.row_down.push( { row: (curPos['row'] + 2), col: (curPos['col'] - 1), } );
            if( isValid((curPos['row'] + 1), (curPos['col'] - 2)) )
                res.diag_down_left.push( { row: (curPos['row'] + 1), col: (curPos['col'] - 2), } );
            if( isValid((curPos['row'] - 1), (curPos['col'] - 2)) )
                res.col_left.push( { row: (curPos['row'] - 1), col: (curPos['col'] - 2), } );
            if( isValid((curPos['row'] - 2), (curPos['col'] - 1)) )
                res.diag_up_left.push( { row: (curPos['row'] - 2), col: (curPos['col'] - 1), } );
        break;
        case 'king':
            //ROW UP
            if( isValid((curPos['row']-1), curPos['col']) )
                res.row_up.push( { row: (curPos['row']-1), col: curPos['col'], } );
            //DIAG UP RIGHT
            if( isValid((curPos['row']-1), (curPos['col']+1)) )
                res.diag_up_right.push( { row: (curPos['row']-1), col: (curPos['col']+1), } );
            //COL RIGHT
            if( isValid(curPos['row'], (curPos['col']+1)) )
                res.col_right.push( { row: curPos['row'], col: (curPos['col']+1), } );
            //DIAG DOWN RIGHT
            if( isValid((curPos['row']+1), (curPos['col']+1)) )
                res.diag_down_right.push( { row: (curPos['row']+1), col: (curPos['col']+1), } );
            //ROW DOWN
            if( isValid((curPos['row']+1), curPos['col']) )
                res.row_down.push( { row: (curPos['row']+1), col: curPos['col'], } );
            //DIAG DOWN LEFT
            if( isValid((curPos['row']+1), (curPos['col']-1)) )
                res.diag_down_left.push( { row: (curPos['row']+1), col: (curPos['col']-1), } );
            //COL LEFT
            if( isValid(curPos['row'], (curPos['col']-1)) )
                res.col_left.push( { row: curPos['row'], col: (curPos['col']-1), } );
            //DIAG UP LEFT
            if( isValid((curPos['row']-1), (curPos['col']-1)) )
                res.diag_up_left.push( { row: (curPos['row']-1), col: (curPos['col']-1), } );
        break;
        case 'queen':
        case 'bishop':
        case 'rook':
            let limitLoop = 8;
            let lastCol = 0;

            if(currentPiece != 'bishop'){
                //ROW UP
                for (let i = curPos['row']-1; i > 0; i--) {
                    if( isValid(i, curPos['col']) )
                        res.row_up.push( { row: i, col: curPos['col'], } );
                }
            }
            if(currentPiece != 'rook'){
                //DIAG UP RIGHT
                lastCol = curPos['col']+1;
                for (let i = curPos['row']-1; i > 0; i--) {
                    if( isValid(i, lastCol) )
                        res.diag_up_right.push( { row: i, col: lastCol++, } );
                }
            }
            if(currentPiece != 'bishop'){
                //COL RIGHT
                for (let i = curPos['col']+1; i <= (limitLoop + curPos['col']); i++) {
                    if( isValid(curPos['row'], i) )
                        res.col_right.push( { row: curPos['row'], col: i, } );
                }
            }
            if(currentPiece != 'rook'){
                //DIAG DOWN RIGHT
                lastCol = curPos['col']+1;
                for (let i = curPos['row']+1; i <= (limitLoop + curPos['row']); i++) {
                    if( isValid(i, lastCol) )
                        res.diag_down_right.push( { row: i, col: lastCol++, } );
                }
            }
            if(currentPiece != 'bishop'){
                //ROW DOWN
                for (let i = curPos['row']+1; i <= (limitLoop + curPos['row']); i++) {
                    if( isValid(i, curPos['col']) )
                        res.row_down.push( { row: i, col: curPos['col'], } );
                }
            }
            if(currentPiece != 'rook'){
                //DIAG DOWN LEFT
                lastCol = curPos['col']-1;
                for (let i = curPos['row']+1; i <= (limitLoop + curPos['row']); i++) {
                    if( isValid(i, lastCol) )
                        res.diag_down_left.push( { row: i, col: lastCol--, } );
                }
            }
            if(currentPiece != 'bishop'){
                //COL LEFT
                for (let i = curPos['col']-1; i > 0; i--) {
                    if( isValid(curPos['row'], i) )
                        res.col_left.push( { row: curPos['row'], col: i, } );
                }
            }
            if(currentPiece != 'rook'){
                //DIAG UP LEFT
                lastCol = curPos['col']-1;
                for (let i = curPos['row']-1; i > 0; i--) {
                    if( isValid(i, lastCol) )
                        res.diag_up_left.push( { row: i, col: lastCol--, } );
                }
            }
        break;
    }
    return res;
}

function isValid(row, col) {
    return ( (isValidOne(row) && isValidOne(col)) ? true : false );
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
    }, (count++ * 1));
}

function clearMarkings() {
    $.each($('.tabuleiro').find('[class*="mark-"]'), function (i, obj) {
        $.each($(obj).attr('class').split(' '), (j, classe)=>{
            if(classe.indexOf('mark-') == 0)
                $(obj).removeClass(classe);
        });
    });
}