import { getDate, validaCPF, validaSala } from "../validacoes.js"

function testaData(assert) {
    let datas = ["2026-01-01", "2026-05-12", "2026-07-08"];

    let data_01 = getDate(datas[0]);
    let data_02 = getDate(datas[1]);
    let data_03 = getDate(datas[2]);
    
    assert.equal(data_01, datas[0]);
    assert.equal(data_02, datas[1]);
    assert.equal(data_03, datas[2]);

}

function testaSala(assert) {
    let salas = [
        ['101', 50],
        ['201', 20],
        ['101', 15],
        ['50A', 20],
        ['4O8', 30]
    ];

    assert.equal(validaSala(salas[0][0], salas[0][1]), "Erro. A capacidade da sala deve ser entre 10 e 40");
    assert.equal(validaSala(salas[1][0], salas[1][1]), true);
    assert.equal(validaSala(salas[2][0], salas[2][1]), true);
    assert.equal(validaSala(salas[3][0], salas[3][1]), "Erro. O número da sala deve ter apenas três dígitos numéricos.");
    assert.equal(validaSala(salas[4][0], salas[4][1]), "Erro. O número da sala deve ter apenas três dígitos numéricos.");

}

function testaCPF(assert) {
    let cpfs = ["01822347033", "123456789", "98765432109", "123456789AB"];

    assert.equal(validaCPF(cpfs[0]), true);
    assert.equal(validaCPF(cpfs[1]), false);
    assert.equal(validaCPF(cpfs[2]), true);
    assert.equal(validaCPF(cpfs[3]), false);
}

QUnit.module("index", () => {
    QUnit.test("testa data", assert => testaData(assert));
    QUnit.test("testa sala", assert => testaSala(assert));
    QUnit.test("testa cpf", assert => testaCPF(assert));
});