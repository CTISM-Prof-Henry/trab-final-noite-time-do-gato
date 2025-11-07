// Declara a classe do objeto "sala"
// Não está sendo possível importar a classe no momento. Arrumar e remover a classe “Sala” deste script.

class Sala {
    id = "";
    predio = "";
    numero = "";
    capacidade = "";
    tipo = "";
    constructor(id, predio, numero, capacidade, tipo) {
        this.id = id;
        this.predio = predio;
        this.numero = numero;
        this.capacidade = capacidade;
        this.tipo = tipo;
    }

    get_predio() {
        return this.predio;
    }

    get_numero() {
        return this.numero;
    }
}

// Igualmente para o código referente ao IndexedDB
// IndexedDB

let dbName = "salasDB";
let db;
let request = indexedDB.open(dbName, 1);

request.onupgradeneeded = (event) => {
    db = event.target.result;

    const objectStore = db.createObjectStore("salas", { keyPath: "id" });

    objectStore.createIndex("predio", "predio", { unique: false });
    objectStore.createIndex("numero", "numero", { unique: false });
}

request.onsucess = (event) => {
    db = event.target.result;
}

request.onerror = (event) => {
    console.log("Erro.");
}


function adicionar_db(dbName, sala) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onerror = (event) => {
            console.log("Erro ao inicializar o banco de dados.")
        }

        request.onsuccess = (event) => {
            const db = event.target.result;
            const objectStore = db.createObjectStore("salas", { keyPath: "id" });

            const transaction = db.transaction([objectStore], 'readwrite');

            transaction.oncomplete = () => {
                resolve('Data added successfully!');
            };
            
            const objectStore1 = transaction.objectStore(objectStore);

            const addRequest = objectStore1.add(sala);

        }
    });
}

function cadastrar_sala(event) {
    event.preventDefault();
    let predio = document.getElementById("predios").value;
    let numero = document.getElementById("numero").value;
    let capacidade = document.getElementById("capacidade").value;
    let tipo = document.getElementById("tipo").value;
    if (numero === "" || capacidade === "") {
        alert("Favor preencher todos os valores.") // Adicionar função de alerta de falta de valores
    } else {
        let name = predio.toString() + numero.toString();
        if (localStorage.getItem(name)) {
            alert("Sala já cadastrada"); // Adicionar função de alerta para sala já cadastrada
        } else {
            let sala = new Sala(name, predio, numero, capacidade, tipo);
            adicionar_db(dbName, sala);
            alert("Sucesso"); // Adicionar função de alerta de sala cadastrada com sucesso
        }
    }
}

document.getElementById("botao-cadastro").addEventListener('click', cadastrar_sala);