document.addEventListener("DOMContentLoaded", async function () {
    const tabelaUsuarios = document.querySelector("tbody");
    const modal = document.getElementById("modalEditar");
    const formEditar = document.getElementById("formEditar");
    let usuarioAtual = {}; // Armazena os dados do usuário selecionado para edição

    async function carregarUsuarios() {
        try {
            const resposta = await fetch("http://localhost:8080/usuarios/findall");

            if (!resposta.ok) {
                throw new Error(`Erro ao carregar usuários: ${resposta.status}`);
            }

            const dados = await resposta.json();
            console.log("🔹 Usuários recebidos:", dados);

            tabelaUsuarios.innerHTML = "";

            dados.content.forEach(usuario => {
                const linha = document.createElement("tr");

                linha.innerHTML = `
                    <td>${usuario.nome}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.login}</td>
                    <td>
                        <button class="btn btn-danger btn-sm btn-remover" 
                            data-nome="${usuario.nome}" 
                            data-email="${usuario.email}" 
                            data-login="${usuario.login}">🗑️</button>
                    </td>
                    <td>
                        <button class="btn btn-success btn-sm btn-editar" 
                            data-nome="${usuario.nome}" 
                            data-email="${usuario.email}" 
                            data-login="${usuario.login}">✏️</button>
                    </td>
                `;

                tabelaUsuarios.appendChild(linha);
            });

            adicionarEventosBotoes();
        } catch (erro) {
            console.error("❌ Erro ao buscar usuários:", erro);
            alert("Erro ao carregar usuários. Tente novamente mais tarde.");
        }
    }

    function adicionarEventosBotoes() {
        // Remover usuário
        document.querySelectorAll(".btn-remover").forEach(botao => {
            botao.addEventListener("click", async function () {
                const nome = this.getAttribute("data-nome");
                const email = this.getAttribute("data-email");
                const login = this.getAttribute("data-login");

                if (confirm(`Deseja realmente remover o usuário ${login}?`)) {
                    await removerUsuario(nome, email, login);
                }
            });
        });

        // Editar usuário
        document.querySelectorAll(".btn-editar").forEach(botao => {
            botao.addEventListener("click", function () {
                usuarioAtual = {
                    nome: this.getAttribute("data-nome"),
                    login: this.getAttribute("data-login"),
                    email: this.getAttribute("data-email") // Armazena o email do usuário
                };

                // Preenche o formulário do modal com os dados do usuário
                document.getElementById("editarNome").value = usuarioAtual.nome;
                document.getElementById("editarLogin").value = usuarioAtual.login;

                modal.style.display = "block"; // Exibe o modal
            });
        });
    }

    async function removerUsuario(nome, email, login) {
        try {
            const usuario = { nome, email, login };

            const resposta = await fetch("http://localhost:8080/usuarios/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(usuario),
            });

            if (resposta.ok) {
                alert("✅ Usuário removido com sucesso!");
                carregarUsuarios(); // Recarrega a tabela
            } else {
                throw new Error(`Erro ao remover usuário: ${resposta.status}`);
            }
        } catch (erro) {
            console.error("❌ Erro ao remover usuário:", erro);
            alert("Erro ao remover usuário. Tente novamente.");
        }
    }

    formEditar.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nome = document.getElementById("editarNome").value;
        const login = document.getElementById("editarLogin").value;
        const email = usuarioAtual.email; // Pegamos o e-mail armazenado

        // Enviamos nome, login e o e-mail que já existia
        const usuarioAtualizado = { nome, login, email };

        try {
            const resposta = await fetch("http://localhost:8080/usuarios/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(usuarioAtualizado),
            });

            if (resposta.ok) {
                alert("✅ Usuário atualizado com sucesso!");
                modal.style.display = "none";
                carregarUsuarios(); // Recarrega a lista
            } else {
                throw new Error(`Erro ao atualizar usuário: ${resposta.status}`);
            }
        } catch (erro) {
            console.error("❌ Erro ao atualizar usuário:", erro);
            alert("Erro ao atualizar usuário. Tente novamente.");
        }
    });

    // Fecha o modal ao clicar fora dele
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    carregarUsuarios();
});
