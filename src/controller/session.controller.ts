import { Request, Response } from "express";
import { createAccessToken, createSession, findSessions, updateSession } from "../service/session.service";
import { validatePassword } from "../service/user.service";
import { sign } from "../utils/jwt.util";
import config from 'config'
import { get } from "lodash";

export async function createUserSessionHandler(req: Request, res: Response) {
    //validate credentials
    const user = await validatePassword(req.body);
    if (!user) {return res.status(401).send('Invslid Credentials');}

    //create a session
    const session = await createSession(user._id, req.get('user-agent') || "");

    //create access token
    const accessToken = createAccessToken({ user, session });

    //create refresh token
    const refreshToken = sign(session,{expiresIn: config.get('refreshTokenTtl')})

    //send refresh & access token
    return res.send({accessToken, refreshToken})
}

export async function invalidUserSessionHandler(req: Request, res: Response) {
    const sessionId = get(req, 'user.session')
    await updateSession({_id: sessionId},{valid: false})
    return res.sendStatus(200)
}

export async function getUserSessionHandler(req: Request, res: Response) {
    const userId = get(req, 'user._id')
    const sessions = await findSessions({ user: userId, valid: true})
    return res.send(sessions)
}