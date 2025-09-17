import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { validator } from 'hono/validator';
import pocketbase from "pocketbase";

const app = new Hono()
const pb = new pocketbase("http://127.0.0.1:8090");

app.get('/', (c) => {
  return c.text('glasses Hono!')
})

app.get('/connected', async (c) => {

  const results = await pb.collection("tests").getFullList()
  console.log(results)
  return c.json(results)
})

app.post('/makeUser',
  validator('form', (value, c) => {
    const username = value["username"]
    const password = value["password"]
    const email = value["email"]

    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,<>\/?~]/;
    const emailFormat = /[@.]/


    if (typeof username != 'string' || username.length < 4 || format.test(username)){
      if (typeof username != 'string'){
        return c.text("Username must be text", 400)
      } else if (username.length < 4) {
        return c.text("Username must be longer than 4 characters", 400)
      } else if (format.test(username)){
        return c.text("Username must not contain any symbols", 400)
      }
    }

    if (typeof password != 'string' || password.length < 7){
      if (typeof password != 'string'){
        return c.text("password must be text", 400)
      } else if (password.length < 4) {
        return c.text("password must be longer than 7 characters", 400)
      }
    }

    if (typeof email != 'string' || emailFormat.test(email)){
      if (typeof email != 'string'){
        return c.text("email must be text", 400)
      } else if (format.test(email)){
        return c.text("Username must be valid", 400)
      }
    }

    return {
      username: username,
      password: password,
      email: email
    }
  }),
   async (c) => {

    const {username, password, email} = c.req.valid('form')

    const data = {
      "email": email,
      "emailVisibility": true,
      "name": username,
      "password": password,
      "passwordConfirm": password
    }

    const record = await pb.collection('users').create(data);

    return c.json(record)

})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
