const { redirect } = require('express/lib/response');
const middlewareUnderTest = require('./index')

describe("package tests", () => {

    it('should return when method is not', () => {
        const req = {
            method: "POST"
        }
        const res = {}
        const next = jest.fn()

        middlewareUnderTest({})(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
    });

    it('should return when route matches with one of blacklist route items', () => {
        const req = {
            method: "GET",
            url: "/blocks",
            query: {}
        }
        const res = {}
        const next = jest.fn()

        middlewareUnderTest({ routes: ["/chat", "/block"], blacklist: ["/block"] })(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
    });

    it('should redirect when route matches with one of related route items', () => {
        const testCases = [
            { url: "/chayy", result: "/chat" },
            { url: "/chayy/123", result: "/chat/123" },
            { url: "/chayy?window=open", query: { window: "open" }, result: "/chat?window=open" },
            { url: "/chayy/123?window=me", query: { window: "me" }, result: "/chat/123?window=me" },
        ]

        for (const testCase of testCases) {
            const req = {
                method: "GET",
                url: testCase.url,
                query: testCase.query ?? {}
            }
            const res = {
                redirect: jest.fn(),
            }
            const next = jest.fn()

            middlewareUnderTest({
                routes: [
                    "/chat",
                    "/chat/:id",
                    "/block",
                ]
            })(req, res, next)

            expect(res.redirect).toHaveBeenCalledTimes(1)
            expect(res.redirect).toHaveBeenCalledWith(testCase.result)
        }
    });
})