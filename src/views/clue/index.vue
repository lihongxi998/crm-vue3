<template>
  <div class="clue-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>线索管理</span>
          <div class="header-actions">
            <el-button type="success" size="small" @click="handleExport">导出</el-button>
            <el-button type="primary" size="small" @click="handleCreate">新建线索</el-button>
          </div>
        </div>
      </template>

      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="线索名称">
          <el-input v-model="queryParams.name" placeholder="请输入线索名称" clearable />
        </el-form-item>
        <el-form-item label="线索状态">
          <el-select v-model="queryParams.status" placeholder="请选择" clearable style="width: 120px">
            <el-option label="待跟进" :value="0" />
            <el-option label="跟进中" :value="10" />
            <el-option label="已转化" :value="20" />
            <el-option label="已作废" :value="30" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="clues" v-loading="loading" style="width: 100%" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="clueSn" label="线索编号" width="160" />
        <el-table-column prop="customerName" label="客户名称" width="150" />
        <el-table-column prop="contact" label="联系人" width="120" />
        <el-table-column prop="phone" label="电话" width="130" />
        <el-table-column prop="source" label="来源" width="120" />
        <el-table-column prop="statusLabel" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.statusLabel || getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleDetail(row)">详情</el-button>
            <el-button size="small" type="primary" @click="handleConvert(row)">转客户</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.pageNo"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        @size-change="loadData"
        @current-change="loadData"
        class="pagination"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listClue, delClue } from '@/api/crm'

const loading = ref(false)
const selectedRows = ref<any[]>([])

const queryParams = reactive({
  name: '',
  status: undefined as number | undefined
})

const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0
})

const clues = ref<any[]>([])

const getStatusType = (status: number | string) => {
  const map: Record<number, any> = { 0: 'info', 10: 'warning', 20: 'success', 30: 'danger' }
  return map[Number(status)] || 'info'
}

const getStatusText = (status: number | string) => {
  const map: Record<number, string> = { 0: '待跟进', 10: '跟进中', 20: '已转化', 30: '已作废' }
  return map[Number(status)] || String(status)
}

const loadData = async () => {
  loading.value = true
  try {
    const params = { ...queryParams, pageNo: pagination.pageNo, pageSize: pagination.pageSize }
    const res: any = await listClue(params)
    clues.value = res?.list || []
    pagination.total = res?.total || 0
  } catch (error: any) {
    console.error('加载线索列表失败:', error)
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const resetQuery = () => {
  Object.assign(queryParams, { name: '', status: undefined })
  pagination.pageNo = 1
  loadData()
}

const handleCreate = () => {
  ElMessage.info('新建线索功能开发中...')
}

const handleDetail = (row: any) => {
  ElMessage.info(`查看线索详情: ${row.clueSn}`)
}

const handleConvert = (row: any) => {
  ElMessage.info(`将线索 "${row.customerName}" 转为客户`)
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该线索吗？', '提示', { type: 'warning' })
    await delClue([row.id])
    ElMessage.success('删除成功')
    loadData()
  } catch (e: any) {
    if (e !== 'cancel') ElMessage.error(e.message || '删除失败')
  }
}

const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.clue-page { padding: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
.header-actions { display: flex; gap: 8px; }
.filter-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>
