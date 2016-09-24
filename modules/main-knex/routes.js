
import Router from 'koa-router'
import FilesRouter from './routes/files'
import UsersRouter from './routes/users'
import RoomsRouter from './routes/rooms'
import ObjectsRouter from './routes/objects'
import TagsRouter from './routes/tags'
import DirectoriesRouter from './routes/directories'
import RolesRouter from './routes/roles'
import FieldsRouter from './routes/fields'
import AuthRouter from './routes/auth'
import ProfileRouter from './routes/profile'
import ItemRouter from './routes/items'
import FriendRouter from './routes/friends'
import ChatRouter from './routes/chat'
import PushesRouter from './routes/pushes'

export function ModuleRouter(prefix, router = new Router()) {

  const files = FilesRouter()
  router.use(prefix, files.routes(), files.allowedMethods())
  const rooms = RoomsRouter()
  router.use(prefix, rooms.routes(), rooms.allowedMethods())
  const auth = AuthRouter()
  router.use(prefix, auth.routes(), auth.allowedMethods())
  const users = UsersRouter()
  router.use(prefix, users.routes(), users.allowedMethods())
  const objects = ObjectsRouter()
  router.use(prefix, objects.routes(), objects.allowedMethods())
  const tags = TagsRouter()
  router.use(prefix, tags.routes(), tags.allowedMethods())
  const directories = DirectoriesRouter()
  router.use(prefix, directories.routes(), directories.allowedMethods())
  const roles = RolesRouter()
  router.use(prefix, roles.routes(), roles.allowedMethods())
  const fields = FieldsRouter()
  router.use(prefix, fields.routes(), fields.allowedMethods())
  const profile = ProfileRouter()
  router.use(prefix, profile.routes(), profile.allowedMethods())
  const items = ItemRouter()
  router.use(prefix, items.routes(), items.allowedMethods())
  const friends = FriendRouter()
  router.use(prefix, friends.routes(), friends.allowedMethods())
  const chat = ChatRouter()
  router.use(prefix, chat.routes(), chat.allowedMethods())
  const pushes = PushesRouter()
  router.use(prefix, pushes.routes(), pushes.allowedMethods())

  return router
}