const ejs = require('ejs')

module.exports = {
    html: (/*html*/`
        <div id="professionalExp" class="flex flex-col items-center justify-start mt-[20px] p-[10px] border-[2px] border-[gray] rounded-[10px] w-[80%]">
            <div class="w-[95%]">
                <div class="w-full flex flex-row ml-[20px]">
                    <span class="w-[10%]">Visible :</span>
                    <span class="w-[25%]">Entreprise :</span>
                    <span class="w-[25%]">Date :</span>
                    <span class="w-[30%]">Catégorie :</span>
                </div>
            </div>

            <% for(const pe of listProfessionalExp){ %>
                <div id="<%= pe.Pid %>/div" class="w-[95%] border-A border-t-[2px] mb-[10px] pt-[5px]">
                    <div id="<%= pe.Pid %>/1"class="flex flex-row w-full ml-[20px]">
                        <div class="w-[10%]">
                            <% if(pe.visible){ %>
                                <input type="checkbox" id="check/<%= pe.Pid %>" onchange="checkChange('<%= pe.Pid %>')" checked>
                            <% } else { %>
                                <input type="checkbox" id="check/<%= pe.Pid %>" onchange="checkChange('<%= pe.Pid %>')">
                            <% } %>
                        </div>
                        <div class="w-[25%]">
                            <span class="px-[10px] bg-B text-[white]"><%= pe.name %></span>
                        </div>
                        <div class="w-[25%]">
                            <span class="bg-C text-[white]"><%= new Date(pe.date1).toISOString().split('T')[0] %><a class="bg-[white] text-[black]"> au </a><%= new Date(pe.date2).toISOString().split('T')[0] %></span>
                        </div>
                        <div class="w-[30%]">
                            <span class="px-[10px] bg-E text-[white]"><%= pe.category %></span>
                        </div>
                        <div class="w-[10%]">
                            <button class="p-[5px] bg-[green] rounded-[5px] transition hover:scale-[110%]" onclick="document.getElementById('<%= pe.Pid %>/1').classList.toggle('hidden'); document.getElementById('<%= pe.Pid %>/2').classList.toggle('hidden'); document.getElementById('<%= pe.Pid %>/2').classList.toggle('flex')">✏</button>
                            <button class="p-[5px] bg-[red] rounded-[5px] transition hover:scale-[110%]" onclick="if(confirm('Souhaitez-vous vraiment supprimer <%= pe.name %> des expériences ?')){seeInfo('En attente d\\\'une réponse du serveur...'); toModule('deleteProfessionalExp', {Pid: '<%= pe.Pid %>'}).then(() => {deleteInfo(); listComponent.professionalExp.refresh()}).catch(() => {deleteInfo()})}">🗑</button>
                        </div>
                    </div>
                    <div id="<%= pe.Pid %>/2" class="hidden flex-row justify-Center items-center">
                        <div class="flex flex-col items-start w-[45%]">
                            <select class="border-[2px] border-[gray] rounded-[5px]" id="category/<%= pe.Pid %>" required value="<%= pe.category %>">
                                <option value="<%= pe.category %>" selected disabled hidden><%= pe.category %></option>
                                <option value="employé">employé</option>
                                <option value="stagiaire">stagiaire</option>
                                <option value="non-officiel">non-officiel</option>
                            </select>
                            <input class="mt-[10px] border-[gray] border-[2px] rounded-[5px] px-[5px]" id="name/<%= pe.Pid %>" placeholder="nom" type="text" required value="<%= pe.name %>">
                            <input class="mt-[10px] border-[gray] border-[2px] rounded-[5px] px-[5px]" id="ref/<%= pe.Pid %>" placeholder="ref" type="url" required value="<%= pe.ref %>">
                            <input class="mt-[10px] border-[gray] border-[2px] rounded-[5px] px-[5px]" id="logo/<%= pe.Pid %>" placeholder="logo" type="text" required value="<%= pe.logo %>">
                        </div>
                        <div class="flex flex-col justify-start items-center w-[45%]">
                            <div class="flex flex-col justify-start items-center">
                                <input class="border-[2px] border-[gray] rounded-[5px]" id="date1/<%= pe.Pid %>" type="date" value="<%= new Date(pe.date1).toISOString().split('T')[0] %>">
                                au
                                <input class="border-[2px] border-[gray] rounded-[5px]" id="date2/<%= pe.Pid %>" type="date" value="<%= new Date(pe.date2).toISOString().split('T')[0] %>">
                            </div>
                            <textarea class="border-[gray] border-[2px] w-[90%] rounded-[5px] px-[5px] mt-[10px]" placeholder="commentaire" id="com/<%= pe.Pid %>" required><%= pe.com %></textarea>
                            <div class="flex flex-row w-[90%] justify-around">
                                <button class="mt-[10px] py-[5px] px-[10px] bg-B border-A border-[2px] rounded-[5px] text-[white] transition hover:scale-110" onclick="editPE('<%= pe.Pid %>', document.getElementById('category/<%= pe.Pid %>').value, document.getElementById('name/<%= pe.Pid %>').value, document.getElementById('date1/<%= pe.Pid %>').value, document.getElementById('date2/<%= pe.Pid %>').value, document.getElementById('ref/<%= pe.Pid %>').value, document.getElementById('com/<%= pe.Pid %>').value, document.getElementById('logo/<%= pe.Pid %>').value)">modifier</button>
                                <button class="mt-[10px] py-[5px] px-[10px] bg-C border-D border-[2px] rounded-[5px] text-[white] transition hover:scale-110" onclick="listComponent.professionalExp.refresh({ page: <%= page %>, category: document.getElementById('category/2').value })">annuler</button>
                            </div>
                        </div>
                    </div>
                </div>
            <% } %>

            <div class="flex flex-row w-[100px] items-center justify-between">
                <div class="transition text-[30px] hover:scale-110 hover:text-C" onclick="listComponent.professionalExp.refresh({page: <%= page %>-1, category: document.getElementById('category/2').value})">&larr;</div>
                <div id="page"><%= page %></div>
                <div class="transition text-[30px] hover:scale-110 hover:text-C" onclick="listComponent.professionalExp.refresh({page: <%= page %>+1, category: document.getElementById('category/2').value})">&rarr;</div>
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
            category = {$match: {category: category}}
        }
        
        global.functions.mongodb.aggregate("professionalExp", [category, { $sort: { date1: -1 } }, { $skip: 10*page }, { $limit: 10 }, { $project: { _id: 0 } }]).then((rep) => {
            res.send({component: ejs.render(module.exports.html, { listProfessionalExp: rep, page: page, category: req.body.category })})
        })
    }
}