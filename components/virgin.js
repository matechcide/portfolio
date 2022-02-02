const ejs = require('ejs')

module.exports = {
    html: (/*html*/`
        <div id="">
        </div>
    `),

    render : (req, res) => {
        const parms = {
        }
        res.send({component: ejs.render(module.exports.html, parms)})
    }
}