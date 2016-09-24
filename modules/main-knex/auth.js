
import {UnauthorizedHttpException} from '../../lib/errors'

export async function AuthRequest(ctx) {
  if (!ctx.header || !ctx.header.authorization) {
    return
  }
  const parts = ctx.header.authorization.split(' ')
  if (parts.length === 2) {
    const scheme = parts[0];
    const credentials = parts[1];
    if (/^Bearer$/i.test(scheme)) {
      let auth = await ctx.auth.byToken(credentials)
      if (!auth) {
        throw UnauthorizedHttpException()
      }
      ctx.auth = auth.auth
      ctx.user = auth.user
    }
  }
}