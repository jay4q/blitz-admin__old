import { isArrayEmpty } from '@/utils/utils'

/**
 * @description 是否是超级管理员
 * @param roles 
 */
export const isSuper = (roles?: string[]) => !isArrayEmpty(roles) && roles![0] === '*'