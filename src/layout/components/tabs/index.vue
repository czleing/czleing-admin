<template>
  <section>
    <a-dropdown class="close-tab" placement="bottom" :trigger="['contextmenu']" arrow>
      <div>
        <a-tabs
          hide-add
          v-model:activeKey="currentTab"
          size="small"
          type="editable-card"
          class="nav-tabs"
          @tabClick="onTabClick"
          @edit="onDeleteHandle"
        >
          <a-tab-pane
            v-for="tab in tabsStore.tabList"
            :key="tab.path"
            :closable="tab.name !== 'index'"
          >
            <template #tab>
              <template v-if="currentTab === tab.path">
                <SyncOutlined v-if="!tabsStore.refreshing" @click="tabsStore.refreshTab" />
                <LoadingOutlined v-else />
              </template>
              {{ tab.meta.title }}
            </template>
          </a-tab-pane>
        </a-tabs>
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item @click="tabsStore.clearLeftTabs()">
            <LeftCircleTwoTone slot='icon' :twoToneColor="token.colorPrimary" />
            <span class="ml6">关闭左侧</span>
          </a-menu-item>
          <a-menu-item @click="tabsStore.clearRightTabs()">
            <RightCircleTwoTone slot='icon' :twoToneColor="token.colorPrimary" />
            <span class="ml6">关闭右侧</span>
          </a-menu-item>
          <a-menu-item @click="tabsStore.clearOtherTabs()">
            <CloseCircleTwoTone slot='icon' :twoToneColor="token.colorPrimary" />
            <span class="ml6">关闭其他</span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </section>
</template>
<script setup>
import { useTabsStore } from '@/stores/tabs-store.js'
import { SyncOutlined, LoadingOutlined, LeftCircleTwoTone, RightCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons-vue'
import { theme } from 'ant-design-vue'

const router = useRouter()
const route = useRoute()
const tabsStore = useTabsStore()
const currentTab = ref(route.path)
const { useToken } = theme
const { token } = useToken()

watchEffect(() => {
  currentTab.value = route.path
})

function onTabClick (path) {
  router.push(path)
}

function onDeleteHandle (path) {
  tabsStore.removeTab(path)
}
</script>
<style lang="less">
.nav-tabs {
  .ant-tabs-nav {
    margin: 0;
    .ant-tabs-tab-remove {
      margin-left: 0;
      margin-right: -8px;
      margin-bottom: -1px;
    }
    .anticon {
      margin-right: 4px;
    }
  }
}
</style>
