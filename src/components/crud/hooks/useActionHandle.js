import axios from '@/api/index.js'
import { message, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { createVNode } from 'vue'

/**
 * 处理操作相关、表格预设操作等
 * @returns
 */
export function useActionHandle ({ cModal, cForm, cTable, modalConfig, api, apiMethod, transformDetail, afterOpenModal, primaryKey, apiOptionConfig }) {
  const isAdd = ref(false)
  const isEdit = ref(false)
  const isView = ref(false)
  const detail = ref({})
  const buttonConfig = computed(() => {
    let config = modalConfig.buttonConfig
    if (typeof config === 'function') {
      config = config({ isAdd: isAdd.value, isEdit: isEdit.value, isView: isView.value })
    }
    return {
      ...config,
      showConfirm: config.showConfirm ?? !isView.value, // 详情默认不展示确认按钮，除非强制设置了展示
      cancelText: config.cancelText ?? (isView.value ? '关闭' : undefined) // 详情修改取消按钮为关闭
    }
  })
  const formConfig = computed(() => {
    if (typeof modalConfig.formConfig === 'function') {
      return modalConfig.formConfig({ isAdd: isAdd.value, isEdit: isEdit.value, isView: isView.value, detail: detail.value })
    } else {
      return modalConfig.formConfig
    }
  })

  function setViewType (type) {
    isAdd.value = type === 'add'
    isEdit.value = type === 'edit'
    isView.value = type === 'detail'
  }
  async function openModal (options) {
    await nextTick()
    cModal.value.open({
      mode: modalConfig?.mode,
      width: modalConfig?.width,
      ...options
    })
    await nextTick()
    if (typeof afterOpenModal === 'function') {
      await afterOpenModal({ isAdd: isAdd.value, isEdit: isEdit.value, isView: isView.value, record: options.record, detail, cForm })
    }
  }
  // 表格操作按钮事件处理
  function onActionHandle ({ action, record }) {
    if (action === 'edit') {
      onEditHandle(record)
    } else if (action === 'detail') {
      onDetailHandle(record)
    } else if (action === 'delete') {
      onDeleteHandle([record[primaryKey]])
    } else if (action === 'toggle') {
      onToggleHandle(record)
    } else {
      console.error(`action[${action}]不正确，只支持[edit, detail, delete, toggle]`)
    }
  }
  function onAddHandle (initData = {}) {
    setViewType('add')
    detail.value = initData
    openModal({
      title: modalConfig?.fullTitle ?? (modalConfig?.title + '-新增')
    })
  }
  async function onEditHandle (record) {
    setViewType('edit')
    detail.value = await getDetail(record[primaryKey])
    openModal({
      record,
      title: modalConfig?.fullTitle ?? (modalConfig?.title + '-编辑')
    })
  }
  async function onDetailHandle (record) {
    setViewType('detail')
    detail.value = await getDetail(record[primaryKey])
    openModal({
      record,
      title: modalConfig?.fullTitle ?? (modalConfig?.title + '-详情')
    })
  }
  async function onDeleteHandle (ids) {
    await axios[apiMethod['delete']](api.delete.replace(':ids', ids.join(',')), null, apiOptionConfig?.delete)
    message.success('删除成功')
    cTable.value.refresh()
  }
  async function onToggleHandle (record) {
    await axios[apiMethod['toggle']](api.toggle, { [primaryKey]: record[primaryKey] }, apiOptionConfig?.toggle)
    message.success('启/禁用成功')
    cTable.value.refresh()
  }
  async function getDetail (id) {
    const detail = await axios[apiMethod['detail']](api.detail.replace(':id', id), { id }, apiOptionConfig?.detail)
    if (transformDetail) {
      return transformDetail(detail, { isEdit: isEdit.value, isView: isView.value })
    }
    return detail
  }
  async function onBatchDeleteHandle (ids) {
    if (ids.length === 0) return
    Modal.confirm({
      title: '温馨提示',
      content: `确定要删除选中项(共${ids.length}项)吗？`,
      icon: createVNode(ExclamationCircleOutlined),
      onOk: async () => {
        await onDeleteHandle(ids)
        cTable.value.clearSelect()
      }
    })
  }
  async function onSubmitHandle (submitData) {
    if (isAdd.value) {
      await axios[apiMethod['add']](api.add, submitData, apiOptionConfig?.add)
      message.success('新增成功')
    } else if (isEdit.value) {
      await axios[apiMethod['update']](api.update, submitData, apiOptionConfig?.update)
      message.success('修改成功')
    }
    cTable.value.refresh()
  }

  return {
    isAdd,
    isEdit,
    isView,
    detail,
    buttonConfig,
    formConfig,
    onActionHandle,
    onAddHandle,
    onBatchDeleteHandle,
    onSubmitHandle
  }
}