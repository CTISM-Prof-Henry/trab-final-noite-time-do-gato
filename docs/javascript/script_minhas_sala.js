// Laço para preencher o arquivo HTML com os dados das salas.
for (i = 0; i < localStorage.length; i++) {
    //console.log(lista_sala[0]);
    let table = document.getElementById("table-body");
    let row = document.createElement('tr');
    for (const [key, value] of Object.keys(localStorage)) {
        let table_data = document.createElement('td');
        table_data.innerHTML = `${value}`;
        row.appendChild(table_data);
        //console.log(`${key} : ${value}`);
    }
    table.appendChild(row);
}
