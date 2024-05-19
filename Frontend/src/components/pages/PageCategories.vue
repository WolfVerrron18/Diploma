<template>
  <div class="page-categories">
    <!-- Шапка страницы -->
    <PageHeader title="Категории" button-text="Создать категорию" />

    <CategoriesList class="page-categories__list" />
  </div>
</template>

<script>
import PageHeader from '@/components/system/PageHeader.vue'
import CategoriesList from '@/components/categories/list/CategoriesList.vue'

export default {
  name: 'PageCategories',

  components: { CategoriesList, PageHeader }
}
</script>

<style scoped lang="scss">
.page-categories {
  overflow: hidden;
  height: 100%;

  &__list {
    margin-top: 16px;
  }
}
</style>
