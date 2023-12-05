import { ref, createVNode, computed, nextTick } from 'vue'
import axios from '@/api/index.js'
import { message, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

/**
 * 处理操作相关、表格预设操作等
 * @returns
 */
export function useActionHandle ({ cModal, cTable, modalConfig, api, apiMethod, transformDetail, primaryKey }) {
  const isAdd = ref(false)
  const isEdit = ref(false)
  const isView = ref(false)
  const detail = ref({})
  const buttonConfig = computed(() => {
    if (typeof modalConfig.buttonConfig === 'function') {
      return modalConfig.buttonConfig({ isAdd: isAdd.value, isEdit: isEdit.value, isView: isView.value })
    } else {
      return modalConfig.buttonConfig
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
  function onAddHandle () {
    setViewType('add')
    openModal({
      title: modalConfig?.fullTitle ?? (modalConfig?.title + '-新增')
    })
  }
  async function onEditHandle (record) {
    setViewType('edit')
    openModal({
      title: modalConfig?.fullTitle ?? (modalConfig?.title + '-编辑')
    })
    detail.value = await getDetail(record[primaryKey])
  }
  async function onDetailHandle (record) {
    setViewType('detail')
    openModal({
      title: modalConfig?.fullTitle ?? (modalConfig?.title + '-详情')
    })
    detail.value = await getDetail(record[primaryKey])
  }
  async function onDeleteHandle (ids) {
    await axios[apiMethod['delete']](api.delete.replace(':id', ids.join(',')), { ids })
    message.success('删除成功')
    cTable.value.refresh()
  }
  async function onToggleHandle (record) {
    await axios[apiMethod['toggle']](api.toggle, { [primaryKey]: record[primaryKey] })
    message.success('启/禁用成功')
    cTable.value.refresh()
  }
  async function getDetail (id) {
    const detail = {
      id: 1,
      name: '张三',
      userName: '张三',
      age: 24,
      unitName: '广东省XXXX'
    }
    // const detail = await axios[apiMethod['detail']](api.detail.replace(':id', id), { id })
    console.log('模拟获取详情数据', detail)
    if (transformDetail) {
      return transformDetail(detail)
    }
    return detail
  }
  async function onBatchDeleteHandle (ids) {
    if (ids.length === 0) return
    Modal.confirm({
      title: '温馨提示',
      content: `确定要删除选中项(共${ids.length}项)吗？`,
      icon: createVNode(ExclamationCircleOutlined),
      onOk: async () => await onDeleteHandle(ids)
    })
  }
  function onSubmitHandle (submitData) {
    if (isAdd.value) {
      // await axios[apiMethod['add']](api.add, submitData)
      console.log('模拟新增')
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          message.success('新增成功')
          resolve()
        }, 1500)
      })
    } else if (isEdit.value) {
      // await axios[apiMethod['update']](api.edit, submitData)
      message.success('修改成功')
    }
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