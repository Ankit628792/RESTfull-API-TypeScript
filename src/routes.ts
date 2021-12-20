import { Express, Request, Response } from "express";
import { createPostHandler, deletePostHandler, getPostHandler, updatePostHandler } from "./controller/post.controller";
import { createUserSessionHandler, invalidUserSessionHandler, getUserSessionHandler } from "./controller/session.controller";
import { createUserHandler } from "./controller/user.controller";
import { requiresUser, validateRequest } from "./middleware";
import { createPostSchema, deletePostSchema, updatePostSchema } from "./schema/post.schema";
import { createUserSchema, createUserSessionSchema } from "./schema/user.schema";

export default function (app: Express) {
    app.get('/', (req: Request, res: Response) => {
        res.send({ msg: 'Hello' })
    })

    //register user 
    //POST /api/user
    app.post('/api/users', validateRequest(createUserSchema), createUserHandler)

    //Login 
    //POST /api/sessions
    app.post('/api/sessions', validateRequest(createUserSessionSchema), createUserSessionHandler)

    //Get user sessions 
    //GET /api/sessions
    app.get('/api/sessions', requiresUser, getUserSessionHandler)

    //Logout
    //DELETE /api/sessions
    app.delete('/api/sessions', requiresUser, invalidUserSessionHandler)

    //Create a post
    app.post('/api/posts', [requiresUser, validateRequest(createPostSchema)], createPostHandler)
    
    //Update a post
    app.patch('/api/posts:postId', [requiresUser, validateRequest(updatePostSchema)], updatePostHandler)
    
    //Get a post
    app.get('/api/posts:postId', getPostHandler)
    
    //Delete a post
    app.delete('/api/posts:postId', [requiresUser, validateRequest(deletePostSchema)], deletePostHandler)

}
