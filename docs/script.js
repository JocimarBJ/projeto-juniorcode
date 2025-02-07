// Referências aos elementos
const form = document.getElementById('userForm'); //formulário
const userList = document.getElementById('userList'); //lista de usuários
const clearFieldsButton = document.getElementById('clearFields'); //limpar campos do formulário
const deleteAllButton = document.getElementById('deleteAll'); //deletar todos os dados do Local Storage
const searchBox = document.getElementById('searchBox'); //barra de pesquisa (filtragem)

// Carregar dados do Local Storage
const loadUsers = () => {
    const users = JSON.parse(localStorage.getItem('users')) || []; //recupera o valor armazenado no Local Storage com a chave 'users'
    userList.innerHTML = ''; // Limpar lista antes de recarregar
    users.forEach(user => addUserToList(user)); //percorre a lista de usuários e chama a função para exibir cada usuário
};

//--------- Adicionar usuário à lista ---------
const addUserToList = (user) => {
    const li = document.createElement('li'); //cria um elemento 'li' no HTML (linha de usuário)
    li.textContent = `${user.date} - ${user.name} (${user.email})`;

    // Botão de excluir item
    const deleteBtn = document.createElement('span');
    deleteBtn.textContent = 'Excluir'; //define o texto "Excluir" para aparecer no 'li'
    deleteBtn.className = 'actions'; //atribui nome de classe para o botão
    deleteBtn.addEventListener('click', () => deleteUser(user)); //exclui ao clicar em "Excluir"

    li.appendChild(deleteBtn); //adiciona o botão ao item de lista
    userList.appendChild(li); //adiciona o item de lista na lista de usuários
};

//--------- Salvar dados no Local Storage ---------
const saveUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users)); //converte o array 'users' para uma string
};

//------- Manipular envio do formulário ---------
form.addEventListener('submit', (event) => {
    event.preventDefault();// Impede o envio tradicional do formulário

    // Capturar valores do formulário
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const date = new Date().toLocaleString(); //Obtém a data e hora atuais no formato local

    // Criar objeto do usuário
    const user = { name: username, email: email, date };

    // Salvar no Local Storage
    const users = JSON.parse(localStorage.getItem('users')) || []; //recupera os usuários existentes ou um array vazio
    users.push(user); //adiciona o novo usuário à lista
    saveUsers(users);//chama a função de salvar os usuários

    // Adicionar o usuário à lista visível
    addUserToList(user);

    // Limpar o formulário
    form.reset();
});

//--------- Limpar campos do formulário ---------
clearFieldsButton.addEventListener('click', () => {
    form.reset();
});

//--------- Excluir usuário específico ---------
const deleteUser = (userToDelete) => {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.filter(user => user.name !== userToDelete.name || user.email !== userToDelete.email || user.date !== userToDelete.date); //filtra o usuário a ser excluído
    saveUsers(users); //atualizar a lista no localstorage
    loadUsers(); // Recarrega a lista de usuários
};

//--------- Excluir todos os usuários ---------
deleteAllButton.addEventListener('click', () => {
    if (confirm('Deseja excluir todos os usuários?')) {
        localStorage.removeItem('users');
        loadUsers();
    }
});

// Pesquisar usuários na lista
searchBox.addEventListener('input', () => {
    const searchTerm = searchBox.value.toLowerCase(); //Pega os valores da barra de pesquisa e também deixa em minúsculo
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) || 
        user.email.toLowerCase().includes(searchTerm)
    ); //faz a filtragem

    userList.innerHTML = ''; // Limpar lista antes de mostrar resultados
    filteredUsers.forEach(user => addUserToList(user)); //exibe os filtrados
});

// Carregar usuários ao abrir a página
loadUsers();