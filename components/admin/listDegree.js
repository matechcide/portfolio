const ejs = require('ejs')

module.exports = {
    html: (/*html*/`
        <div id="listDegree" class="flex flex-col items-center justify-start mt-[20px] p-[10px] border-[2px] border-[gray] rounded-[10px] w-[80%]">
            <div class="w-[95%]">
                <div class="w-full flex flex-row ml-[20px]">
                    <span class="w-[10%]">Visible :</span>
                    <span class="w-[40%]">Nom du diplôme :</span>
                    <span class="w-[40%]">Année d'obtention :</span>
                </div>
            </div>
            <% for(const degree of listDegree){ %>
                <div id="<%= degree.name %>/div" class="w-[95%] border-A border-t-[2px] mb-[10px] pt-[5px]">
                    <div id="<%= degree.name %>/1"class="flex flex-row w-full ml-[20px]">
                        <div class="w-[10%]">
                            <% if(degree.visible){ %>
                                <input type="checkbox" id="check/<%= degree.name %>" onchange="checkChange('<%= degree.name %>')" checked>
                            <% } else { %>
                                <input type="checkbox" id="check/<%= degree.name %>" onchange="checkChange('<%= degree.name %>')">
                            <% } %>
                        </div>
                        <div class="w-[40%]">
                            <span class="px-[10px] bg-B text-[white]"><%= degree.name %></span>
                        </div>
                        <div class="w-[40%]">
                            <span class="px-[10px] bg-C text-[white]"><%= degree.date %></span>
                        </div>
                        <div class="w-[10%]">
                            <button class="p-[5px] bg-[green] rounded-[5px] transition hover:scale-[110%]" onclick="document.getElementById('<%= degree.name %>/1').classList.toggle('hidden'); document.getElementById('<%= degree.name %>/2').classList.toggle('hidden'); document.getElementById('<%= degree.name %>/2').classList.toggle('flex')">✏</button>
                            <button class="p-[5px] bg-[red] rounded-[5px] transition hover:scale-[110%]" onclick="if(confirm('Souhaitez-vous vraiment supprimer <%= degree.name %> des diplômes ?')){seeInfo('En attente d\\\'une réponse du serveur...'); toModule('deleteDegree', {name: '<%= degree.name %>'}).then(() => {deleteInfo(); listComponent.listDegree.refresh()}).catch(() => {deleteInfo()})}">🗑</button>
                        </div>
                    </div>
                    <div id="<%= degree.name %>/2" class="hidden flex-row justify-Center items-center">
                        <div class="flex flex-col items-start w-[45%]">
                            <input class="border-[gray] border-[2px] rounded-[5px] px-[5px]" id="name/<%= degree.name %>" placeholder="nom" type="text" required value="<%= degree.name %>">
                            <input class="mt-[10px] border-[gray] border-[2px] rounded-[5px] px-[5px]" id="date/<%= degree.name %>" placeholder="anné" type="num" required value="<%= degree.date %>">
                            <input class="mt-[10px] border-[gray] border-[2px] rounded-[5px] px-[5px]" id="smallCom/<%= degree.name %>" placeholder="Précision du résultats" type="text" required value="<%= degree.smallCom %>">
                        </div>
                        <div class="flex flex-col items-start w-[45%]">
                            <textarea class="border-[gray] border-[2px] w-[90%] rounded-[5px] px-[5px]" placeholder="commentaire" id="com/<%= degree.name %>" required><%= degree.com %></textarea>
                            <div class="flex flex-row w-[90%] justify-around">
                                <button class="mt-[10px] py-[5px] px-[10px] bg-B border-A border-[2px] rounded-[5px] text-[white] transition hover:scale-110" onclick="editDegree('<%= degree.name %>', document.getElementById('name/<%= degree.name %>').value, document.getElementById('date/<%= degree.name %>').value, document.getElementById('smallCom/<%= degree.name %>').value, document.getElementById('com/<%= degree.name %>').value)">modifier</button>
                                <button class="mt-[10px] py-[5px] px-[10px] bg-C border-D border-[2px] rounded-[5px] text-[white] transition hover:scale-110" onclick="listComponent.listDegree.refresh({page: <%= page %>})">annuler</button>
                            </div>
                        </div>
                    </div>
                </div>
            <% } %>
            <div class="flex flex-row w-[100px] items-center justify-between">
                <div class="transition text-[30px] hover:scale-110 hover:text-C" onclick="listComponent.listDegree.refresh({page: <%= page %>-1})">&larr;</div>
                <div id="page"><%= page %></div>
                <div class="transition text-[30px] hover:scale-110 hover:text-C" onclick="listComponent.listDegree.refresh({page: <%= page %>+1})">&rarr;</div>
            </div>
        </div>
    `),

    render : (req, res) => {
        let page = req.body.page
        if(!page || page < 0){
            page = 0
        }
        global.functions.mongodb.aggregate("degree", [{ $sort: { date: -1 } }, { $skip: 10*page }, { $limit: 10 }, { $project: { _id: 0 } }]).then((rep) => {
            res.send({component: ejs.render(module.exports.html, {listDegree: rep, page: page})})
        })
    }
}