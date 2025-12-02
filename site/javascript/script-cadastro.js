import { getDate, validaCPF, validaSala } from "./validacoes.js"

// ponteiro para o banco de dados
/* Cadasto de salas */
let db = null;

export function criar_db(dbName) {
	const request = indexedDB.open(dbName, 2);

	request.onerror = () => {
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

		objectStore.createIndex("sala_id", "id", {
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

export function escrever_salas() {
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
				let td_last = document.createElement("button");
				td_last.innerHTML = "Reservar";
				td_last.setAttribute("id", item.id);
				td_last.setAttribute("onclick", 'mostrar_reservas("' + item.id + '")');
                td_last.setAttribute("id", item.id);
				td_last.classList.add("btn", "btn-primary");
                row.appendChild(td_last);
				table.appendChild(row);
			}
		};
	};
}

export function recuperar_sala(predio, numero) {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(["salas"]);
		const objectStore = transaction.objectStore("salas");
		const index = objectStore.index("predio_sala_idx");
		const request = index.get([predio, numero]);

		request.onerror = (event) => {
			console.log(`Erro ao recuperar sala: ${event.target.message}`);
			reject(event.target.error);
		};

		request.onsuccess = () => {
			if (request.result) {
				resolve(request.result); // sala encontrada
			} else {
				resolve(null); // não encontrada
			}
		};
	});
}



export function cadastrar_sala(event) {
	// TODO essa função não deve criar um banco de dados, deve apenas salvar uma sala.
	//   não se re-cria o banco de dados a cada nova inserção de dados em uma aplicação!

	event.preventDefault();
	let predio = document.getElementById("predios").value;
	let numero = document.getElementById("numero").value;
	let capacidade = document.getElementById("capacidade").value;
	let tipo = document.getElementById("tipo").value;

	if (validaSala(numero, capacidade)) {

		const name = `${predio.toString()}-${numero.toString()}`;
		const obj = {
			id: name,
			predio: predio,
			numero: numero,
			capacidade: capacidade,
			tipo: tipo,
			reservas: [],
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
}
/* Cadastro de usuários */

export function recuperar_usuario(matricula) {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(["usuarios"]);
		const objectStore = transaction.objectStore("usuarios");
		const index = objectStore.index("usuario_id");
		const request = index.get(matricula);

		request.onerror = (event) => {
			console.log(`Erro ao recuperar usuário: ${event.target.message}`);
			reject(event.target.error);
		};

		request.onsuccess = () => {
			if (request.result) {
				resolve(request.result); // usuário encontrado encontrado
			} else {
				resolve(null); // usuário não encontrado
			}
		};
	});
}

export function cadastrar_usuario(event) {
	event.preventDefault();
	let matricula = document.getElementById("matricula").value;
	let nome = document.getElementById("nome").value;
	let cargo = document.getElementById("cargo").value;

	if (validaCPF(matricula)) {
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
	} else {
		alert("CPF inválido.");
	}
}

/* Função para simular login */
export function fazer_login() {
	let usuario_informado = document.getElementById("usuario").value;
	if (validaCPF(usuario_informado)) {
		recuperar_usuario(usuario_informado).then((usuarioExistente) => {
			if (usuarioExistente) {
				localStorage.setItem("usuario_atual", usuario_informado);
				mostrar_usuario_logado();
			} else {
				alert("Usuário não cadastrado!");
			}
		});
	} else {
		alert("Login inválido.");
	}
}

export function mostrar_usuario_logado() {
	if (
		localStorage.getItem("usuario_atual") === "" ||
		localStorage.getItem("usuario_atual") === null
	) {
		document.getElementById("div_user_logado").style.display = "none";
		document.getElementById("div_user_logado").classList.remove("d-flex", "flex-row");
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
				let div_nome = document.getElementById("nome_usuario");
				div_nome.innerHTML = request.result.nome;

				document.getElementById("div_user_logado").style.display = "block";
				document.getElementById("div_user_logado").classList.add("d-flex", "flex-row");
				document.getElementById("div_user_deslogado").style.display = "none";
			};
		};
	}
}

export function sair() {
	localStorage.removeItem("usuario_atual");
	mostrar_usuario_logado();
}
/* Função para mostrar as reservas das salas em uma janela modal */

