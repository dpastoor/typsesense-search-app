const Typesense = require('typesense');

export default class TypesenseApi {
    constructor(url, apikey, port = "8108", protocol = "http") {
        this.client = new Typesense.Client({
            'masterNode': {
                'host': url,
                'port': port,
                'protocol': protocol,
                'apiKey': apikey
            },
            'timeoutSeconds': 2
        })
        this.getSearchResults = this.getSearchResults.bind(this)
    }
    async getSearchResults(searchString) {
        let searchParameters = {
            'q': searchString,
            'query_by': 'data'
        }
        let data = await this
            .client
            .collections('content')
            .documents()
            .search(searchParameters)
        return data
            .hits
            .map(d => {
                return {snippets: d.highlights[0].snippets, branch: d.document.branch, slug: d.document.slug, nav_target: d.document.nav_target}
            });
    }
}