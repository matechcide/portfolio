const { ObjectId } = require("mongodb")

module.exports = {
    GET: (req, res) => {
        switch(req.baseUrl[1]){
            case "":
                res.render(req.baseUrl[0] + "/" + req.baseUrl[1], {modules: req.baseUrl[0], page: req.baseUrl[1], cookie: req.cookie, title: "", scripts: []})
                break;
        
            default:
                res.render(req.baseUrl[0] + "/" + req.baseUrl[0], {modules: req.baseUrl[0], page: req.baseUrl[0], cookie: req.cookie, title: "login", scripts: ["toModule", "info"]})
                break;
        }

    },
    POST: (req, res) => {
        switch(req.headers.action){
            case "components":
                if(global.components[req.baseUrl[0]] && global.components[req.baseUrl[0]][req.baseUrl[1]]){
                    global.components[req.baseUrl[0]][req.baseUrl[1]].render(req, res)
                }
                else{
                    res.status(404).send("none");
                }
                break;

            case "connect":
                if(!req.body.id || !req.body.mdp || req.body.id.length < 10 || req.body.mdp.length < 10){
                    res.send({
                        statut: "error",
                        info: global.json.loginAdmin.badIDorPWD
                    })
                }
                global.functions.mongodb.findOne("admin", { _id: ObjectId(req.body.id), mdp: req.body.mdp }).then((rep) => {
                    if(rep){
                        res.cookie("token", global.functions.token.make("admin", {}, 3600000))
                        res.send({
                            statut: "successful",
                            info: "",
                            callback: req.argUrl.callback
                        })
                    }
                    else{
                        res.send({
                            statut: "error",
                            info: global.json.loginAdmin.badIDorPWD
                        })
                    }
                })
                break;

            default:
                res.status(404).send("none");
                break;
        }

    },
    httpAcces: (req, res) => {
        if(global.functions.token.exist("admin", req.cookies.token)){
            res.redirect("/admin")
            throw ""
        }
        return true
    },
    socket: (socket, io) => {

    },
    socketAcces: (auth) => {
        return true
    }
}