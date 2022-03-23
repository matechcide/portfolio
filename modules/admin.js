const fs = require('fs')

module.exports = {
    GET: (req, res) => {
        switch(req.baseUrl[1]){
            case "files":
                res.render(req.baseUrl[0] + "/" + req.baseUrl[0], {modules: req.baseUrl[0], page: req.baseUrl[1], cookie: req.cookie, title: "admin", scripts: ["component", "info", "toModule", "upLoad"]})
                break;

            case "projects":
                if(req.baseUrl[2]){
                    global.functions.mongodb.findOne("projects", { Pid: req.baseUrl[2] }).then((rep) => {
                        if(rep){
                            res.render(req.baseUrl[0] + "/" + req.baseUrl[0], {modules: req.baseUrl[0], page: "loreProject", rep: rep, cookie: req.cookie, title: "admin", scripts: ["info", "toModule", "component"]})
                        }
                        else{
                            res.redirect("/" + req.baseUrl[0] + "/" + req.baseUrl[1])
                        }
                    })
                }
                else{
                    res.render(req.baseUrl[0] + "/" + req.baseUrl[0], {modules: req.baseUrl[0], page: req.baseUrl[1], cookie: req.cookie, title: "admin", scripts: ["component", "info", "toModule"]})
                }
                break;

            case "professionalExp":
                res.render(req.baseUrl[0] + "/" + req.baseUrl[0], {modules: req.baseUrl[0], page: req.baseUrl[1], cookie: req.cookie, title: "admin", scripts: ["component", "info", "toModule"]})
                break;
            
            case "skills":
                res.render(req.baseUrl[0] + "/" + req.baseUrl[0], {modules: req.baseUrl[0], page: req.baseUrl[1], cookie: req.cookie, title: "admin", scripts: ["component", "info", "toModule"]})
                break;

            case "degree":
                res.render(req.baseUrl[0] + "/" + req.baseUrl[0], {modules: req.baseUrl[0], page: req.baseUrl[1], cookie: req.cookie, title: "admin", scripts: ["component", "info", "toModule"]})
                break;
        
            default:
                res.render(req.baseUrl[0] + "/" + req.baseUrl[0], {modules: req.baseUrl[0], page: "accueil", cookie: req.cookie, title: "admin", scripts: ["toModule"]})
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

            case "restart":
                process.exit(1);
                break;

            case "getAccueil":
                res.send({
                    statut: "successful",
                    info: fs.readFileSync(global.dir + "/views/index/accueil.ejs", 'utf8').toString()
                })
                break;

            case "setAccueil":
                fs.writeFileSync(global.dir + "/views/index/accueil.ejs", req.body.page)
                res.send({
                    statut: "successful",
                    info: global.json.admin.accueil.successfulSave
                })
                break;

            case "addFolder":
                if(req.body.path && req.body.path.indexOf("..") > -1){
                    res.send({
                        statut: "error",
                        info: global.json.admin.files.errorAddFolder
                    })
                }
                else if(fs.existsSync(global.dir + "/public/files" + req.body.folder)){
                    res.send({
                        statut: "error",
                        info: global.json.admin.files.alreadyExist
                    })
                }
                else{
                    fs.mkdirSync(global.dir + "/public/files" + req.body.folder)
                    res.send({
                        statut: "successful",
                        info: global.json.admin.files.successful
                    })
                }
                break;

            case "deleteFile":
                if(req.body.path.indexOf("..") > -1){
                    res.send({
                        statut: "error",
                        info: global.json.admin.files.errorDelete
                    })
                }
                else{
                    fs.rmSync(global.dir + "/public/files" + req.body.path, { recursive: true, force: true });
                    res.send({
                        statut: "successful",
                        info: global.json.admin.files.successfulDelete
                    })
                }
                break;

            case "renameFile":
                if(req.body.new.indexOf("..") > -1 || req.body.old.indexOf("..") > -1 || fs.existsSync(global.dir + "/public/files" + req.body.path + req.body.new)){
                    res.send({
                        statut: "error",
                        info: global.json.admin.files.errorRename
                    })
                }
                else{
                    fs.renameSync(global.dir + "/public/files" + req.body.path + req.body.old, global.dir + "/public/files" + req.body.path + req.body.new)
                    res.send({
                        statut: "successful",
                        info: global.json.admin.files.successfulRename
                    })
                }
                break;

            case "upload":
                global.functions.upLoad[req.body.status](req.body, global.dir  + "/public/files" + req.body.info.path)
                res.send({})
                break;

            case "postDegree":
                global.functions.mongodb.findOne("degree", { name: req.body.name }, { projection: { _id: 1 } }).then((rep) => {
                    if(rep){
                        res.send({
                            statut: "error",
                            info: global.json.admin.degree.alreadyExist
                        })
                    }
                    else{
                        global.functions.mongodb.insertOne("degree", req.body).then((rep) => {
                            res.send({
                                statut: "successful",
                                info: global.json.admin.degree.successful
                            })
                        })
                    }
                })
                break;

            case "deleteDegree":
                global.functions.mongodb.deleteOne("degree", { name: req.body.name }).then((rep) => {
                    res.send({
                        statut: "successful",
                        info: global.json.admin.degree.successfulDelete
                    })
                })
                break;

            case "replaceDegree":
                if(req.body.oldName == req.body.name){
                    global.functions.mongodb.replaceOne("degree", { name: req.body.oldName }, req.body).then((rep) => {
                        res.send({
                            statut: "successful",
                            info: global.json.admin.degree.successfulEdit
                        })
                    })
                }
                else{
                    global.functions.mongodb.findOne("degree", { name: req.body.name }).then((rep) => {
                        if(rep){
                            res.send({
                                statut: "error",
                                info: global.json.admin.degree.alreadyExist
                            })
                        }
                        else{
                            global.functions.mongodb.replaceOne("degree", { name: req.body.oldName }, req.body).then((rep) => {
                                res.send({
                                    statut: "successful",
                                    info: global.json.admin.degree.successfulEdit
                                })
                            })
                        }
                    })
                }
                break;
            
            case "visibleDegree":
                global.functions.mongodb.updateOne("degree", { name: req.body.Pid }, { $set: { visible: req.body.visible } }).then((rep) => {
                    res.send({
                        statut: "successful"
                    })
                })
                break;

            case "postSkills":
                global.functions.mongodb.findOne("skills", { name: req.body.name }, { projection: { _id: 1 } }).then((rep) => {
                    if(rep){
                        res.send({
                            statut: "error",
                            info: global.json.admin.skills.alreadyExist
                        })
                    }
                    else{
                        global.functions.mongodb.insertOne("skills", req.body).then((rep) => {
                            res.send({
                                statut: "successful",
                                info: global.json.admin.skills.successful
                            })
                        })
                    }
                })
                break;

            case "deleteSkill":
                global.functions.mongodb.deleteOne("skills", { name: req.body.name }).then((rep) => {
                    res.send({
                        statut: "successful",
                        info: global.json.admin.skills.successfulDelete
                    })
                })
                break;

            case "replaceSkill":
                if(req.body.oldName == req.body.name){
                    global.functions.mongodb.replaceOne("skills", { name: req.body.oldName }, req.body).then((rep) => {
                        res.send({
                            statut: "successful",
                            info: global.json.admin.skills.successfulEdit
                        })
                    })
                }
                else{
                    global.functions.mongodb.findOne("skills", { name: req.body.name }).then((rep) => {
                        if(rep){
                            res.send({
                                statut: "error",
                                info: global.json.admin.skills.alreadyExist
                            })
                        }
                        else{
                            global.functions.mongodb.replaceOne("skills", { name: req.body.oldName }, req.body).then((rep) => {
                                res.send({
                                    statut: "successful",
                                    info: global.json.admin.skills.successfulEdit
                                })
                            })
                        }
                    })
                }
                break;

            case "visibleSkill":
                global.functions.mongodb.updateOne("skills", { name: req.body.Pid }, { $set: { visible: req.body.visible } }).then((rep) => {
                    res.send({
                        statut: "successful"
                    })
                })
                break;

            case "postProfessionalExp":
                global.functions.mongodb.insertOne("professionalExp", req.body).then((rep) => {
                    res.send({
                        statut: "successful",
                        info: global.json.admin.professionalExp.successful
                    })
                })
                break;

            case "deleteProfessionalExp":
                global.functions.mongodb.deleteOne("professionalExp", { Pid: req.body.Pid }).then((rep) => {
                    res.send({
                        statut: "successful",
                        info: global.json.admin.professionalExp.successfulDelete
                    })
                })
                break;

            case "replaceProfessionalExp":
                global.functions.mongodb.replaceOne("professionalExp", { Pid: req.body.Pid }, req.body).then((rep) => {
                    res.send({
                        statut: "successful",
                        info: global.json.admin.professionalExp.successfulEdit
                    })
                })
                break;

            case "visibleProfessionalExp":
                global.functions.mongodb.updateOne("professionalExp", { Pid: req.body.Pid }, { $set: { visible: req.body.visible } }).then((rep) => {
                    res.send({
                        statut: "successful"
                    })
                })
                break;

            case "postProject":
                global.functions.mongodb.insertOne("projects", req.body).then((rep) => {
                    res.send({
                        statut: "successful",
                        info: global.json.admin.projects.successful
                    })
                })
                break;

            case "deleteProject":
                global.functions.mongodb.deleteOne("projects", { Pid: req.body.Pid }).then((rep) => {
                    res.send({
                        statut: "successful",
                        info: global.json.admin.projects.successfulDelete
                    })
                })
                break;

            case "replaceProject":
                global.functions.mongodb.replaceOne("projects", { Pid: req.body.Pid }, req.body).then((rep) => {
                    res.send({
                        statut: "successful",
                        info: global.json.admin.projects.successfulEdit
                    })
                })
                break;

            case "visibleProject":
                global.functions.mongodb.updateOne("projects", { Pid: req.body.Pid }, { $set: { visible: req.body.visible } }).then((rep) => {
                    res.send({
                        statut: "successful"
                    })
                })
                break;
        
            default:
                res.status(404).send("none");
                break;
        }

    },
    httpAcces: (req, res) => {
        if(global.functions.token.exist("admin", req.cookies.token)){
            return true
        }
        else if(req.method == "GET"){
            res.redirect("/loginAdmin?callback=" + req.originalUrl)
        }
        else{
            res.send({
                statut: "error",
                info: global.json.admin.errorToken
            })
        }
        throw ""
    },
    socket: (socket, io) => {

    },
    socketAcces: (auth) => {
        return true
    }
}