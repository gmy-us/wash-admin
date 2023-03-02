<template>
  <nut-cell title="首页轮播图" is-link @click="toCarousel"></nut-cell>

</template>

<script lang="ts" setup>
import Taro from "@tarojs/taro";

const toCarousel = () => {
  Taro.navigateTo({
    url: '/pages/carousel/index'
  })
}


</script>

<style lang="less">

</style>