<template>
  <div class="header-user">
    <a-dropdown v-if="authStore.hasLogin" class="">
      <a-space class="pointer">
        <a-avatar :src="getFullUrl(authStore.userInfo.avatar) || DefaultAvatar" class="shadow1" />
        <span class="header-user-name">
          {{ authStore.userInfo.nickName }}
        </span>
        <CaretDownOutlined />
      </a-space>
      <template #overlay>
        <a-menu>
          <a-menu-item @click="toPersonalCenter">
            <span>
              <UserOutlined />
              个人中心
            </span>
          </a-menu-item>
          <a-menu-item @click="authStore.logout">
            <span>
              <LogoutOutlined />
              退出系统
            </span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <span v-else class="username" @click="toLogin">未登录</span>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth-store'
import { CaretDownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons-vue'
import DefaultAvatar from '@/assets/images/avatar.jpeg'
import { getFullUrl } from '@/utils/index.js'

const authStore = useAuthStore()
const router = useRouter()
authStore.getUserInfo(true)

function toLogin () {
  router.push({ name: 'login' })
}
function toPersonalCenter () {
  router.push('/personal-center')
}
</script>

<style lang="less" scoped>
</style>
