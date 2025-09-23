import { Hono } from 'hono'
import { Album } from '../src/useful/music-objects'

const app = new Hono()
const mainURL:string = "https://musicbrainz.org/ws/2/"
const userAgent:string = "Music rating app/0.0.1 ( https://github.com/Salty876/music-backend )"


app.get('/', (c) => {
  return c.text('Hello Hono!')
})



app.get('/trending-albums-per-genre/:genre', async (c) => {
  const genre = c.req.param('genre')

  
})

export default app
