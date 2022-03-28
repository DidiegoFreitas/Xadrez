$(()=>{
    console.log('depois de recarregar');
    let rows = 10;
    let cols = 10;
    let tabulerio = $('<div>', {class:'tabuleiro'});
    let PPB = $('<i>', {class:'fa-solid fa-chess-pawn branco'});
    let preenchimentoPosicoes = [
        [ ' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', ' ' ],
        [ '1', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '1' ],
        [ '2', 'peao', 'peao', 'peao', 'peao', 'peao', 'peao', 'peao', 'peao', '2' ],
        [ '3', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '3' ],
        [ '4', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '4' ],
        [ '5', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '5' ],
        [ '6', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '6' ],
        [ '7', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '7' ],
        [ '8', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '8' ],
        [ ' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', ' ' ],
    ];

    let mapeandoPosicoes = {
        1:{ 1:'torre branco', 2:'cavalo branco', 3:'bispo branco', 4:'rei branco', 5:'rainha branco', 6:'bispo branco', 7:'cavalo branco', 8:'torre branco' },
        2:{ 1:'peao branco', 2:'peao branco', 3:'peao branco', 4:'peao branco', 5:'peao branco', 6:'peao branco', 7:'peao branco', 8:'peao branco' },
        7:{ 1:'peao preto', 2:'peao preto', 3:'peao preto', 4:'peao preto', 5:'peao preto', 6:'peao preto', 7:'peao preto', 8:'peao preto' },
        8:{ 1:'torre preto', 2:'cavalo preto', 3:'bispo preto', 4:'rei preto', 5:'rainha preto', 6:'bispo preto', 7:'cavalo preto', 8:'torre preto' },
    };


    for (let r = 0; r < rows; r++) {
        let row = $('<div>', {class:`row row_${r}`})
        for (let c = 0; c < cols; c++) {
            let conteudo = preenchimentoPosicoes[r][c];
            if(mapeandoPosicoes[r] && mapeandoPosicoes[r][c]){
                let split = mapeandoPosicoes[r][c].split(' ');
                conteudo = newPeca(split[0], split[1]);
            }
            row.append(
                $('<div>', {class:`col col_${c} ${ (((r + c) % 2) > 0) ? 'W' : 'B' }`}).append(conteudo)
            )
        }
        tabulerio.append(row);
    }

    $('body').append(tabulerio)
});
let pecas = {};

function newPeca(namePeca, cor) {
    let res = null;
    let icone = 'pawn';
    switch (namePeca) {
        case 'peao':
            icone = 'pawn';
        break;
        case 'torre':
            icone = 'rook';
        break;
        case 'cavalo':
            icone = 'knight';
        break;
        case 'bispo':
            icone = 'bishop';
        break;
        case 'rei':
            icone = 'king';
        break;
        case 'rainha':
            icone = 'queen';
        break;
    }

    if(pecas[cor] == undefined) pecas[cor] = {};
    if(pecas[cor][namePeca] == undefined) pecas[cor][namePeca] = [];

    pecas[cor][namePeca].push($('<i>', {class:`fa-solid fa-chess-${icone} ${cor} ${namePeca}_${cor}_${pecas[cor][namePeca].length}`}));
    res = pecas[cor][namePeca][ (pecas[cor][namePeca].length - 1) ];

    return res;
}

function movimentar(peca, posicaoAtual, posicaoescolhida) {
    
}