export function mostrar_reservas(sala_id) {
    let dbName = "salasDB";
    const request = indexedDB.open(dbName, 2);

    request.onsuccess = (event) => {
        const db = event.target.result;

        const transaction = db.transaction(["salas"]);
        const objectStore = transaction.objectStore("salas");
        const index = objectStore.index("sala_id");
        const requestSala = index.get(sala_id);

        let data = getDate(document.getElementById("data_reserva").value);

        requestSala.onerror = () => {
            console.log("Sala inexiste.");
        };

        requestSala.onsuccess = () => {
            document.getElementById("sala_id").innerHTML = requestSala.result.id;
            document.getElementById("sala_capacidade").innerHTML =
                requestSala.result.capacidade;
            document.getElementById("sala_tipo").innerHTML = requestSala.result.tipo;
            let data_reserva = getDate(document.getElementById("data_reserva").value);


            let modal_reserva = document.getElementById("modal_reserva");
            modal_reserva.style.display = "block";

            let i;
            let j;

            let input_recorrente = document.createElement("input");
            input_recorrente.setAttribute("type", "checkbox");

            let resultados = document.getElementsByClassName("reserva");
            console.log(resultados.length);

            /* Teste o length das reservas da sala especificada. Caso seja 0, não há reservas, portanto pode ser mostrado o código para fazer uma nova. */
            if (
                requestSala.result.reservas.find((x) => x.data === data) === undefined
            ) {
                for (j = 0; j < resultados.length; j++) {
                    let status = resultados[j].querySelector(".reservar");
                    status.checked = false;
                    status.disabled = false;
                    let professor = resultados[j].querySelector(".professor");
                    professor.innerHTML = "Disponível";
                }
            } else {
                for (i = 0; i < requestSala.result.reservas.length; i++) {
                    j = 0;
                    if (requestSala.result.reservas[i].data === data_reserva) {
                        for (const [key, value] of Object.entries(
                            requestSala.result.reservas[i]
                        )) {
                            if (key !== "data") {
                                let status = resultados[j].querySelector(".reservar");
                                let professor = resultados[j].querySelector(".professor");
                                let cancelar = resultados[j].querySelector(".cancelar");
                                if (value === null || value === undefined || value === "") {
                                    status.checked = false;
                                    status.disabled = false;
                                    professor.innerHTML = "Disponível";
                                    cancelar.innerHTML = "Reservar";
                                    j++;
                                } else {
                                    let botao_cancelar = document.createElement("button");
                                    botao_cancelar.setAttribute(
                                        "onclick",
                                        'cancelarReserva("turno' + (j + 1) + '")'
                                    );
                                    botao_cancelar.innerHTML = "Cancelar";
                                    status.checked = true;
                                    status.disabled = true;
                                    professor.innerHTML = String(value);
                                    if (cancelar.innerHTML === "") {
                                        cancelar.appendChild(botao_cancelar);
                                    }
                                    j++;
                                }
                            }
                        }
                    }
                }
            }
        };
    };
}

/* Função para cancelar reserva */

export function cancelarReserva(n) {
    let i;
	n = n.toString;
	let sala_id = document.getElementById("sala_id").innerHTML;
	let data_reserva = getDate(document.getElementById("data_reserva").value);
	let dbName = "salasDB";
	const request = indexedDB.open(dbName, 2);

	request.onsuccess = (event) => {
		const db = event.target.result;

		const transaction = db.transaction(["salas"], "readwrite");
		const objectStore = transaction.objectStore("salas");
		const index = objectStore.index("sala_id");
		const requestSala = index.get(sala_id);

		requestSala.onerror = () => {
			console.log("Sala inexiste.");
		};

		requestSala.onsuccess = () => {
			let index;
			for (i = 0; i < requestSala.result.reservas.length; i++) {
				if (requestSala.result.reservas[i].data === data_reserva) {
					index = i;
					break;
				}
			}
			// Achar uma maneira de passar "n" como chave
			switch (n) {
				case "turno1":
					requestSala.result.reservas[index].turno1 = "";
					break;
				case "turno2":
					requestSala.result.reservas[index].turno2 = "";
					break;
				case "turno3":
					requestSala.result.reservas[index].turno3 = "";
					break;
				case "turno4":
					requestSala.result.reservas[index].turno4 = "";
					break;
				case "turno5":
					requestSala.result.reservas[index].turno5 = "";
					break;
				case "turno6":
					requestSala.result.reservas[index].turno6 = "";
					break;
			}
			const updateRequest = objectStore.put(requestSala.result);
			updateRequest.onsuccess = () => {
				console.log("Record updated successfully!");
			};
		};
	};
}

