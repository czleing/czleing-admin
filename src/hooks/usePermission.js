import { useAuthStore } from "@/stores/auth-store"

/**
 * 使用权限相关
 */
export function usePermission () {
  const authStore = useAuthStore()
  /** 当前用户角色字符串数组（保持响应性） */
  const roles = computed(() => authStore.roles ?? [])
  /** 支持的权限字符串数组 ['system:user:add', 'xxx:xxx:xxx']（保持响应性） */
  const permissions = computed(() => authStore.permissions ?? [])
  /** 是否拥有所有权限 */
  const hasAllPermission = computed(() => permissions.value.includes('*:*:*'))
  return {
    roles,
    permissions,
    hasAllPermission,
    /** 判断是否有权限，传数组时命中其一即表示有权限 */
    hasPermission (permission) {
      if (!permission) return true
      const list = Array.isArray(permission) ? permission : [permission]
      return hasAllPermission.value || list.some(item => permissions.value.includes(item))
    },
    /** 判断是否有某个角色 */
    hasRole (role) {
      if (!role) return true
      return roles.value.includes(role)
    }
  }
}
export default usePermission
