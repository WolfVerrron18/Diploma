<template>
  <header class="system-header">
    <div class="system-header__logo">LOGO</div>

    <ul class="system-header__categories">
      <li class="system-header__category">category</li>
    </ul>

    <div class="system-header__profile">Profile</div>
  </header>
</template>

<script>
export default {
  name: 'SystemHeader'
}
</script>

<style scoped lang="scss">
.system-header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid aliceblue;
}
</style>
