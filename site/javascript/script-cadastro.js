// Declara a classe do objeto "sala"
// Não está sendo possível importar a classe no momento. Arrumar e remover a classe “Sala” deste script.

// ponteiro para o banco de dados
/* Cadasto de salas */

let db = null;

function criar_db(dbName) {
	const request = indexedDB.open(dbName, 2);

	request.onerror = (event) => {
		console.log("Erro ao inicializar o banco de dados.");
	};

	request.onsuccess = (event) => {
		db = event.target.result;
	};

	request.onupgradeneeded = (event) => {
		db = event.target.result;

		let objectStore = db.createObjectStore("salas", {
			keyPath: "id", // usa o campo id como chave
		});
		objectStore.createIndex("predio_sala_idx", ["predio", "numero"], {
			unique: true,
		});

		let objectStoreUser = db.createObjectStore("usuarios", {
			keyPath: "matricula", // usa o campo matricula como chave
		});
		objectStoreUser.createIndex("usuario_id", "matricula", { unique: true });
		console.log("Atualização do banco de dados pronta!");
	};

	if (db !== null) {
		db.onerror = (event) => {
			console.error(`Erro de DB\n: ${event.target.error?.message}`);
		};
	}
}

/* Função para mostrar as salas registradas */
/* Melhorar código se possível */

function escrever_salas() {
	let dbName = "salasDB";
	const request = indexedDB.open(dbName, 2);

	request.onsuccess = (event) => {
		const db = event.target.result;
		const transaction = db.transaction("salas", "readonly");
		const objectStore = transaction.objectStore("salas");

		const getAllRequest = objectStore.getAll();

		getAllRequest.onsuccess = (event) => {
			console.log("Sucesso!");
			let table = document.getElementById("table-salas");
			const allValues = event.target.result;
			console.log(allValues.length);
			for (const item of allValues) {
				let row = document.createElement("tr");
				row.setAttribute("id", item.id);
				let table_data_1 = document.createElement("td");
				let table_data_2 = document.createElement("td");
				let table_data_3 = document.createElement("td");
				table_data_1.innerHTML = item.id;
				table_data_2.innerHTML = item.capacidade;
				if (item.tipo === "lab") {
					table_data_3.innerHTML = "Laboratório";
				} else {
					table_data_3.innerHTML = "Sala";
				}
				row.appendChild(table_data_1);
				row.appendChild(table_data_2);
				row.appendChild(table_data_3);
				let i;
				for (i = 0; i <= 5; i++) {
					if (item.reservas[i] === "" || item.reservas[i] === null) {
						let td_last = document.createElement("button");
						td_last.innerHTML = "Disponível";
						row.appendChild(td_last);
					}
				}
				table.appendChild(row);
			}
		};
	};
}

function recuperar_sala(predio, numero) {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(["salas"]);
		const objectStore = transaction.objectStore("salas");
		const index = objectStore.index("predio_sala_idx");
		const request = index.get([predio, numero]);

		request.onerror = (event) => {
			console.log(`Erro ao recuperar sala: ${event.target.message}`);
			reject(event.target.error);
		};

		request.onsuccess = (event) => {
			if (request.result) {
				resolve(request.result); // sala encontrada
			} else {
				resolve(null); // não encontrada
			}
		};
	});
}

function cadastrar_sala(event) {
	// TODO essa função não deve criar um banco de dados, deve apenas salvar uma sala.
	//   não se re-cria o banco de dados a cada nova inserção de dados em uma aplicação!

	event.preventDefault();
	let predio = document.getElementById("predios").value;
	let numero = document.getElementById("numero").value;
	let capacidade = document.getElementById("capacidade").value;
	let tipo = document.getElementById("tipo").value;

	const name = `${predio.toString()}-${numero.toString()}`;
	const obj = {
		id: name,
		predio: predio,
		numero: numero,
		capacidade: capacidade,
		tipo: tipo,
		reservas: ["", "", "", "", "", ""],
	};
	if (numero === "" || capacidade === "") {
		alert("Favor preencher todos os valores."); // Adicionar função de alerta de falta de valores
	} else {
		recuperar_sala(predio, numero).then((salaExistente) => {
			if (salaExistente) {
				alert("Sala já cadastrada.");
			} else {
				const transaction = db.transaction("salas", "readwrite");
				const objectStore = transaction.objectStore("salas");
				objectStore.add(obj);
				alert("Sala cadastrada com sucesso!");
			}
		});
	}
}
/* Cadastro de usuários */

