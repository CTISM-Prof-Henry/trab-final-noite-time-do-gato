import Sala from "./script_cadastro.js";
import SalaReserva from "./script_cadastro.js";

// Dados para teste
let a101 = new Sala('A', 101, 30, "Lab");
let a101_reserva = new SalaReserva(a101, "16/09/2025", "19:00", "23:00", 1)
let b101 = new Sala('B', 101, 30, "Lab");
localStorage.clear();
localStorage.setItem("a101", JSON.stringify(a101));
localStorage.setItem("a101", JSON.stringify(a101_reserva));
localStorage.setItem("b101", JSON.stringify(b101));

let i;

// Laço para preencher o arquivo HTML com os dados das salas.
for (i = 0; i < localStorage.length; i++) {
    //console.log(lista_sala[0]);
    let key = localStorage.key(i);
    console.log(key);
    let values = JSON.parse(localStorage.getItem(key));
    console.log(values);
    let table = document.getElementById("table-body");
    let row = document.createElement('tr');
    for (const [key, value] of Object.entries(values)) {
        let table_data = document.createElement('td');
        table_data.innerHTML = `${value}`;
        row.appendChild(table_data);
        //console.log(`${key} : ${value}`);
    }
    table.appendChild(row);
}
