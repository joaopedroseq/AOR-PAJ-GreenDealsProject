import { carregarHeader } from "./scriptHeader.js";
import { carregarFooter } from "./scriptFooter.js";
import { fetchRequest } from "./funcoesGerais.js";

document.addEventListener("DOMContentLoaded", async function () {
  await carregarHeader();
  await carregarAsideAdmin();
  await carregarFooter();
});

async function carregarAsideAdmin() {
  fetch("asideAdmin.html")
    .then((response) => response.text())
    .then(async (data) => {
      document.getElementById("aside-placeholder").innerHTML = data;
      inicializarBotoesAsideAdmin();
    });
}

function inicializarBotoesAsideAdmin() {
  //listar os botões do aside
}
