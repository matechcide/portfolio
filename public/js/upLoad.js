class upLoad{
    constructor(input, label){
        this.#input = document.getElementById(input)
        this.#label = document.getElementById(label)
        this.#input.addEventListener("change", () => {
            this.#files = this.#input.files
            this.#id = Date.now()
            if(!this.#files[0]){
                return
            }
            else{
                this.start()
            }
        })
    }

    async start(){
        if(this.status) return
        this.status = true
        let sendingFile = 0
        let numFileSend = 0
        this.#start(this.#files)
        for await(const file of this.#files){
            if(sendingFile >= this.maxSendingFile){
                await new Promise((resolve) => {
                    const interval = setInterval(async () => {
                        if(sendingFile < this.maxSendingFile){
                            clearInterval(interval)
                            sendingFile++
                            resolve()
                        }
                    }, 500);
                })
            }
            else{
                sendingFile++
            }
            (async () => {
            numFileSend++
            let numFile = numFileSend
            let byteSend = 0
            let byteFile = file.size
            let id = this.#id+Date.now()
            let sendingChunk = 0
            let numberCut = 0

            await this.#request({
                status: "startUpLoad",
                name: file.name,
                fileSize: file.size,
                info: this.info, 
                id: id,
            })

            this.#startFileUpLoad(file, numFile)

            for(let index = 0; index < byteFile; index += this.cutSize){
                const tempIndex = Math.ceil(index/this.cutSize)

                if(sendingChunk >= this.maxSendingCut){
                    await new Promise((resolve) => {
                        const interval = setInterval(() => {
                            if(numberCut == tempIndex){
                                clearInterval(interval)
                                resolve()
                            }
                            else if(!this.status){
                                clearInterval(interval)
                                resolve()
                            }
                        }, 100)
                    })
                }
                sendingChunk++

                await this.#request({
                    status: "startCut",
                    name: file.name,
                    info: this.info, 
                    index: tempIndex,
                    id: id,
                })

                this.#startFileCut(file, numFile, byteSend)
                
                const reader = new FileReader();
                let slice = file.slice(index, index + this.cutSize);
                byteSend += slice.size
                reader.readAsArrayBuffer(slice);

                reader.onload = async () => {
                    let result = arrayBufferToBase64(reader.result)
                    for(let byts = 0; byts <= result.length; byts += this.chunkSize){
                        let temp = result.slice(byts, byts + this.chunkSize)
                        if(temp.length == 0) return

                        await this.#request({
                            status: "upLoadChunk",
                            name: file.name,
                            info: this.info, 
                            id: id,
                            index: tempIndex, 
                            chunk: temp,
                        })
                    }

                    await this.#request({
                        status: "endCut",
                        name: file.name,
                        info: this.info, 
                        id: id,
                        index: tempIndex,
                    })
                    sendingChunk--

                    this.#endFileCut(file, numFile, byteSend)

                    numberCut++
                }

            }
            await new Promise((resolve) => {
                const interval = setInterval(async () => {
                    if(numberCut == Math.ceil(byteFile/this.cutSize)){
                        clearInterval(interval)
                        await this.#request({
                            status: "endUpLoad",
                            name: file.name,
                            info: this.info, 
                            id: id,
                        })
                        resolve()
                    }
                    
                }, 100);
            })
            sendingFile--
            this.#endFileUpLoad(file, numFile)
            if(numFileSend == this.#files.length){
                this.status = false
                this.#files = []
                this.#input.value = []
                this.#end()
            }
            })()
        }
    }

    async #request(body){
        return new Promise((resolve, reject) => {
            fetch(this.url, {
                method: this.method,
                headers: this.headers,
                body: JSON.stringify(body)
            })
            .then( response => response.json() )
            .then( response => {
                if(this.#requestResponse(response)){
                    resolve()
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
            case "error":
                this.#error = callBack
                break;

            case "start":
                this.#start = callBack
                break;

            case "startFileUpLoad":
                this.#startFileUpLoad = callBack
                break;

            case "startFileCut":
                this.#startFileCut = callBack
                break;

            case "endFileCut":
                this.#endFileCut = callBack
                break;

            case "endFileUpLoad":
                this.#endFileUpLoad = callBack
                break;

            case "end":
                this.#end = callBack
                break;

            case "requestResponse":
                this.#requestResponse = callBack
                break;
        
            default:
                break;
        }
    }

    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'action': 'upload'
    }

    maxSendingFile = 1

    info = {}

    cutSize = 500000

    chunkSize = 100000

    method = "POST"

    url = window.location.href

    maxSendingCut = 5

    #start = () => {}

    #end = () => {}

    #endFileUpLoad = () => {}

    #endFileCut = (file, numFile, byteSend) => {
        if(this.#label){
            this.#label.innerText = file.name + " :" + "\n" + Math.ceil(byteSend/1024/1024) + "/" + Math.ceil(file.size/1024/1024) + "Mo" + " " + numFile + "/" + this.#files.length
        }
    }

    #startFileCut = () => {}

    #startFileUpLoad = (file, numFile) => {
        if(this.#label){
            this.#label.innerText = "début de l'envoi de  :" + "\n" + file.name + numFile + "/" + this.#files.length
        }
    }

    #error = (err) => { throw err }

    #requestResponse = () => { return true }

    #input = {}
    
    #label = {}

    #files = []

    #id = 0

    status = false
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}