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
            baseUrl: "/blocks",
            query: {}
        }
        const res = {
            redirect: jest.fn(),
        }
        const next = jest.fn()

        middlewareUnderTest({ routes: ["/chat", "/block"], blacklist: ["/block"] })(req, res, next)
        expect(res.redirect).toHaveBeenCalledTimes(0)
    });

    it('should redirect when route matches with one of related route items', () => {
        const testCases = [
            { baseUrl: "/chayy", url: "/chayy", result: "/chat" },
            { baseUrl: "/chayy/123", url: "/chayy/123", result: "/chat/123" },
            { baseUrl: "/chayy", url: "/chayy?window=open", query: { window: "open" }, result: "/chat?window=open" },
            { baseUrl: "/chayy/123", url: "/chayy/123?window=me", query: { window: "me" }, result: "/chat/123?window=me" },
        ]

        for (const testCase of testCases) {
            const req = {
                method: "GET",
                baseUrl: testCase.baseUrl,
                originalUrl: testCase.url,
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