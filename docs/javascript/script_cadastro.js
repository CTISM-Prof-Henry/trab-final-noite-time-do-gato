// Declara a classe do objeto "sala"

let i;
var lista_sala = [];

class Sala {
    predio = "";
    numero = "";
    capacidade = "";
    tipo = "";
    constructor(predio, numero, capacidade, tipo) {
        this.predio = predio;
        this.numero = numero;
        this.capacidade = capacidade;
        this.tipo = tipo;
    }
}

class SalaReserva extends Sala {
    predio = "";
    numero = "";
    capacidade = "";
    tipo = "";
    dia = "";
    horario_inicial = "";
    horario_final = "";
    recorrente = "";
    constructor(Sala, dia, horario_inicial, horario_final, recorrente) {
        super(Sala);
        this.predio = Sala.predio;
        this.numero = Sala.numero;
        this.capacidade = Sala.capacidade;
        this.tipo = Sala.tipo;
        this.dia = dia;
        this.horario_inicial = horario_inicial;
        this.horario_final = horario_final;
        this.recorrente = recorrente;
    }
}

// Definir alguns objetos para fins de teste
/*let a202 = new Sala("A", 202, 30, "Lab");
let b203 = new Sala("B", 203, 30, "Lab",);

let a202_reserva = new SalaReserva(a202, '15/09/2025', '19:00', '23:00', 1);
lista_sala.push(a202_reserva);
let b203_reserva = new SalaReserva(b203, '15/09/2025', '19:00', '23:00', 1);
lista_sala.push(b203_reserva);*/

// Cadastrar sala

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
            let sala = new Sala(predio, numero, capacidade, tipo);
            let jsonString = JSON.stringify(sala);
            localStorage.setItem(name.toString(), jsonString);
            alert("Sucesso"); // Adicionar função de alerta de sala cadastrada com sucesso
        }
    }
}

document.getElementById("botao-cadastro").addEventListener('click', cadastrar_sala);