function recuperar_usuario(matricula) {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(["usuarios"]);
		const objectStore = transaction.objectStore("usuarios");
		const index = objectStore.index("usuario_id");
		const request = index.get(matricula);

		request.onerror = (event) => {
			console.log(`Erro ao recuperar usuário: ${event.target.message}`);
			reject(event.target.error);
		};

		request.onsuccess = (event) => {
			if (request.result) {
				resolve(request.result); // usuário encontrado encontrado
			} else {
				resolve(null); // usuário não encontrado
			}
		};
	});
}

function cadastrar_usuario(event) {
	event.preventDefault();
	let matricula = document.getElementById("matricula").value;
	let nome = document.getElementById("nome").value;
	let cargo = document.getElementById("cargo").value;

	const obj = {
		matricula: matricula,
		nome: nome,
		cargo: cargo,
	};
	if (matricula === "" || nome === "") {
		alert("Favor preencher todos os valores."); // Adicionar função de alerta de falta de valores
	} else {
		recuperar_usuario(matricula).then((usuarioExistente) => {
			if (usuarioExistente) {
				alert("Usuário existente.");
			} else {
				const transaction = db.transaction("usuarios", "readwrite");
				const objectStore = transaction.objectStore("usuarios");
				objectStore.add(obj);
				alert("Usuário cadastrado com sucesso!");
			}
		});
	}
}

/* Função para simular login */
function fazer_login() {
	let usuario_informado = document.getElementById("usuario").value;
	recuperar_usuario(usuario_informado).then((usuarioExistente) => {
		if (usuarioExistente) {
			localStorage.setItem("usuario_atual", usuario_informado);
			mostrar_usuario_logado();
		} else {
			alert("Usuário não cadastrado!");
		}
	});
}

function mostrar_usuario_logado() {
	if (
		localStorage.getItem("usuario_atual") === "" ||
		localStorage.getItem("usuario_atual") === null
	) {
		document.getElementById("div_user_logado").style.display = "none";
		document.getElementById("div_user_deslogado").style.display = "block";
	} else {
		let dbName = "salasDB";
		const request = indexedDB.open(dbName, 2);

		request.onsuccess = (event) => {
			const db = event.target.result;

			const transaction = db.transaction(["usuarios"]);
			const objectStore = transaction.objectStore("usuarios");
			const index = objectStore.index("usuario_id");
			const request = index.get(localStorage.getItem("usuario_atual"));
			request.onsuccess = () => {
				div_nome = document.getElementById("nome_usuario");
				div_nome.innerHTML = request.result.nome;

				document.getElementById("div_user_logado").style.display = "block";
				document.getElementById("div_user_deslogado").style.display = "none";
			};
		};
	}
}

function sair() {
	localStorage.removeItem("usuario_atual");
	mostrar_usuario_logado();
}

// carrega o banco de dados depois que a página carregar por completo
document.addEventListener("DOMContentLoaded", () => criar_db("salasDB"));
document.addEventListener("DOMContentLoaded", () => escrever_salas());
document.addEventListener("DOMContentLoaded", () => mostrar_usuario_logado());
document
	.getElementById("botao-cadastro-sala")
	.addEventListener("click", cadastrar_sala);
document
	.getElementById("botao-cadastro-usuario")
	.addEventListener("click", cadastrar_usuario);
document.getElementById("botao-login").addEventListener("click", fazer_login);
document.getElementById("usuario_logado_sair").addEventListener("click", sair);
