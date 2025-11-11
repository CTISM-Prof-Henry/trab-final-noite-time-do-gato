// Declara a classe do objeto "sala"
// Não está sendo possível importar a classe no momento. Arrumar e remover a classe “Sala” deste script.

// ponteiro para o banco de dados
let db = null;

function criar_db(dbName) {
    const request = indexedDB.open(dbName, 2);

    request.onerror = (event) => {
        console.log("Erro ao inicializar o banco de dados.")
    }

    request.onsuccess = (event) => {
        db = event.target.result;
    }

    request.onupgradeneeded = (event) => {
        db = event.target.result;

        let objectStore = db.createObjectStore(
            "salas", {
                keyPath: "id"  // usa o campo id como chave
            }
        );
        objectStore.createIndex("predio_sala_idx", ["predio", "numero"], { unique: true });
        console.log("Atualização do banco de dados pronta!");
    };

    if(db !== null) {
        db.onerror = (event) => {
            console.error(`Erro de DB\n: ${event.target.error?.message}`);
        };
    }
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

        request.onsuccess = ((event) => {
            if (request.result) {
                resolve(request.result); // sala encontrada
            } else {
                resolve(null); // não encontrada
            }
        });
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
        tipo: tipo
    };
    if (numero === "" || capacidade === "") {
        alert("Favor preencher todos os valores.") // Adicionar função de alerta de falta de valores
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

// carrega o banco de dados depois que a página carregar por completo
document.addEventListener('DOMContentLoaded', () => criar_db("salasDB"));
document.getElementById("botao-cadastro").addEventListener('click', cadastrar_sala);