/*
// Laço para preencher o arquivo HTML com os dados das salas.
for (i = 0; i < localStorage.length; i++) {
	//console.log(lista_sala[0]);
	let key = localStorage.key(i);
	console.log(key);
	let values = JSON.parse(localStorage.getItem(key));
	console.log(values);
	let table = document.getElementById("table-body");
	let row = document.createElement("tr");
	for (const [key, value] of Object.entries(values)) {
		let table_data = document.createElement("td");
		table_data.innerHTML = `${value}`;
		row.appendChild(table_data);
		//console.log(`${key} : ${value}`);
	}
	table.appendChild(row);
}
*/