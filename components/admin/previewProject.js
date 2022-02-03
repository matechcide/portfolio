const ejs = require('ejs')

module.exports = {
    html: (/*html*/`
        <div id="previewProject" class="w-full min-h-full flex">
            <% if(project.name){ %>
                <div class="flex flex-col w-[15%] border-[gray] border-r-[2px] h-full pr-[10px] pt-[10px]">
                    <img class="aspect-auto w-full" src="/public/files<%= project.logo %>">
                    <h1 class="mt-[10px]">Tag</h1>
                    <div class="flex flex-row flex-wrap border-[1px] border-[gray] text-[10px]">
                        <% for(const tag of project.category){ %>
                            <div class="px-[5px] border-[1px] border-[gray] bg-[white] m-[2px]">
                                <%= tag %>
                            </div>
                        <% } %>
                    </div>
                    <h1 class="mt-[10px]">Statut : 
                        <% if(project.status == "en cours"){ %>
                            <a class="bg-[green] text-[white] px-[5px]">en cours</a>
                        <% }else if(project.status == "en pause"){ %>
                            <a class="bg-[gray] text-[white] px-[5px]">en pause</a>
                        <% }else{ %>
                            <a class="bg-[red] text-[white] px-[5px]">arrêter</a>
                        <% } %>
                    </h1>
                    <% if(project.git != ""){ %>
                        <h1 class="mt-[10px]">Dispo sur : <button class="bg-B border-A border-[2px] rounded-[5px] text-[white] px-[5px] transition hover:scale-[110%]" onclick="window.location.href = '<%= project.git %>'">GIT</button></h1>
                    <% } %>
                </div>

                <div class="flex flex-col justify-start items-center w-[85%]">
                    <div class="border-A px-[20px]">
                        <h1 class="text-[70px]"><%= project.name %></h1>
                    </div>
                    <div class="flex flex-col justify-start items-start py-[10px] px-[20px]">
                        <h1 class="text-[25px]">Introduction:</h1>
                        <h1 class=""><%= project.intro %></h1>
                    </div>
                    <div class="w-full flex flex-row justify-center items-center mt-[20px]">
                        <div class="w-[45%]">
                            <h1 class="text-[25px]">Définition de mon besoin:</h1>
                            <ul class="list-inside">
                                <% for(const c of project.cdc){ %>
                                    <li class="list-disc"><%= c %></li>
                                <% } %>
                            </ul>
                        </div>
                        <div class="w-[45%] aspect-video relative">
                            <button class="absolute top-[30%] text-[50px] left-[-25px] transition hover:scale-[110%]" onclick="let shower = document.getElementById('slideImage'); let lc = shower.firstElementChild; shower.removeChild(shower.firstElementChild); shower.appendChild(lc)"><</button>
                            <button class="absolute text-[50px] top-[30%] right-[-25px] transition hover:scale-[110%]" onclick="let shower = document.getElementById('slideImage'); let lc = shower.lastElementChild; shower.removeChild(shower.lastElementChild); shower.innerHTML = lc.outerHTML + shower.innerHTML">></button>
                            <div id="slideImage" class="h-full overflow-hidden flex">
                                <% for(const img of project.images){ %>
                                    <img class="h-full ml-[50%] translate-x-[-50%] mr-[100%]" src="/public/files<%= img %>">
                                <% } %>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col justify-start items-start py-[10px] px-[20px]">
                        <h1 class="text-[25px]">Avancer:</h1>
                        <h1 class=""><%= project.ccl %></h1>
                    </div>
                </div>
            <% } %>
        </div>
    `),

    render : (req, res) => {
        res.send({component: ejs.render(module.exports.html, {project: req.body})})
    }
}