/* Função para atualizar dados, usada para definir reservas */
export function reservar() {
	let sala_id = document.getElementById("sala_id").innerHTML;
	let dbName = "salasDB";
	const request = indexedDB.open(dbName, 2);

	request.onsuccess = (event) => {
		const db = event.target.result;

		const transaction = db.transaction(["salas"], "readwrite");
		const objectStore = transaction.objectStore("salas");
		const index = objectStore.index("sala_id");
		const requestSala = index.get(sala_id);

		requestSala.onerror = () => {
			console.log("Sala inexiste.");
		};

		requestSala.onsuccess = () => {
			console.log(sala_id);
			let data = getDate(document.getElementById("data_reserva").value);
			let dados = requestSala.result;
			let reservas = dados.reservas;
			let usuario = localStorage.getItem("usuario_atual");
			let turnos_reservados = document.getElementsByClassName("reservar");
			//let resultados = document.getElementsByClassName("reserva");

			let i;

			if (reservas.find((x) => x.data === data) === undefined) {
				i = 0;
			} else {
				i = reservas.findIndex((x) => x.data === data);
			}

            let turno1;
            let turno2;
            let turno3;
            let turno4;
            let turno5;
            let turno6;

			/* Melhorar código, usando uma variável como chave */
			if (turnos_reservados[0].checked && !turnos_reservados[0].disabled) {
				turno1 = usuario;
			} else if (
				turnos_reservados[0].checked &&
				turnos_reservados[0].disabled
			) {
				turno1 = reservas[i].turno1;
			} else {
				turno1 = null;
			}

			if (turnos_reservados[1].checked && !turnos_reservados[1].disabled) {
				turno2 = usuario;
			} else if (
				turnos_reservados[1].checked &&
				turnos_reservados[1].disabled
			) {
				turno2 = reservas[i].turno2;
			} else {
				turno2 = null;
			}

			if (turnos_reservados[2].checked && !turnos_reservados[0].disabled) {
				turno3 = usuario;
			} else if (
				turnos_reservados[2].checked &&
				turnos_reservados[2].disabled
			) {
				turno3 = reservas[i].turno3;
			} else {
				turno3 = null;
			}

			if (turnos_reservados[3].checked && !turnos_reservados[0].disabled) {
				turno4 = usuario;
			} else if (
				turnos_reservados[3].checked &&
				turnos_reservados[3].disabled
			) {
				turno4 = reservas[i].turno4;
			} else {
				turno4 = null;
			}

			if (turnos_reservados[4].checked && !turnos_reservados[0].disabled) {
				turno5 = usuario;
			} else if (
				turnos_reservados[4].checked &&
				turnos_reservados[4].disabled
			) {
				turno5 = reservas[i].turno5;
			} else {
				turno5 = null;
			}

			if (turnos_reservados[5].checked && !turnos_reservados[0].disabled) {
				turno6 = usuario;
			} else if (
				turnos_reservados[5].checked &&
				turnos_reservados[5].disabled
			) {
				turno6 = reservas[i].turno6;
			} else {
				turno6 = null;
			}

			if (i === 0) {
				dados.reservas.push({
					data: data,
					turno1: turno1,
					turno2: turno2,
					turno3: turno3,
					turno4: turno4,
					turno5: turno5,
					turno6: turno6,
				});
			} else {
				dados.reservas[i] = {
					data: data,
					turno1: turno1,
					turno2: turno2,
					turno3: turno3,
					turno4: turno4,
					turno5: turno5,
					turno6: turno6,
				};
			}

			const updateRequest = objectStore.put(dados);
			updateRequest.onsuccess = () => {
				console.log("Reserva Feita!");
			};
		};
	};
}

// carrega o banco de dados depois que a página carregar por completo
document.addEventListener("DOMContentLoaded", () => criar_db("salasDB"));
document.addEventListener("DOMContentLoaded", () => escrever_salas());
document.addEventListener("DOMContentLoaded", () => mostrar_usuario_logado());
//document.addEventListener("DOMContentLoaded", () => mostrar_reservas(sala_id));

document
	.getElementById("botao-cadastro-sala")
	.addEventListener("click", cadastrar_sala);

document
	.getElementById("botao-cadastro-usuario")
	.addEventListener("click", cadastrar_usuario);

document.getElementById("botao-login").addEventListener("click", fazer_login);
document.getElementById("usuario_logado_sair").addEventListener("click", sair);

document
	.getElementById("confirmar_reserva")
	.addEventListener("click", reservar);

window.mostrar_reservas = mostrar_reservas;
window.cancelarReserva = cancelarReserva;
