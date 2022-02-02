module.exports = {
    GET: (req, res) => {
        switch(req.baseUrl[1]){
            case "projects":
                if(req.baseUrl[2]){
                    global.functions.mongodb.findOne("projects", { Pid: req.baseUrl[2] }).then((rep) => {
                        if(rep && rep.visible){
                            res.render(req.baseUrl[0] + "/" + req.baseUrl[0], {modules: req.baseUrl[0], page: "loreProject", rep: rep, cookie: req.cookie, title: "admin", scripts: ["component"]})
                        }
                        else{
                            res.redirect("/" + req.baseUrl[0] + "/" + req.baseUrl[1])
                        }
                    })
                }
                else{
                    res.render(req.baseUrl[0] + "/" + req.baseUrl[0], {modules: req.baseUrl[0], page: req.baseUrl[1], cookie: req.cookie, title: "projets", scripts: ["component"]})
                }
                break;

            case "professionalExp":
                res.render(req.baseUrl[0] + "/" + req.baseUrl[0], {modules: req.baseUrl[0], page: req.baseUrl[1], cookie: req.cookie, title: "expériences professionnelles", scripts: ["component"]})
                break;
            
            case "skills":
                res.render(req.baseUrl[0] + "/" + req.baseUrl[0], {modules: req.baseUrl[0], page: req.baseUrl[1], cookie: req.cookie, title: "compétences", scripts: ["component"]})
                break;

            case "degree":
                res.render(req.baseUrl[0] + "/" + req.baseUrl[0], {modules: req.baseUrl[0], page: req.baseUrl[1], cookie: req.cookie, title: "diplômes", scripts: ["component"]})
                break;
        
            default:
                res.render(req.baseUrl[0] + "/" + req.baseUrl[0], {modules: req.baseUrl[0], page: "accueil", cookie: req.cookie, title: "Mathieu Campani", scripts: []})
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
        
            default:
                res.status(404).send("none");
                break;
        }

    },
    httpAcces: (req, res) => {
        return true
    },
    socket: (socket, io) => {

    },
    socketAcces: (auth) => {
        return true
    }
}