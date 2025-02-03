import { ROLE_PERMISSIONS } from "@/configs/rolePermissions";

export default class RbacService {
  private static _instance: RbacService;
  private readonly rolePermissions: Record<string, string[]>;

  public constructor() {
    this.rolePermissions = ROLE_PERMISSIONS;
  }

  public static initInstance(): RbacService {
    this._instance = new RbacService();
    return this._instance;
  }

  public static GetInstance(): RbacService {
    if (!this._instance) {
      this.initInstance();
    }
    return this._instance;
  }

  public hasPermission(role: string, permission: string): boolean {
    return this.rolePermissions[role]?.includes(permission) || false;
  }
}
