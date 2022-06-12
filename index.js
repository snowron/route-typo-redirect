const levenshtein = require('js-levenshtein');
const fuzzyComparison = require('fuzzy-comparison');

module.exports = function (options) {
    return function (req, res, next) {
        if (req.method !== "GET") {
            next()
            return
        }

        for (let route of options.routes ?? []) {
            const routeSplitted = route.split("/")
            const originalUrlSplitted = req.baseUrl.split("/")

            if (routeSplitted.length === originalUrlSplitted.length && route.includes("/:")) {
                if (levenshtein(routeSplitted[1], originalUrlSplitted[1]) <= (options.levenThreshold ?? 2) && fuzzyComparison.default(routeSplitted[1], originalUrlSplitted[1], { threshold: options.fuzzyThreshold ?? 2 })) {
                    redirect(req, res, route)
                    return
                }
            } else if (routeSplitted.length === originalUrlSplitted.length) {
                if (levenshtein(routeSplitted[1], originalUrlSplitted[1]) <= (options.levenThreshold ?? 2) && fuzzyComparison.default(originalUrlSplitted[1], routeSplitted[1], { threshold: options.fuzzyThreshold ?? 2 })) {
                    redirect(req, res, route)
                    return
                }
            }
        }
        next()
    }

    function redirect(req, res, route) {
        for (const blacklistRoute of options.blacklist ?? []) {
            if (route == blacklistRoute) {
                return
            }
        }

        if (route.includes("/:")) {
            let routeSplitted = route.split("/")
            const originalUrlSplitted = req.baseUrl.split("/")
            routeSplitted[2] = originalUrlSplitted[2]
            route = routeSplitted.join("/")
        }

        if (Object.keys(req.query).length != 0) {
            const queryParams = new URL(req.originalUrl, `http://h/`);
            route += `?${queryParams.searchParams.toString()}`
        }

        res.redirect(route)
    }
}