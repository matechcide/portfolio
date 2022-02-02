const ejs = require('ejs')

module.exports = {
    html: (/*html*/`
        <div id="listSkills"  class="flex flex-col items-center justify-start mt-[15px] w-full lg:w-[40%]">
            <div class="w-[95%] flex justify-center items-start border-A border-b-[2px]">
                <span class="text-[30px] text-center">Compétences :</span>
            </div>
            <% let t = page + 1; for(const skill of listSkills){ %>
                <% if(t % 2){ %>
                    <div id="<%= skill.name %>/div" class="bg-B w-[90%] mt-[5px] flex justify-between items-center text-[25px] text-[white] transition hover:scale-[110%]" onclick="listComponent.loreSkill.refresh({name: '<%= skill.name %>'}); document.getElementById('scroll').scrollTo({top: 0, behavior: 'smooth'})">
                <% } else { %>
                    <div id="<%= skill.name %>/div" class="bg-C w-[90%] mt-[5px] flex justify-between items-center text-[25px] text-[black] transition hover:scale-[110%]" onclick="listComponent.loreSkill.refresh({name: '<%= skill.name %>'}); document.getElementById('scroll').scrollTo({top: 0, behavior: 'smooth'})">
                <% } %>
                    >
                    <div class="w-max-[80%] text-center">
                        <span class=""><%= skill.name %></span>
                        <span> depuis </span>
                        <span class=""><%= skill.date %></span>
                    </div>
                    <
                </div>
            <% t++; } %>
            <div class="w-[95%] flex justify-center items-start border-A border-b-[2px] mt-[5px]"></div>
            <div class="flex flex-row w-[70px] text-[20px] items-center justify-between">
                <div class="transition hover:scale-110 hover:text-C" onclick="listComponent.listSkills.refresh({ page: <%= page %>-1, category: document.getElementById('category').value, sort: document.getElementById('sort').value }).then(() => document.getElementById('scroll').scrollTo({top: document.getElementById('scroll').scrollHeight, behavior: 'smooth'}))">&larr;</div>
                <div><%= page %></div>
                <div class="transition hover:scale-110 hover:text-C" onclick="listComponent.listSkills.refresh({ page: <%= page %>+1, category: document.getElementById('category').value, sort: document.getElementById('sort').value }).then(() => document.getElementById('scroll').scrollTo({top: document.getElementById('scroll').scrollHeight, behavior: 'smooth'}))">&rarr;</div>
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
        let sort = req.body.sort
        if(!sort || sort == "croissant"){
            sort = { $sort: { date: 1 } }
        }
        else{
            sort = { $sort: { date: -1 } }
        }

        global.functions.mongodb.aggregate("skills", [category, { $match: { visible: true } }, sort, { $skip: 10*page }, { $limit: 10 }, { $project: { _id: 0 } }]).then((rep) => {
            res.send({component: ejs.render(module.exports.html, { listSkills: rep, page: page, category: req.body.category })})
        })
    }
}