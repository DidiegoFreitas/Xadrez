var currentUser = false;
var c = 0;

// console.warn(currentUser);
window.onload = ()=>{
    if(sessionStorage.getItem('session_id') == null){
        sessionStorage.setItem('session_id', gerarIdUser());
    }
    currentUser = sessionStorage.getItem('session_id');

    if(Object.keys(localStorage).length > 0){
        Object.keys(localStorage).forEach(user => {
            if(user && user != getDefRec()){
                console.log(user);
                $('body #mensagens').append( caixaDialogo(user) );
                $(`#${user}`).css('background-color', '#cf4848');
            }
        });
    }

    let aux = 'Carregou a pagina';
    if(newUserReceive()){
        aux = 'Login...';
    }

    /* 
    if(localStorage[getDefRec()] == undefined){

        aux = 'Login...';
        // $('body #mensagens').append( caixaDialogo(currentUser) );
        // caixaDialogoAddMensagem($(`#${currentUser}`), sendMsg('Login...', currentUser), 'you');
        // enviarMensagensParaTodos(`O usuario ${currentUser} acabou de logar!!`);

        newUserReceive();
    }else{
        aux = 'Carregou a pagina';
        // $('body #mensagens').append( caixaDialogo(currentUser) );
        // caixaDialogoAddMensagem($(`#${currentUser}`), sendMsg('Carregou a pagina', currentUser), 'you');
        // enviarMensagensParaTodos(`O usuario ${currentUser} acabou de recarregar a pagina!!`);
    } 
    */

    $('body #mensagens').append( caixaDialogo(getDefRec()) );
    caixaDialogoAddMensagem($(`#${getDefRec()}`), sendMsg(aux, getDefRec()), 'you');
    $(`#${getDefRec()}`).css('background-color', '#47c150');

    sendMsg(aux, '')

    window.addEventListener('storage', (e)=>{
        console.warn(e.key, e.newValue);
        if(e.key && $(`#${e.key}`).length == 0){
            $('body #mensagens').append( caixaDialogo(e.key) );
            $(`#${e.key}`).css('background-color', '#cf4848');
        }
        // let direction = 'you';
        // if(e.key == currentUser) direction = 'others';

        if(e.key == currentUser){
            console.error('mensagem de alguem pra mim', e);
        }

        if(e.key == getDefRec()){
            console.error('mensagem recebida', e.newValue);
        }

        let direction = 'others';
        if(e.key){
            caixaDialogoAddMensagem($(`#${e.key}`), e.newValue, direction);
        }
    }, false);
}

function enviarMensagensParaTodos(msg) {
    if(Object.keys(localStorage).length > 0){
        Object.keys(localStorage).forEach(user => {
            console.log( 'enviarMensagensParaTodos', user, currentUser);
            if(user != currentUser){
                sendMsg(`${msg} > ${user}`, user);
            }
        });
    }
}

function caixaDialogo(curUser) {
    return $('<div>', {id:curUser, class:'caixa-dialogo'})
    .append(
        $('<div>', {class:'caixa-dialogo-mensagens'})
    )
    .append(
        $('<div>', {class:'caixa-dialogo-input'})
        .append(
            $('<input>', {type:'text', placeholder:'Digite...'})
        )
        .append(
            $('<input>', {type:'button', value:'>'})
            .on('click', onClickBtnSend)
        )
    )
}

function onClickBtnSend() {
    let obj = $(this).closest('.caixa-dialogo');
    let text = obj.find('input[type="text"]').val();
    if(text.length > 0){
        console.warn('enviando mensagem para o', obj.attr('id'))
        // sendMsg(text, obj.attr('id'));
        caixaDialogoAddMensagem(obj, sendMsg(text, obj.attr('id')), 'you');
        obj.find('input[type="text"]').val('');
    }
}

function caixaDialogoAddMensagem(caixaDialogo, objMsg, direction = 'others'){
    caixaDialogo.find('.caixa-dialogo-mensagens').prepend(
        $('<div>', {text:objMsg, class:direction})
    );
}

function sendMsg(msg, destino) {
    let obj = { msg: msg, date: new Date().toLocaleString("pt-BR") };

    localStorage.setItem(destino, JSON.stringify(obj));

    // newConversa()

    return JSON.stringify(obj);
}

function getDefRec() {
    return `receber_${currentUser}`;
}

function newUserReceive() {
    let aux = { msg: 'Criado', date: new Date().toLocaleString("pt-BR") };
    if(localStorage[getDefRec()] == undefined)
        localStorage.setItem(getDefRec(), JSON.stringify(aux));
    else return false;
    return true;
}

function newConversa(destino, primeiraMsg) {
    let padraoConversa = `conversa_${currentUser}_${destino}`;
    if(localStorage[padraoConversa] == undefined){
        localStorage.setItem(padraoConversa, JSON.stringify([primeiraMsg]));
    }
    return localStorage[padraoConversa];
}

let ind = 0;
function gerarIdUser() {
    console.log('gerarIdUser', ind++);
    // let newId = String(Math.random() * 100000000);
    // newId = newId.replace('.', '_');
    let newId = parseInt(Math.random() * 100000000);
    newId = `user_${newId}`;

    if(Object.keys(localStorage).length > 0){
        if(localStorage[newId] != undefined){
            newId = gerarIdUser();
        }
    }
    return newId;
}
