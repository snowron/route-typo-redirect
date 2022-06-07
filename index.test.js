const { redirect } = require('express/lib/response');
const middlewareUnderTest = require('./index')

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
        method: "GET"
    }
    const res = {}
    const next = jest.fn()

    middlewareUnderTest({ routes: ["/chat", "/block"], blacklist: ["/block"] })(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
});

it('should redirect when route matches with one of related route items', () => {
    const req = {
        method: "GET",
        originalUrl: "/chayy",
        query: {}
    }
    const res = {
        redirect: jest.fn(),
    }
    const next = jest.fn()

    middlewareUnderTest({ routes: ["/chat", "/block"] })(req, res, next)
    expect(res.redirect).toHaveBeenCalledTimes(1)
});


it('should redirect when params route matches with one of related route items', () => {
    const req = {
        method: "GET",
        originalUrl: "/chayy/123",
        query: {}
    }
    const res = {
        redirect: jest.fn(),
    }
    const next = jest.fn()

    middlewareUnderTest({ routes: ["/chat/:id", "/block"] })(req, res, next)
    expect(res.redirect).toHaveBeenCalledTimes(1)
    expect(res.redirect).toHaveBeenCalledWith("/chat/123")
});

it('should redirect when params route matches with one of related route items with query params', () => {
    const req = {
        method: "GET",
        originalUrl: "/chayy/123?query=me",
        query: {}
    }
    const res = {
        redirect: jest.fn(),
    }
    const next = jest.fn()

    middlewareUnderTest({ routes: ["/chat/:id", "/block"] })(req, res, next)
    expect(res.redirect).toHaveBeenCalledTimes(1)
    expect(res.redirect).toHaveBeenCalledWith("/chat/123?query=me")
});