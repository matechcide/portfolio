const ejs = require('ejs')

module.exports = {
    html: (/*html*/`
        <div id="loreSkill" class="w-full flex flex-col justify-start items-center">
        <% if(!skills){ %>
            <p class="text-center lg:w-[60%] lg:text-[20px]">Vous trouverez ici un listing de mes différentes compétences dans le domaine de l'informatique et plus encore. N'hésitez pas à utiliser le filtre pour faire des recherches plus intéressante.</p>
        <% } else { %>
            <div class="lg:hidden w-full flex flex-col justify-start items-center">
                <div class="flex">
                    <img src="/public/files<%= skills.logo %>" class="ration-square justify-self-start place-self-start h-[50px] mr-[15px]">
                    <a class="text-[30px] text-center underline text-[blue]" href="<%= skills.ref %>"><%= skills.name %></a>
                </div>
                <div class="flex flex-row justify-between w-[90%] mt-[10px]">
                    <p class="text-[16px] max-w-[45%] text-clip"><a class="underline text-[15px]">Catégorie</a> :<br/><%= skills.category %></p>
                    <p class="text-[16px] max-w-[45%]"><a class="underline text-[15px]">Première utilisation</a> :<br/><%= skills.date %></p>
                </div>
                <p class="text-[18px] mt-[10px] text-justify w-[80%]"><%= skills.com %></p>
            </div>
            <div class="hidden w-full lg:flex flex-col justify-start items-center">
                <div class="flex">
                    <img src="/public/files<%= skills.logo %>" class="ration-square justify-self-start place-self-start h-[50px] mr-[15px]">
                    <a class="text-[30px] text-center underline text-[blue]" href="<%= skills.ref %>"><%= skills.name %></a>
                </div>
                <div class="flex flex-row justify-around w-[60%] mt-[10px]">
                    <p class="text-[16px] max-w-[30%] text-clip"><a class="underline text-[15px]">Catégorie</a> :<br/><%= skills.category %></p>
                    <p class="text-[16px] max-w-[30%]"><a class="underline text-[15px]">Première utilisation</a> :<br/><%= skills.date %></p>
                </div>
                <p class="text-[18px] mt-[10px] text-justify w-[70%]"><%= skills.com %></p>
            </div>
        <% } %>
        </div>
    `),

    render : (req, res) => {
        if(!req.body.name){
            res.send({component: ejs.render(module.exports.html, {skills: false})})
        }
        else{
            global.functions.mongodb.findOne("skills", { name: req.body.name }).then((rep) => {
                res.send({component: ejs.render(module.exports.html, {skills: rep})})
            })
        }
    }
}