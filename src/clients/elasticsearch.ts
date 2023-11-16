import { Client } from '@elastic/elasticsearch'

const elasticSearch = () => {
  return new Client({
    node: process.env.ES_HOST,
    auth: {
      username: process.env.ES_USER,
      password: process.env.ES_PASS
    }
  })
}

export default elasticSearch
