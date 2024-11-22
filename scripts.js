const button = document.querySelector('.button-add-task');
const input = document.querySelector('.input-task');
const listaCompleta = document.querySelector('.list-tasks');
const urgentCheckbox = document.querySelector('.urgent-task');

let minhaListaDeItens = [];

function adicionarNovaTarefa() {
    if (input.value.trim() === '') {
        alert('Por favor, insira uma tarefa antes de adicioná-la.');
        return;
    }

    minhaListaDeItens.push({
        tarefa: input.value.trim(),
        concluida: false,
        urgente: urgentCheckbox.checked,
        importante: false // Inicialmente não marcada como importante
    });
    input.value = '';
    urgentCheckbox.checked = false;

    mostrarTarefas();
}

function mostrarTarefas() {
    let novaLi = '';

    // Ordena as tarefas colocando as importantes primeiro
    const tarefasOrdenadas = [...minhaListaDeItens].sort((a, b) => b.importante - a.importante);

    tarefasOrdenadas.forEach((item, posicao) => {
        novaLi += `
            <li class="task ${item.concluida ? 'done' : ''} ${!item.concluida && item.urgente ? 'urgent' : ''} ${item.importante ? 'important' : ''}">
                <img src="img/checked.png" alt="check-na-tarefa" onclick="concluirTarefa(${posicao})">
                <p class="task-text">${item.tarefa}</p>
                <button class="edit-button" onclick="editarTarefa(${posicao})">Editar</button>
                <button class="important-button" onclick="toggleImportante(${posicao})">${item.importante ? 'Remover Importante' : 'Importante'}</button>
                <img src="img/trash.png" alt="tarefa-para-o-lixo" onclick="deletarItem(${posicao})">
            </li>
        `;
    });

    listaCompleta.innerHTML = novaLi;

    localStorage.setItem('lista', JSON.stringify(minhaListaDeItens));
}

function editarTarefa(posicao) {
    const item = minhaListaDeItens[posicao];
    const tarefaElemento = listaCompleta.children[posicao];
    const textoAtual = item.tarefa;

    tarefaElemento.innerHTML = `
        <input type="text" class="edit-input" value="${textoAtual}" />
        <button class="save-button" onclick="salvarTarefa(${posicao})">Salvar</button>
        <button class="cancel-button" onclick="mostrarTarefas()">Cancelar</button>
    `;

    tarefaElemento.querySelector('.edit-input').focus();
}

function salvarTarefa(posicao) {
    const tarefaElemento = listaCompleta.children[posicao];
    const novoTexto = tarefaElemento.querySelector('.edit-input').value.trim();

    if (novoTexto === '') {
        alert('A tarefa não pode estar vazia!');
        return;
    }

    minhaListaDeItens[posicao].tarefa = novoTexto;

    mostrarTarefas();
}

function concluirTarefa(posicao) {
    minhaListaDeItens[posicao].concluida = !minhaListaDeItens[posicao].concluida;

    mostrarTarefas();
}

function deletarItem(posicao) {
    minhaListaDeItens.splice(posicao, 1); // Remove a tarefa do array

    mostrarTarefas();
}

function recarregarTarefas() {
    const tarefasDoLocalStorage = localStorage.getItem('lista');

    if (tarefasDoLocalStorage) {
        minhaListaDeItens = JSON.parse(tarefasDoLocalStorage);
    }

    mostrarTarefas();
}

function toggleImportante(posicao) {
    // Alterna a propriedade "importante" da tarefa
    minhaListaDeItens[posicao].importante = !minhaListaDeItens[posicao].importante;

    // Exibe novamente as tarefas após a alteração
    mostrarTarefas();
}

recarregarTarefas();

button.addEventListener('click', adicionarNovaTarefa);
