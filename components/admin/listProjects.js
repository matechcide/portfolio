const ejs = require('ejs')

module.exports = {
    html: (/*html*/`
        <div id="listProjects" class="flex flex-col items-center justify-start mt-[20px] p-[10px] border-[2px] border-[gray] rounded-[10px] w-[80%]">
            <div class="w-[95%]">
                <div class="w-full flex flex-row ml-[20px]">
                    <span class="w-[10%]">Visible :</span>
                    <span class="w-[25%]">Projets :</span>
                    <span class="w-[25%]">Date de création :</span>
                    <span class="w-[30%]">Tag:</span>
                </div>
            </div>

            <% for(const project of listProjects){ %>
                <div id="<%= project.Pid %>/div" class="w-[95%] border-A border-t-[2px] mb-[10px] pt-[5px]">
                    <div id="<%= project.Pid %>/1"class="flex flex-row w-full ml-[20px]">
                        <div class="w-[10%]">
                            <% if(project.visible){ %>
                                <input type="checkbox" id="check/<%= project.Pid %>" onchange="checkChange('<%= project.Pid %>')" checked>
                            <% } else { %>
                                <input type="checkbox" id="check/<%= project.Pid %>" onchange="checkChange('<%= project.Pid %>')">
                            <% } %>
                        </div>
                        <div class="w-[25%]">
                            <span class="px-[10px] bg-B text-[white]"><%= project.name %></span>
                        </div>
                        <div class="w-[25%]">
                            <span class="px-[10px] bg-C text-[white]"><%= project.date %></span>
                        </div>
                        <div class="w-[30%]">
                            <span class="px-[10px] bg-E text-[white]"><%= project.category.join(', ') %></span>
                        </div>
                        <div class="w-[10%]">
                            <button class="p-[5px] bg-[green] rounded-[5px] transition hover:scale-[110%]" onclick="window.location.href += '/<%= project.Pid %>'">✏</button>
                            <button class="p-[5px] bg-[red] rounded-[5px] transition hover:scale-[110%]" onclick="if(confirm('Souhaitez-vous vraiment supprimer <%= project.name %> des projets ?')){seeInfo('En attente d\\\'une réponse du serveur...'); toModule('deleteProject', {Pid: '<%= project.Pid %>'}).then(() => {deleteInfo(); listComponent.listProjects.refresh()}).catch(() => {deleteInfo()})}">🗑</button>
                        </div>
                    </div>
                </div>
            <% } %>
            <div class="flex flex-row w-[100px] items-center justify-between">
                <div class="transition text-[30px] hover:scale-110 hover:text-C" onclick="listComponent.listProjects.refresh({page: <%= page %>-1, category: $('.chosen-select2').val()})">&larr;</div>
                <div id="page"><%= page %></div>
                <div class="transition text-[30px] hover:scale-110 hover:text-C" onclick="listComponent.listProjects.refresh({page: <%= page %>+1, category: $('.chosen-select2').val()})">&rarr;</div>
            </div>
        </div>
    `),

    render : (req, res) => {
        let page = req.body.page
        if(!page || page < 0){
            page = 0
        }
        let category = req.body.category
        if(!category){
            category = {$match: {category: {$exists: true}}}
        }
        else{
            category = { $match: {category: { $all: category }} }
        }

        let name = req.body.name
        if(!name || name == ""){
            name = {$match: {name: {$exists: true}}}
        }
        else{
            name = { $match: {name: {$regex: name}} }
        }

        global.functions.mongodb.aggregate("projects", [ category, name, { $sort: { date: -1 } }, { $skip: 10*page }, { $limit: 10 }, { $project: { _id: 0 } }]).then((rep) => {
            res.send({component: ejs.render(module.exports.html, {listProjects: rep, page: page})})
        })
    }
}