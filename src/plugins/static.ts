import { fastifyStatic, FastifyStaticOptions } from '@fastify/static'
import fp from 'fastify-plugin'
import path from 'path'

/**
 * This plugins adds static files to serve
 *
 * @see https://github.com/fastify/fastify-static
 */
export default fp<FastifyStaticOptions>(async fastify => {
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '/../../public'),
    prefix: '/public',
    wildcard: true,
    constraints: {},
    list: {
      format: 'html',
      render: (dirs, files) => {
        return `
          <html><body>
            <ul>
              ${dirs.map(dir => `<li><a href="${dir.href}">${dir.name}</a></li>`).join('\n')}
            </ul>
            <ul>
              ${files
                .map(file => `<li><a href="${file.href}" target="_blank">${file.name}</a></li>`)
                .join('\n')}
            </ul>
        </body></html>
			`
      }
    }
  })
})
