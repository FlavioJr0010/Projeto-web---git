document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const btnListar = document.getElementById("btnListar");

    // Evento para redirecionar ao clicar no botão "Listar"
    btnListar.addEventListener("click", function () {
        window.location.href = "../pages/tela-listar.html";
    });

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita o recarregamento da página

        // Captura os valores do formulário
        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const login = document.getElementById("login").value;
        const senha = document.getElementById("senha").value;

        // Monta o objeto para enviar
        const usuario = { nome, email, login, senha };

        try {
            // Faz a requisição para o backend
            const resposta = await fetch("http://localhost:8080/usuarios/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario),
            });

            if (resposta.ok) {
                alert("✅ Usuário cadastrado com sucesso!");
                form.reset(); // Limpa os campos do formulário

                // Redireciona automaticamente para a tela de listagem após o cadastro
                window.location.href = "../pages/tela-listar.html";
            } else {
                alert("❌ Erro ao cadastrar usuário. Verifique os dados e tente novamente.");
            }
        } catch (erro) {
            console.error("❌ Erro na requisição:", erro);
            alert("Erro ao conectar ao servidor.");
        }
    });
});
