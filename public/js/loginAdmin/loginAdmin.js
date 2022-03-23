document.getElementById("form").addEventListener("submit", (event) => {
    event.preventDefault();

    seeInfo("En attente d'une réponse du serveur...")
    toModule("connect", {id: document.getElementById("id").value, mdp: document.getElementById("mdp").value}).then((rep) => {
        if(rep.callback){
            window.location.href = rep.callback
        }
        else{
            window.location.href = "/admin"
        }
    }).catch(() => {
        deleteInfo()
    })
})