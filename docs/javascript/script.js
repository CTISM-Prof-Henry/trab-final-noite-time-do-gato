// Declara a classe do objeto "sala"

class Sala {
    predio = "";
    numero = "";
    capacidade = "";
    tipo = "";
    horario_inicial = "";
    horario_final = "";
    recorrente = "";
    constructor(predio, numero, capacidade, tipo, horario_inicial, horario_final, recorrente) {
        this.predio = predio;
        this.numero = numero;
        this.capacidade = capacidade;
        this.tipo = tipo;
        this.horario_inicial = horario_inicial;
        this.horario_final = horario_final;
        this.recorrente = recorrente;
    }
}