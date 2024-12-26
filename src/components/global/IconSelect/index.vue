<!-- ant-design-vue 4 icons 选择器 -->
<!-- 用法：<icon-select v-model:value="formData.icon" /> -->
<template>
  <div class="icons-select">
    <div class="flex-x x-middle">
      <a-icon v-if="iconName" :type="iconName" class="mr20" style="font-size: 18px;" />
      <a-button v-if="!disabled" @click="open">请选择</a-button>
    </div>
    <Modal v-if="!disabled" ref="cModal" title="选择图标" width="900" :footer="null">
      <div class="flex-x x-middle flex-wrap">
        <div
          class="icons-select__item"
          v-for="item in iconList"
          :key="item.name"
          :class="{ 'is-active': item.name === iconName }"
          :title="item.name"
          @click="onSelectHandle(item.name)"
        >
          <component :is="createVNode(item.value)" />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import * as Icons from '@ant-design/icons-vue'

const props = defineProps({
  value: String,
  disabled: Boolean
})
const iconName = ref()
const cModal = ref()
const iconList = computed(() => {
  if (props.disabled) return []
  const includes = [
    'VerticalAlignBottomOutlined', 'RollbackOutlined', 'RetweetOutlined', 'SwapOutlined', 'LoginOutlined',
    'LogoutOutlined', 'PlayCircleOutlined', 'ClockCircleOutlined', 'WarningOutlined', 'AreaChartOutlined',
    'PieChartOutlined', 'BarChartOutlined', 'DotChartOutlined', 'LineChartOutlined', 'RadarChartOutlined',
    'HeatMapOutlined', 'FundOutlined', 'AndroidOutlined', 'AppleOutlined', 'WindowsOutlined', 'WechatOutlined',
    'AlipayCircleOutlined', 'AlipayOutlined', 'AccountBookOutlined', 'AimOutlined', 'AlertOutlined',
    'ApartmentOutlined', 'ApiOutlined', 'AppstoreAddOutlined', 'AppstoreOutlined', 'AudioOutlined',
    'AudioMutedOutlined', 'AuditOutlined', 'BankOutlined', 'BarcodeOutlined', 'BarsOutlined', 'BellOutlined',
    'BlockOutlined', 'BookOutlined', 'BorderOutlined', 'BorderlessTableOutlined', 'BranchesOutlined', 'BugOutlined',
    'BuildOutlined', 'BulbOutlined', 'CalculatorOutlined', 'CalendarOutlined', 'CameraOutlined', 'CarOutlined',
    'CarryOutOutlined', 'CiCircleOutlined', 'CiOutlined', 'ClearOutlined',
    'CloudDownloadOutlined', 'CloudOutlined', 'CloudServerOutlined', 'CloudSyncOutlined', 'CloudUploadOutlined',
    'ClusterOutlined', 'CodeOutlined', 'CoffeeOutlined', 'CommentOutlined', 'CompassOutlined', 'ConsoleSqlOutlined',
    'ContactsOutlined', 'ContainerOutlined', 'ControlOutlined', 'CopyrightOutlined', 'CreditCardOutlined',
    'CrownOutlined', 'CustomerServiceOutlined', 'DashboardOutlined', 'DatabaseOutlined', 'DeliveredProcedureOutlined',
    'DeploymentUnitOutlined', 'DesktopOutlined', 'DisconnectOutlined', 'DislikeOutlined', 'DollarOutlined',
    'DownloadOutlined', 'EnvironmentOutlined', 'EuroOutlined', 'ExceptionOutlined', 'ExperimentOutlined',
    'ExportOutlined', 'FieldTimeOutlined', 'FileAddOutlined', 'FileDoneOutlined', 'FileOutlined', 'FileProtectOutlined',
    'FileSearchOutlined', 'FileSyncOutlined', 'FileTextOutlined', 'FileUnknownOutlined', 'FileWordOutlined',
    'FileZipOutlined', 'FilterOutlined', 'FireOutlined', 'FlagOutlined', 'FolderAddOutlined', 'FolderOutlined',
    'FolderOpenOutlined', 'FolderViewOutlined', 'ForkOutlined', 'FormatPainterOutlined', 'FrownOutlined',
    'FunctionOutlined', 'FundProjectionScreenOutlined', 'FundViewOutlined', 'FunnelPlotOutlined', 'GatewayOutlined',
    'GifOutlined', 'GiftOutlined', 'GlobalOutlined', 'GoldOutlined', 'GroupOutlined', 'HddOutlined', 'HeartOutlined',
    'HistoryOutlined', 'HolderOutlined', 'HomeOutlined', 'HourglassOutlined', 'IdcardOutlined', 'ImportOutlined',
    'InboxOutlined', 'InsuranceOutlined', 'InteractionOutlined', 'KeyOutlined', 'LaptopOutlined', 'LayoutOutlined',
    'LikeOutlined', 'LinkOutlined', 'LockOutlined', 'MacCommandOutlined', 'MailOutlined', 'ManOutlined',
    'MedicineBoxOutlined', 'MehOutlined', 'MenuOutlined', 'MergeCellsOutlined', 'MessageOutlined', 'MobileOutlined',
    'MoneyCollectOutlined', 'NodeIndexOutlined', 'NotificationOutlined', 'NumberOutlined', 'OneToOneOutlined',
    'PaperClipOutlined', 'PartitionOutlined', 'PayCircleOutlined', 'PercentageOutlined', 'PhoneOutlined',
    'PictureOutlined', 'PlaySquareOutlined', 'PoundCircleOutlined', 'PoundOutlined', 'PoweroffOutlined',
    'PrinterOutlined', 'ProfileOutlined', 'ProjectOutlined', 'PropertySafetyOutlined', 'PullRequestOutlined',
    'PushpinOutlined', 'QrcodeOutlined', 'ReadOutlined', 'ReconciliationOutlined', 'RedEnvelopeOutlined',
    'ReloadOutlined', 'RestOutlined', 'RobotOutlined', 'RocketOutlined', 'RotateLeftOutlined', 'RotateRightOutlined',
    'SafetyCertificateOutlined', 'SafetyOutlined', 'SaveOutlined', 'ScanOutlined', 'ScheduleOutlined',
    'SearchOutlined', 'SecurityScanOutlined', 'SelectOutlined', 'SendOutlined', 'SettingOutlined', 'ShakeOutlined',
    'ShareAltOutlined', 'ShopOutlined', 'ShoppingCartOutlined', 'ShoppingOutlined', 'SisternodeOutlined',
    'SkinOutlined', 'SmileOutlined', 'SolutionOutlined', 'SoundOutlined', 'SplitCellsOutlined', 'StarOutlined',
    'SubnodeOutlined', 'SwitcherOutlined', 'SyncOutlined', 'TableOutlined', 'TabletOutlined', 'TagOutlined',
    'TagsOutlined', 'TeamOutlined', 'ThunderboltOutlined', 'ToTopOutlined', 'ToolOutlined',
    'TrademarkOutlined', 'TransactionOutlined', 'TranslationOutlined', 'TrophyOutlined', 'UngroupOutlined',
    'UnlockOutlined', 'UploadOutlined', 'UsbOutlined', 'UserAddOutlined', 'UserDeleteOutlined', 'UserOutlined',
    'UserSwitchOutlined', 'UsergroupAddOutlined', 'UsergroupDeleteOutlined', 'VerifiedOutlined',
    'VideoCameraAddOutlined', 'VideoCameraOutlined', 'WalletOutlined', 'WhatsAppOutlined', 'WifiOutlined',
    'WomanOutlined', 'ClockCircleFilled', 'WarningFilled', 'FundFilled', 'PieChartFilled', 'AndroidFilled',
    'AppleFilled', 'WindowsFilled', 'AlipaySquareFilled', 'AppstoreFilled', 'BankFilled',
    'BellFilled', 'BookFilled', 'BugFilled', 'CalculatorFilled', 'CalendarFilled', 'CameraFilled', 'CarFilled',
    'CloudFilled', 'CodeFilled', 'CodeSandboxSquareFilled', 'DollarCircleFilled', 'FlagFilled', 'FileFilled',
    'GiftFilled', 'GoldFilled', 'HeartFilled', 'HomeFilled', 'IdcardFilled', 'InsuranceFilled', 'PayCircleFilled',
    'PhoneFilled', 'PictureFilled', 'PrinterFilled', 'ProfileFilled', 'PropertySafetyFilled',
    'SafetyCertificateFilled', 'SettingFilled', 'ShopFilled', 'ShoppingFilled', 'SignalFilled', 'SkinFilled',
    'SoundFilled', 'StarFilled', 'TagFilled', 'TagsFilled', 'WalletFilled'
  ]
  const icons = []
  Object.keys(Icons).forEach(key => {
    if (includes.includes(key)) {
      icons.push({
        name: key,
        value: Icons[key]
      })
    }
  })
  return icons
})

watch(
  () => props.value,
  () => {
    iconName.value = props.value
  },
  { immediate: true }
)

function open () {
  cModal.value?.open()
}

function onSelectHandle (name) {
  iconName.value = name
  cModal.value?.close()
  emitChange()
}

const emits = defineEmits(['update:value'])

async function emitChange () {
  await nextTick()
  emits('update:value', iconName.value)
  emits('change', iconName.value)
}
</script>

<style lang="scss" scoped>
.icons-select {
  &__item {
    margin: 2px;
    border-radius: 5px;
    font-size: 22px;
    padding: 5px 12px;
    transition: all .3s;
    cursor: pointer;
    &:hover {
      box-shadow: 0 0 10px rgba(0, 0, 0, .1);
      position: relative;
      z-index: 1;
      transform: scale(1.1);
    }
    &.is-active {
      box-shadow: 0 0 10px rgba(0, 90, 150, .2);
      position: relative;
      z-index: 2;
      background-color: #97f3fb;
    }
  }
}
</style>
