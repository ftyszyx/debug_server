import { SUPER_POWER_ROLE, Status } from "@/config";
import { User, UserStore } from "@/entity/user.entity";
import { Power } from "@/entity/power.entity";
import { Role } from "@/entity/role.entity";
import { Menu } from "@/entity/menu.entity";
import { ApiPath } from "@/entity/api_path";
import { PowerCode, getPowerCodeByPower } from "@/entity/power_code";
import { createStoreBase } from "./base.store";
import { SetToken } from "@/util/tools";
import { MyFetchGet, MyFetchPost } from "@/util/fetch";
import { IdsReq, LoginResp } from "@/entity/api.entity";
export const UseUserStore = createStoreBase<User, UserStore>(ApiPath.GetUserList, (set, get) => {
  return {
    user_base: null,
    roles: [], // 当前用户拥有的角色
    menus: [], // 当前用户拥有的已授权的菜单
    powers: [], // 当前用户拥有的权限数据
    powersCode: [], // 当前用户拥有的权限code列表(仅保留了code)，页面中的按钮的权限控制将根据此数据源判断
    SetData: (info) => {
      console.log("login userinfo:", info);
      set((state) => {
        const powersCode = Array.from(new Set(info.powers.reduce((a: string[], b: Power) => [...a, getPowerCodeByPower(b)], [])));
        // console.log("powers", info.powers, powersCode);
        return { ...state, powersCode, ...info };
      });
    },
    LoginOut: () => {
      set((state) => {
        SetToken("");
        return { ...state, powersCode: [], user_base: null, powers: [], roles: [], menus: [] };
      });
    },
    Login: (baseinfo: LoginResp) => {
      SetToken(baseinfo.access_token);
    },
    HaveLogin: () => {
      return get().user_base != null;
    },

    isAdmin: () => {
      if (get().user_base?.roles.includes(SUPER_POWER_ROLE)) return true;
      return false;
    },
    HaveRight: (powercode: PowerCode): boolean => {
      if (get().isAdmin()) return true;
      // return true;
      return get().powersCode.includes(powercode.toLowerCase());
    },
    FetchUserDetail: async () => {
      // console.log("fetch user detail");
      const user_base = await MyFetchGet<User>(ApiPath.GetUserInfo);
      let roles = await MyFetchPost<Role[], IdsReq>(ApiPath.GetRoleById, {
        ids: user_base.roles,
      });
      roles = roles.filter((item: Role) => item.status === Status.Enable);
      let menuids = roles.reduce((a: number[], b) => a.concat(b.menus || []), []);
      menuids = Array.from(new Set(menuids.map((item) => item)));
      let menus: Menu[] = [];
      if (menuids.length > 0) {
        menus = await MyFetchPost<Menu[], IdsReq>(ApiPath.GetMenuById, {
          ids: menuids,
        });
        menus = menus.filter((item) => item.status == Status.Enable);
      }

      let powerids = roles.reduce((a: number[], b) => a.concat(b.powers || []), []);
      let powers: Power[] = [];
      if (powerids.length > 0) {
        powerids = Array.from(new Set(powerids.map((item) => item)));
        powers = await MyFetchPost<Power[], IdsReq>(ApiPath.GetPowerById, {
          ids: powerids,
        });
        powers = powers.filter((item: Power) => item.status === Status.Enable);
      }
      return { user_base, roles, menus, powers };
    },
  };
});
