document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#loginForm");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita o recarregamento da página

        // Captura os valores do formulário
        const login = document.getElementById("login").value.trim();
        const senha = document.getElementById("senha").value.trim();

        // Verifica se os campos foram preenchidos
        if (!login || !senha) {
            alert("Por favor, preencha todos os campos!");
            return;
        }

        // Monta o objeto para enviar
        const usuario = {
            login: login,
            senha: senha
        };

        console.log("🔹 Enviando para o backend:", JSON.stringify(usuario)); // Log para depuração

        try {
            // Faz a requisição para o backend
            const resposta = await fetch("http://localhost:8080/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuario)
            });

            console.log("🔹 Status da resposta:", resposta.status);

            if (resposta.ok) {
                const data = await resposta.json();
                console.log("🔹 Resposta do backend:", data);

                if (data.success !== undefined ? data.success : data.login) {
                    alert("✅ Login bem-sucedido!");
                    form.reset(); // Limpa os campos do formulário
                    window.location.href = "../pages/tela-listar.html";
                } else {
                    alert("⚠️ Login ou senha incorretos.");
                }
            } else {
                const errorData = await resposta.json().catch(() => null);
                console.error("❌ Erro na resposta do backend:", errorData);

                alert(
                    errorData?.message
                        ? `Erro: ${errorData.message}`
                        : "⚠️ Erro ao tentar fazer login. Verifique os dados e tente novamente."
                );
            }
        } catch (erro) {
            console.error("❌ Erro na requisição:", erro);
            alert("🚨 Erro ao conectar ao servidor.");
        }
    });
});
