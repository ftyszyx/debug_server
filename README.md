## ref

## Description

admin server with admin panel
server:nest.js+ mysql + redis
client:ant-design + vite + tailwindcss

## Installation

- init mysql with sql config /server/sql/admin.sql
- start mysql and redis server
- config server config in /server/config/app.dev.yaml
- intall server package

```
cd /server
pnpm install

```

- install client package

```
cd /client
pnpm install
```

### run server

```bash
npm run start:dev
```

### run client

```
npm run dev
```

### visit the system

open website:

```
local:5000
```

login by:
super:123456

### system pics

**登陆页面**
![登陆](/doc/img/login.png)

**管理主页**

![管理页](/doc/img/home.png)
**用户管理**

![用户管理](/doc/img/user_admin.png)

**角色管理**

![角色管理](/doc/img/role_admin.png)

**菜单管理**

![菜单管理](/doc/img/menu_admin.png)
**权限管理**

![权限管理](/doc/img/power_admin.png)
**角色修改**

![角色修改](/doc/img/change_role.png)

**用户修改**

![用户修改](/doc/img/change_user.png)

**菜单修改**

![菜单修改](/doc/img/menu_change.png)

**权限修改**

![权限修改](/doc/img/power_change.png)

## Stay in touch

- Author - [yuxin.zhang]()

## License

Nest is [MIT licensed](LICENSE).
