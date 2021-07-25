export interface PortalMenuModel extends BaseModel {
  /**
   * 指向所属父级菜单
   * 如果不存在，则表明是一级菜单
   */
  parent_id?: string
 
  /**
   * 排序值
   */
  order: number
  
  title: string
}