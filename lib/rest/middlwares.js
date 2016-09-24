
function array_diff (array) {
  var arr_dif = [], i = 1, argc = arguments.length, argv = arguments, key, key_c, found = false;
  for (key in array) {
    for (i = 1; i < argc; i++) {
      found = false;
      for (key_c in argv[i]) {
        if (argv[i][key_c] == array[key]) {
          found = true;
          break;
        }
      }
      if (!found) {
        arr_dif[key] = array[key];
      }
    }
  }

  return arr_dif;
}

export function Middleware(middlewares = []) {
  return function() {
    const args = arguments
    return async(next = Promise.resolve()) => {
      var i = middlewares.length;
      while (i--) {
        next = middlewares[i](args, next);
      }
      return await next
    }
  }
}
type Relation = {
  table: string,
  column: string
}
export function RelationsMiddleware(
  index: number, column: string, rel: Relation, refColumn: string, relColumn: string, table: string, knex
) {
  return async (args, next) => {
    let items = args[index][column]
    if (!items) items = []
    delete args[index][column]
    let result = await next
    let itemsOld = await new knex(table).where(refColumn, result.id).select(refColumn)
    itemsOld = itemsOld.map(item => item[refColumn])
    let itemsMew = await knex(rel.table).whereIn(rel.column, items).select('id')
    itemsMew = itemsMew.map(item => item.id)
    const saved = array_diff(itemsMew, itemsOld) 
    let data = []
    if (saved.length > 0) {
      for (let item of saved) {
        let save = {}
        save[refColumn] = result.id
        save[relColumn] = item
        data.push(save)
      }
      await knex.insert(data).into(table)
    }
    const deleted = array_diff(itemsOld, itemsMew)
    if (deleted.length > 0) {
      await knex(table).whereIn(relColumn, deleted).del()
    }
    let tmp = {}
    tmp[column] = items
    return {
      ...result,
      ...tmp
    }
  }
}

export function WrapMiddleware(model) {
  return async (args, next) => {
    await next
    return await model(...args)
  }
}

export function EventsMiddleware(emitter, event) {
  return async (args, next) => {
    await emitter.emitAsync(event + '.pre', args)
    const result = await next
    let tmp
    if (result) {
      tmp = [...args, result]
    } else {
      tmp = [...args]
    }
    await emitter.emitAsync(event + '.post', tmp)
    return result
  }
}

export function ClearCacheMiddleware(redis, key) {
  return async(args, next) => {
    const result = await next
    //await redis.del(key)
    return result
  }
}

export function ListCacheMiddleware(redis, key) {
  return async(args, next) => {
    let filter = { ...args }
    filter = JSON.stringify(filter[0])
    let json = await new Promise((resolve, reject) => {
      redis.hgetall(key, (err, obj) => {
        if (err) reject(err)
        else resolve(obj)
      })
    })
    if (json && json[filter]) {
      return JSON.parse(json[filter])
    }
    json = await next
    await redis.hset(key, filter, JSON.stringify(json))
    return json
  }
}

