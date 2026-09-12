<template>
  <div class="clue-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>线索管理</span>
          <el-button type="primary" size="small" @click="handleCreate">新建线索</el-button>
        </div>
      </template>
      
      <el-table :data="clues" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="name" label="线索名称" width="180" />
        <el-table-column prop="mobile" label="联系方式" width="130" />
        <el-table-column prop="source" label="来源" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleConvert(row)">转客户</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { listClue } from '@/api/crm'

const loading = ref(false)
const clues = ref<any[]>([])

const getStatusType = (status: string) => {
  const types: Record<string, any> = { 'pending': 'warning', 'converted': 'success' }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = { 'pending': '待跟进', 'converted': '已转化' }
  return texts[status] || status
}

const loadData = async () => {
  loading.value = true
  try {
    const res: any = await listClue({ page: 1, pageSize: 50 })
    clues.value = res?.list || []
  } catch (error: any) {
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => loadData())
</script>

<style scoped>
.clue-page { padding: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
</style>
