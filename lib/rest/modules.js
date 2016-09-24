
type ModuleType = {
  name: string,
  version: string,
  start: (koa: any) => Promise<void>
}
export function Module(module: ModuleType) {
  return module
}