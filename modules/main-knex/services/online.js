
export function OnlineService(redis) {
	return {
		add(userId: number) {
			return redis.sadd('online', userId)
		},
		offline(userId) {
			return  redis.srem('online', userId)
		},
		is(userId: number) {
			return redis.SISMEMBER('online', userId)
		}
	}
}