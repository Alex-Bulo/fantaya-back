
module.exports = {
    DOMAIN : process.env.NODE_ENV ? process.env.DOMAIN + 'api/' : 'http://localhost:3001/',
    RES_URL : process.env.NODE_ENV === 'production' ? 'https://api.complejoandalue.com.ar/' : 'http://localhost:3001/',
}
