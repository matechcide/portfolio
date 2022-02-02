const ejs = require('ejs')

module.exports = {
    html: (/*html*/`
        <div id="listSkills" class="flex flex-col items-center justify-start mt-[20px] p-[10px] border-[2px] border-[gray] rounded-[10px] w-[80%]">

            <div class="w-[95%]">
                <div class="w-full flex flex-row ml-[20px]">
                    <span class="w-[10%]">Visible :</span>
                    <span class="w-[25%]">Compétences :</span>
                    <span class="w-[25%]">Première utilisation :</span>
                    <span class="w-[30%]">Catégorie :</span>
                </div>
            </div>

            <% for(const skill of listSkills){ %>
                <div id="<%= skill.name %>/div" class="w-[95%] border-A border-t-[2px] mb-[10px] pt-[5px]">
                    <div id="<%= skill.name %>/1"class="flex flex-row w-full ml-[20px]">
                        <div class="w-[10%]">
                            <% if(skill.visible){ %>
                                <input type="checkbox" id="check/<%= skill.name %>" onchange="checkChange('<%= skill.name %>')" checked>
                            <% } else { %>
                                <input type="checkbox" id="check/<%= skill.name %>" onchange="checkChange('<%= skill.name %>')">
                            <% } %>
                        </div>
                        <div class="w-[25%]">
                            <span class="px-[10px] bg-B text-[white]"><%= skill.name %></span>
                        </div>
                        <div class="w-[25%]">
                            <span class="px-[10px] bg-C text-[white]"><%= skill.date %></span>
                        </div>
                        <div class="w-[30%]">
                            <span class="px-[10px] bg-E text-[white]"><%= skill.category %></span>
                        </div>
                        <div class="w-[10%]">
                            <button class="p-[5px] bg-[green] rounded-[5px] transition hover:scale-[110%]" onclick="document.getElementById('<%= skill.name %>/1').classList.toggle('hidden'); document.getElementById('<%= skill.name %>/2').classList.toggle('hidden'); document.getElementById('<%= skill.name %>/2').classList.toggle('flex')">✏</button>
                            <button class="p-[5px] bg-[red] rounded-[5px] transition hover:scale-[110%]" onclick="if(confirm('Souhaitez-vous vraiment supprimer <%= skill.name %> des compétences ?')){seeInfo('En attente d\\\'une réponse du serveur...'); toModule('deleteSkill', {name: '<%= skill.name %>'}).then(() => {deleteInfo(); listComponent.listSkills.refresh()}).catch(() => {deleteInfo()})}">🗑</button>
                        </div>
                    </div>
                    <div id="<%= skill.name %>/2" class="hidden flex-row justify-Center items-center">
                        <div class="flex flex-col items-start w-[45%]">
                            <select class="border-[2px] border-[gray] rounded-[5px]" id="category/<%= skill.name %>" required value="<%= skill.category %>">
                                <option value="<%= skill.category %>" selected disabled hidden><%= skill.category %></option>
                                <option value="langage informatique">langage informatique</option>
                                <option value="software">software</option>
                                <option value="hardware">hardware</option>
                                <option value="réseau">réseau</option>
                                <option value="modélisation">modélisation</option>
                                <option value="électronique">électronique</option>
                            </select>
                            <input class="mt-[10px] border-[gray] border-[2px] rounded-[5px] px-[5px]" id="name/<%= skill.name %>" placeholder="nom" type="text" required value="<%= skill.name %>">
                            <input class="mt-[10px] border-[gray] border-[2px] rounded-[5px] px-[5px]" id="date/<%= skill.name %>" placeholder="première utilisation" type="num" required value="<%= skill.date %>">
                            <input class="mt-[10px] border-[gray] border-[2px] rounded-[5px] px-[5px]" id="ref/<%= skill.name %>" placeholder="ref" type="url" required value="<%= skill.ref %>">
                            <input class="mt-[10px] border-[gray] border-[2px] rounded-[5px] px-[5px]" id="logo/<%= skill.name %>" placeholder="logo" type="text" required value="<%= skill.logo %>">
                        </div>
                        <div class="flex flex-col items-start w-[45%]">
                            <textarea class="border-[gray] border-[2px] w-[90%] rounded-[5px] px-[5px]" placeholder="commentaire" id="com/<%= skill.name %>" required><%= skill.com %></textarea>
                            <div class="flex flex-row w-[90%] justify-around">
                                <button class="mt-[10px] py-[5px] px-[10px] bg-B border-A border-[2px] rounded-[5px] text-[white] transition hover:scale-110" onclick="editskill('<%= skill.name %>', document.getElementById('category/<%= skill.name %>').value, document.getElementById('name/<%= skill.name %>').value, document.getElementById('date/<%= skill.name %>').value, document.getElementById('ref/<%= skill.name %>').value, document.getElementById('com/<%= skill.name %>').value, document.getElementById('logo/<%= skill.name %>').value)">modifier</button>
                                <button class="mt-[10px] py-[5px] px-[10px] bg-C border-D border-[2px] rounded-[5px] text-[white] transition hover:scale-110" onclick="listComponent.listSkills.refresh({ page: <%= page %>, category: document.getElementById('category/2').value })">annuler</button>
                            </div>
                        </div>
                    </div>
                </div>
            <% } %>

            <div class="flex flex-row w-[100px] items-center justify-between">
                <div class="transition text-[30px] hover:scale-110 hover:text-C" onclick="listComponent.listSkills.refresh({page: <%= page %>-1, category: document.getElementById('category/2').value})">&larr;</div>
                <div id="page"><%= page %></div>
                <div class="transition text-[30px] hover:scale-110 hover:text-C" onclick="listComponent.listSkills.refresh({page: <%= page %>+1, category: document.getElementById('category/2').value})">&rarr;</div>
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
        
        global.functions.mongodb.aggregate("skills", [category, { $sort: {date: 1} }, { $skip: 10*page }, { $limit: 10 }, { $project: { _id: 0 } }]).then((rep) => {
            res.send({component: ejs.render(module.exports.html, { listSkills: rep, page: page, category: req.body.category, sort: req.body.sort })})
        })
    }
}