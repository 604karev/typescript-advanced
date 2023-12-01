interface Role {
  name: string;
}
interface Permission {
  endDate: Date;
}

export interface User {
  name: string;
  roles: Role[];
  permission: Permission;
}

const user: User = {
  name: "Jack",
  roles: [],
  permission: {
    endDate: new Date(),
  },
};

const userName = user["name"];
const roleNames = "roles";

type RolesType = User["roles"];
type RolesType2 = User[typeof roleNames];
// type RolesType2 = User[roleNames]      error
type RoleType = User["roles"][number];
const roles = ["admin", "user", "super-user"] as const;
type RoleTYpes = (typeof roles)[number];
type DateType = User['permission']["endDate"]
