const ejs = require('ejs')

module.exports = {
    html: (/*html*/`
        <div id="loreProfessionalExp" class="w-full flex flex-col justify-start items-center">
            <% if(!professionalExp){ %>
                <p class="text-center lg:w-[60%] lg:text-[20px]">Cette page est dédiée aux activités professionnelles que j'ai pu exercer. N'hésitez pas à utiliser le filtre pour faire des recherches ciblées.</p>
            <% } else { %>
                <div class="lg:hidden w-full flex flex-col justify-start items-center">
                    <div class="flex">
                        <img src="/public/files<%= professionalExp.logo %>" class="ration-square justify-self-start place-self-start h-[50px] mr-[15px]">
                        <a class="text-[30px] text-center underline text-[blue]" href="<%= professionalExp.ref %>"><%= professionalExp.name %></a>
                    </div>
                    <div class="flex flex-row justify-between w-[90%] mt-[10px]">
                        <p class="text-[16px] max-w-[45%] text-clip"><a class="underline text-[15px]">Catégorie</a> :<br/><%= professionalExp.category %></p>
                        <p class="text-[16px] max-w-[45%]"><a class="underline text-[15px]">Date de l'expérience professionnelle</a> :<br/>du <%= new Date(professionalExp.date1).toISOString().split('T')[0] %> au <%= new Date(professionalExp.date2).toISOString().split('T')[0] %></p>
                    </div>
                    <p class="text-[18px] mt-[10px] text-justify w-[80%]"><%= professionalExp.com %></p>
                </div>
                <div class="hidden w-full lg:flex flex-col justify-start items-center">
                    <div class="flex">
                        <img src="/public/files<%= professionalExp.logo %>" class="ration-square justify-self-start place-self-start h-[50px] mr-[15px]">
                        <a class="text-[30px] text-center underline text-[blue]" href="<%= professionalExp.ref %>"><%= professionalExp.name %></a>
                    </div>
                    <div class="flex flex-row justify-around w-[60%] mt-[10px]">
                        <p class="text-[16px] max-w-[30%] text-clip"><a class="underline text-[15px]">Catégorie</a> :<br/><%= professionalExp.category %></p>
                        <p class="text-[16px] max-w-[45%]"><a class="underline text-[15px]">Date de l'expérience professionnelle</a> :<br/>du <%= new Date(professionalExp.date1).toISOString().split('T')[0] %> au <%= new Date(professionalExp.date2).toISOString().split('T')[0] %></p>
                    </div>
                    <p class="text-[18px] mt-[10px] text-justify w-[70%]"><%= professionalExp.com %></p>
                </div>
            <% } %>
        </div>
    `),

    render : (req, res) => {
        if(!req.body.Pid){
            res.send({component: ejs.render(module.exports.html, { professionalExp: false })})
        }
        else{
            global.functions.mongodb.findOne("professionalExp", { Pid: req.body.Pid }).then((rep) => {
                res.send({component: ejs.render(module.exports.html, { professionalExp: rep })})
            })
        }
    }
}