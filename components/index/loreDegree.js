const ejs = require('ejs')

module.exports = {
    html: (/*html*/`
        <div id="loreDegree" class="w-full flex flex-col justify-start items-center">
            <% if(!degree){ %>
                <p class="text-center lg:w-[60%] lg:text-[20px]">Cette onglet détaillera les diplômes obtenus ou en cours d'acquisition et donne des informations supplémentaires sur le déroulement des années de ses diplômes. Il vous suffit juste de cliquer sur les cases dans la liste de diplôm.</p>
            <% } else { %>
                <div class="lg:hidden w-full flex flex-col justify-start items-center">
                    <p class="text-[30px] text-center"><%= degree.name %></p>
                    <div class="flex flex-row justify-between w-[90%] mt-[10px]">
                        <p class="text-[16px] max-w-[45%] text-clip"><a class="underline text-[15px]">Détails</a> :<br/><%= degree.smallCom %></p>
                        <p class="text-[16px] max-w-[45%]"><a class="underline text-[15px]">Année de passage</a> :<br/><%= degree.date %></p>
                    </div>
                    <p class="text-[18px] mt-[10px] text-justify w-[80%]"><%= degree.com %></p>
                </div>
                <div class="hidden w-full lg:flex flex-col justify-start items-center">
                    <p class="text-[40px] text-center"><%= degree.name %></p>
                    <div class="flex flex-row justify-around w-[60%] mt-[10px]">
                        <p class="text-[16px] max-w-[30%] text-clip"><a class="underline text-[15px]">Détails</a> :<br/><%= degree.smallCom %></p>
                        <p class="text-[16px] max-w-[30%]"><a class="underline text-[15px]">Année de passage</a> :<br/><%= degree.date %></p>
                    </div>
                    <p class="text-[18px] mt-[10px] text-justify w-[70%]"><%= degree.com %></p>
                </div>
            <% } %>
            
        </div>
    `),

    render : (req, res) => {
        if(!req.body.name){
            res.send({component: ejs.render(module.exports.html, {degree: false})})
        }
        else{
            global.functions.mongodb.findOne("degree", { name: req.body.name }).then((rep) => {
                res.send({component: ejs.render(module.exports.html, {degree: rep})})
            })
        }
        
    }
}