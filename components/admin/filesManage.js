const ejs = require('ejs')
const fs = require('fs')

module.exports = {
    html: (/*html*/`
        <div id="filesManage" class="border-[gray] border-[2px] p-[10px] w-[40%] flex flex-col items-center justify-start mt-[20px] rounded-[10px]">
            <div class="flex flex-row w-[90%] justify-start items-center">
                <button class="border-[2px] border-D bg-C rounded-[5px] text-[white] text-[10px] transition hover:scale-[110%] mr-[10px]" onclick="let path = ('<%= path %>').split('/'); path.splice(path.length-2, path.length); path = path.join('/'); listComponent.filesManage.refresh({path : path + '/'})">Retour<button>
                <span class="mb-[10px]">chemin : <a id="path"><%= path %></a></span>
            </div>
            <div class="w-full">
                <% for(const folder of files.folders){ %>
                    <div class="flex flex-row justify-between items-center">
                        <a id="<%= folder %>" class="cursor-pointer" onclick="listComponent.filesManage.refresh({path : '<%= path %><%= folder %>/'})"><%= folder %></a>
                        <input type="text" id="<%= folder %>/input" class="hidden" value="<%= folder %>" onblur="if('<%= folder %>' == document.getElementById('<%= folder %>/input').value){ listComponent.filesManage.refresh({path : '<%= path %>'}); return;} toModule('renameFile', {path: '<%= path %>', old: '<%= folder %>/', new: document.getElementById('<%= folder %>/input').value + '/'}).then(() => {listComponent.filesManage.refresh({path : '<%= path %>'})}).catch(() => {listComponent.filesManage.refresh({path : '<%= path %>'})})">
                        <div class="flex flex-row justify-between items-center">
                            <img src="/public/images/folder.png" class="mr-[10px]">
                            <a class="cursor-pointer transition hover:scale-[110%]" onclick="document.getElementById('<%= folder %>').classList.toggle('hidden'); document.getElementById('<%= folder %>/input').classList.toggle('hidden'); document.getElementById('<%= folder %>/input').focus()">✏</a>
                            <a class="cursor-pointer transition hover:scale-[110%]" onclick="toModule('deleteFile', {path : '<%= path %><%= folder %>/'}).then(() => {listComponent.filesManage.refresh({path : '<%= path %>'})}).catch(() => {})">🗑</a>
                        </div>
                    </div>
                <% } %>
                <% for(const file of files.files){ %>
                    <div class="flex flex-row justify-between items-center">
                        <a id="<%= file %>" href="/public/files<%= path %><%= file %>" class="text-[blue] underline"><%= file %></a>
                        <input type="text" id="<%= file %>/input" class="hidden" value="<%= file %>" onblur="if('<%= file %>' == document.getElementById('<%= file %>/input').value){ listComponent.filesManage.refresh({path : '<%= path %>'}); return;} toModule('renameFile', {path: '<%= path %>', old: '<%= file %>', new: document.getElementById('<%= file %>/input').value}).then(() => {listComponent.filesManage.refresh({path : '<%= path %>'})}).catch(() => {listComponent.filesManage.refresh({path : '<%= path %>'})})">
                        <div class="flex flex-row items-center">
                            <% if(file.indexOf(".png") > -1 || file.indexOf(".jpg") > -1 ){ %>
                                <img src="/public/images/image.png" class="mr-[10px]">
                            <% }else{ %>
                                <img src="/public/images/file.png" class="mr-[10px]">
                            <% } %>
                            <a class="cursor-pointer transition hover:scale-[110%]" onclick="document.getElementById('<%= file %>').classList.toggle('hidden'); document.getElementById('<%= file %>/input').classList.toggle('hidden'); document.getElementById('<%= file %>/input').focus()">✏</a>
                            <a class="cursor-pointer transition hover:scale-[110%]" onclick="toModule('deleteFile', {path : '<%= path %><%= file %>'}).then(() => {listComponent.filesManage.refresh({path : '<%= path %>'})}).catch(() => {})">🗑</a>
                        </div>
                    </div>
                <% } %>
            </div>
            <div>
                <button class="border-[2px] border-D bg-C rounded-[5px] text-[white] transition hover:scale-[110%]" onclick="toModule('addFolder', {folder: '<%= path %>/nouveau_dossier'}).then(() => {listComponent.filesManage.refresh({path : '<%= path %>'})}).catch(() => {})">Ajouter un dossier<button>
            </div>
        </div>
    `),

    render : (req, res) => {
        let path = req.body.path
        if(!path || path.indexOf(".") > -1){
            path = "/"
        }
        let files = {
            folders: [],
            files: []
        }
        for(const file of fs.readdirSync(global.dir + "/public/files" + path)){
            if(fs.statSync(global.dir + "/public/files" + path + file).isDirectory()){
                files.folders.push(file)
            }
            else{
                files.files.push(file)
            }
        }
        res.send({component: ejs.render(module.exports.html, {files : files, path: path})})
    }
}