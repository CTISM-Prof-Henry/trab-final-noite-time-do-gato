/* Função para validar cpf de usuários */
export function validaCPF(cpf) {
	let regex = /^\d+$/;
	if (cpf.length === 11 && regex.test(cpf)) {
		return true;
	} else {
		return false;
	}
}

/* Função para arrumar data */

export function getDate(s) {
	let data_bruta = new Date(s);
	data_bruta.setHours(data_bruta.getHours() + 3);
	let data = data_bruta.toISOString();
	data = data.split("T")[0];
	return data;
}

export function validaSala(numero, capacidade) {
	let regex = /^\d{3}/;
	if (!regex.test(numero) || numero.length != 3) {
		return "Erro. O número da sala deve ter apenas três dígitos numéricos.";
	}
	if (capacidade < 10 || capacidade > 40) {
		return "Erro. A capacidade da sala deve ser entre 10 e 40";
	}
	return true;
}