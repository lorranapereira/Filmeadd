var openRequest = window.indexedDB.open('playfilmes',9);
let db;

openRequest.onupgradeneeded = e => {

    console.log('Cria ou altera um banco já existente');
};

openRequest.onsuccess = e => {

    console.log('Conexão obtida com sucesso');
    db = e.target.result;
	pathname = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
	pathname == "index.html" ? lista() : "";
	
};

openRequest.onerror = e => {

    console.log(e.target.error);
};


let form = document.querySelector("#form");
form.addEventListener("submit", function(event) {
  event.preventDefault(); // Evita que o formulário seja enviado
  let name = form.querySelector("#title").value;
  let gender = form.querySelector("#gender :checked").value;
  let synopsis = form.querySelector("#synopsis").value;
  let ageRange = form.querySelector("#ageRange").value;
  saveData(name,gender,synopsis,ageRange);
});



function saveData(name,gender,synopsis,ageRange) {
    let transaction = db.transaction(["filme"], "readwrite");
    let objectStore = transaction.objectStore("filme");
    let request = objectStore.add({ name: name,gender: gender,synopsis: synopsis,ageRange: ageRange});
    request.onerror = function(event) {
      alert("Erro ao adicionar filme");
    };
    request.onsuccess = function(event) {
		alert("Filme adicionado com sucesso");
		window.location.href = 'index.html';
    };
}
function lista() {
    let transaction = db.transaction(["filme"], "readwrite");
    let objectStore = transaction.objectStore("filme");
	let request = objectStore.openCursor();
	request.onsuccess = function(event) {
		let cursor = event.target.result;
	        event.preventDefault();
		if (cursor) {
			let filme = cursor.value; 
			console.log(filme.name, filme.gender, filme.synopsis, filme.ageRange); 
			cursor.continue();
			let html = "<div class='card' id=" + filme.id + "><img src='/home/lorrana/Documentos/Filmes/imagens/netflix.jpg' width='400px' height='400px' class='card-img-top' alt='...'><div class='card-body'><h5 class='card-title'>" + filme.name + "</h5><p>" + filme.gender + "</p><p>"+  filme.ageRange + "</p><p>" + filme.synopsis + "</p><button onclick='deleteFilm(" + filme.id + ")'  class='btn btn-danger'>Deletar</a></div></div>";
			document.getElementById("grade").innerHTML += html;
		}
	}
}

function deleteFilm(id) {
	let transaction = db.transaction(["filme"], "readwrite");
    let objectStore = transaction.objectStore("filme");
    let request = objectStore.delete(id);
    request.onerror = function(event) {
		alert("Erro ao deletar filme");
		location.reload()

    };
    request.onsuccess = function(event) {
	  alert("Filme deletado com sucesso");
	  location.reload()
    };
}
