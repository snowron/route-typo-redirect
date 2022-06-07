const levenshtein = require('js-levenshtein');
const fuzzyComparison = require('fuzzy-comparison');

module.exports = function (options) {
    return function (req, res, next) {
        if (req.method !== "GET") {
            next()
            return
        }

        for (const blacklistItem of options.blacklist ?? []) {
            if (req.originalUrl != blacklistItem) {
                next()
                return
            }
        }

        for (let route of options.routes ?? []) {
            let routeSplitted = route.split("/")
            let originalUrlSplitted = req.originalUrl.split("/")
            if (routeSplitted.length === routeSplitted.length && route.includes("/:")) {
                if (levenshtein(routeSplitted[1], originalUrlSplitted[1]) <= 2 && fuzzyComparison.default(routeSplitted[1], originalUrlSplitted[1], { threshold: options.threshold ?? 2 })) {
                    redirect(req, res, route)
                }
            } else if (routeSplitted.length === routeSplitted.length) {
                if (levenshtein(req.originalUrl, route) <= 2 && fuzzyComparison.default(req.originalUrl, route, { threshold: options.threshold ?? 2 })) {
                    redirect(req, res, route)
                }
            }

        }
        next()
    }

    function redirect(req, res, route) {
        if (route.includes("/:")) {
            let routeSplitted = route.split("/")
            let originalUrlSplitted = req.originalUrl.split("/")
            routeSplitted[2] = originalUrlSplitted[2]
            route = routeSplitted.join("/")
        }

        if (Object.keys(req.query).length != 0) {
            const queryParams = new URL(req.url, `http://${req.headers.host}/`);
            route += `?${queryParams}`
        }
        res.redirect(route)
    }
}