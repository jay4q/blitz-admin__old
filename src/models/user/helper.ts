/**
 * @description 是否是超级管理员
 * @param roles 
 */
 export const isSuper = (roles?: string[]) => roles?.some(role => role === '*')