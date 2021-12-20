import { FilterQuery, FlattenMaps, LeanDocument, UpdateQuery } from "mongoose";
import config from "config";
import Session, { SessionDocument } from "../model/session.model";
import { UserDocument } from "../model/user.model";
import { decode, sign } from "../utils/jwt.util";
import { get } from "lodash";
import { findUser } from "./user.service";
import log from "../logger";

export async function createSession(userId: UserDocument['_id'], userAgent: string) {
  const session = await Session.create({ user: userId, userAgent })
  return session.toJSON()
}

export function createAccessToken({ user, session }: {
  user:
  | Omit<UserDocument, "password">
  | FlattenMaps<LeanDocument<Omit<UserDocument, "password">>>,
  session: SessionDocument | FlattenMaps<LeanDocument<SessionDocument>>
}) {
  // Build and return the new access token
  return sign({ ...user, session: session._id }, { expiresIn: config.get("accessTokenTtl") }); // 15 minutes

}

export async function reIssueAccessToken({ refreshToken }: { refreshToken: string }) {
  // decode refresh token
  const { decoded } = decode(refreshToken)

  if (!decoded || !get(decoded, '_id')) return false;

  //get session
  const session = await Session.findById(get(decoded, '_id'))

  if (!session || !session?.valid) return false

  const user = await findUser({ id: session.user })
  if (!user) return false

  return createAccessToken({ user, session })

}

export async function updateSession(query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>) {  
  return Session.updateOne(query, update, { new: true })
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
  return Session.find(query).lean()
}

