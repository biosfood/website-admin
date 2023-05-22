export class Page {
  target: string
  name: string

  constructor(target: string, name: string) {
    this.target = target
    this.name = name
  }
}

export const adminPages = [
  new Page("/admin", "Home"),
  new Page("/admin/assets", "Assets"),
  new Page("/admin/pages", "Pages"),
]
