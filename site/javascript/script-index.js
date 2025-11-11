/* JavaScript para janela de cadastro de salas */

// Get the modal
let modal_sala = document.getElementById("cadastro_sala");
let modal_usuario = document.getElementById("cadastro_usuario");

// Get the button that opens the modal
let btn_sala = document.getElementById("botao_cadastrar_sala");
let btn_usuario = document.getElementById("botao_cadastrar_usuario");

// Get the <span> element that closes the modal
let span_sala = document.getElementsByClassName("close")[0];
let span_usuario = document.getElementsByClassName("close")[1];

// When the user clicks on the button, open the modal
btn_sala.onclick = function() {
  modal_sala.style.display = "block";
}

btn_usuario.onclick = function() {
  modal_usuario.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span_sala.onclick = function() {
  modal.style.display = "none";
}

span_usuario.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target === modal_sala || event.target === modal_usuario) {
    modal_sala.style.display = "none";
    modal_usuario.style.display = "none";
  }
} 