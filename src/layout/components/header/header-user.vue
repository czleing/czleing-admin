<template>
  <div class="header-user">
    <a-dropdown v-if="authStore.hasLogin" class="">
      <a-space class="pointer">
        <a-avatar size="25" :src="authStore.userInfo.avatar" class="shadow1" />
        <span class="header-user-name">
          {{ authStore.userInfo.nickname }}
        </span>
        <CaretDownOutlined />
      </a-space>
      <template #overlay>
        <a-menu>
          <a-menu-item>
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth-store'
import { CaretDownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons-vue'

const authStore = useAuthStore()
const router = useRouter()

function toLogin () {
  router.push({ name: 'login' })
}
</script>

<style lang="less" scoped>
</style>
