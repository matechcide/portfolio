const listComponent = {}

class component{
    constructor(div){
        this.#div = div
        this.#waitClass = div.className
        this.#name = this.#div.title
        this.#div.innerText = "Chargement du composant..."
        this.#div.id = ""
        setTimeout(() => {
            this.refresh()
        }, 50);
    }

    async refresh(body={}){
        this.#div.className += " " + this.#waitClass
        this.#removeJS(this.#div.children)
        let temp = await this.#request(body)
        this.#div.outerHTML = temp
        this.#div = document.getElementById(this.#name)
        this.#end()
    }

    async #request(body){
        return new Promise((resolve, reject) => {
            fetch(window.location.origin + "/" + this.#path + "/" + this.#name, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'action': 'components'
                },
                body: JSON.stringify(body)
            })
            .then( response => response.json() )
            .then( response => {
                if(this.#requestResponse(response)){
                    resolve(response.component)
                }
                else{
                    reject(response)
                }
            })
            .catch(this.#error)
        })
    }

    on(event, callBack){
        switch(event){
            case "end":
                this.#end = callBack
                break;

            case "error":
                this.#error = callBack
                break;

            case "requestResponse":
                this.#requestResponse = callBack
                break;

            default:
                break;
        }
    }

    #removeJS(E){
        for(const element of E){
            element.onclick = ""
            this.#removeJS(element.children)
        }
        return
    }

    #end = () => { }

    #requestResponse = (rep) => { return true }

    #error = (err) => { this.#div.innerText = "Erreur lors du chargement du composant."; throw err }

    #path = window.location.href.replace(window.location.origin + "/", "").split("?")[0].split("/")[0]

    #name = ""

    #div = {}

    #waitClass = {}
}

window.addEventListener("DOMContentLoaded", async (event) => {
    while(document.getElementById("component")){
        let _component = document.getElementById("component")
        listComponent[_component.title] = new component(_component)
    }
});