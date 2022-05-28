const levenshtein = require('js-levenshtein');
const fuzzyComparison = require('fuzzy-comparison');

module.exports = function (options) {
    return function (req, res, next) {
        for (const blacklistItem of options.blacklist ?? []) {
            if (req.path != blacklistItem) {
                for (const route of options.routes ?? []) {
                    if (levenshtein(req.path, route) <= 2 && fuzzyComparison.default(req.path, route, { threshold: options.threshold ?? 2 })) {
                        res.redirect(route)
                    }
                }
            }
        }
        next()
    }
}