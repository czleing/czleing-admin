<template>
  <section>
    <a-tabs
      hide-add
      v-model:activeKey="currentTab"
      size="small"
      :type="settingStore.tabType"
      class="nav-tabs"
      :class="{'is-tab-line': settingStore.tabType === 'line'}"
      @tabClick="onTabClick"
      @edit="onDeleteHandle"
    >
      <a-tab-pane v-for="(tab, index) in tabsStore.tabList" :key="tab.fullPath">
        <template #tab>
          <a-dropdown class="close-tab" placement="bottom" :trigger="['contextmenu']" arrow>
            <div>
              <template v-if="currentTab === tab.fullPath">
                <SyncOutlined v-if="!tabsStore.refreshing" @click="tabsStore.refreshTab" />
                <LoadingOutlined v-else />
              </template>
              {{ tab.meta.title }}
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="tabsStore.closeTab(index)">
                  <CloseCircleTwoTone slot='icon' :twoToneColor="token.colorPrimary" />
                  <span class="ml6">{{ $t('frame.closeTab') }}</span>
                </a-menu-item>
                <a-menu-item @click="tabsStore.clearLeftTabs(index)">
                  <LeftCircleTwoTone slot='icon' :twoToneColor="token.colorPrimary" />
                  <span class="ml6">{{ $t('frame.closeLeft') }}</span>
                </a-menu-item>
                <a-menu-item @click="tabsStore.clearRightTabs(index)">
                  <RightCircleTwoTone slot='icon' :twoToneColor="token.colorPrimary" />
                  <span class="ml6">{{ $t('frame.closeRight') }}</span>
                </a-menu-item>
                <a-menu-item @click="tabsStore.clearOtherTabs(index)">
                  <CloseCircleTwoTone slot='icon' :twoToneColor="token.colorPrimary" />
                  <span class="ml6">{{ $t('frame.closeOther') }}</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </a-tab-pane>
    </a-tabs>
  </section>
</template>
<script setup>
import { useSettingStore } from '@/stores/setting-store'
import { useTabsStore } from '@/stores/tabs-store.js'
import { SyncOutlined, LoadingOutlined, LeftCircleTwoTone, RightCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons-vue'
import { theme } from 'ant-design-vue'

const router = useRouter()
const route = useRoute()
const tabsStore = useTabsStore()
const settingStore = useSettingStore()
const currentTab = ref(route.fullPath)
const { useToken } = theme
const { token } = useToken()

watchEffect(() => {
  currentTab.value = route.fullPath
})

function onTabClick(path) {
  router.push(path)
}

function onDeleteHandle(path) {
  tabsStore.removeTab(tabsStore.tabList.findIndex(tab => tab.fullPath === path))
}
</script>
<style lang="less">
.nav-tabs {
  &.is-tab-line {
    .ant-tabs-nav-wrap {
      padding-inline: 10px;
    }
  }
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
