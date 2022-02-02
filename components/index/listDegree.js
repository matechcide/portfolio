const ejs = require('ejs')

module.exports = {
    html: (/*html*/`
        <div id="listDegree" class="flex flex-col items-center justify-start mt-[15px] w-full lg:w-[40%]">
            <div class="w-[95%] flex justify-center items-start border-A border-b-[2px]">
                <span class="text-[30px] text-center">Diplômes :</span>
            </div>
            <% let t = page + 1; for(const degree of listDegree){ %>
                <% if(t % 2){ %>
                    <div id="<%= degree.name %>/div" class="bg-B w-[90%] mt-[5px] flex justify-between items-center text-[25px] text-[white] transition hover:scale-[110%]" onclick="listComponent.loreDegree.refresh({name: '<%= degree.name %>'}); document.getElementById('scroll').scrollTo({top: 0, behavior: 'smooth'})">
                <% } else { %>
                    <div id="<%= degree.name %>/div" class="bg-C w-[90%] mt-[5px] flex justify-between items-center text-[25px] text-[black] transition hover:scale-[110%]" onclick="listComponent.loreDegree.refresh({name: '<%= degree.name %>'}); document.getElementById('scroll').scrollTo({top: 0, behavior: 'smooth'})">
                <% } %>
                    >
                    <div class="w-max-[80%] text-center">
                        <span class=""><%= degree.name %></span>
                        <span> en </span>
                        <span class=""><%= degree.date %></span>
                    </div>
                    <
                </div>
            <% t++; } %>
            <div class="w-[95%] flex justify-center items-start border-A border-b-[2px] mt-[5px]"></div>
            <div class="flex flex-row w-[70px] text-[20px] items-center justify-between">
                <div class="transition hover:scale-110 hover:text-C" onclick="listComponent.listDegree.refresh({page: <%= page %>-1}).then(() => document.getElementById('scroll').scrollTo({top: document.getElementById('scroll').scrollHeight, behavior: 'smooth'}))">&larr;</div>
                <div><%= page %></div>
                <div class="transition hover:scale-110 hover:text-C" onclick="listComponent.listDegree.refresh({page: <%= page %>+1}).then(() => document.getElementById('scroll').scrollTo({top: document.getElementById('scroll').scrollHeight, behavior: 'smooth'}))">&rarr;</div>
            </div>
        </div>
    `),

    render : (req, res) => {
        let page = req.body.page
        if(!page || page < 0){
            page = 0
        }
        global.functions.mongodb.aggregate("degree", [ { $match: { visible: true } }, { $sort: { date: -1 } }, { $skip: 10*page }, { $limit: 10 }, { $project: { _id: 0 } }]).then((rep) => {
            res.send({component: ejs.render(module.exports.html, {listDegree: rep, page: page})})
        })
    }
}