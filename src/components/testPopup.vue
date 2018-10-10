<template>
  <div>

    <div v-if="showTestPage">
      <p>0</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>
      <button @click="fun">点击</button>
      <p>1</p>
      <p>1</p>
    </div>
    <transition
      name="custom-classes-transition"
      enter-active-class="animated bounceInUp"
      leave-active-class="animated slideInDown"
    >
      <div v-if="!showTestPage">
        <WhiteListA @closePage="closePage"></WhiteListA>
      </div>
    </transition>
  </div>
</template>

<script>
  import WhiteListA from './HomeWhiteListA'
  export default {
    data() {
      return {
        showTestPage:true
      }
    },
    computed: {},
    components:{WhiteListA},
    methods: {
      fun(){
        this.showTestPage = !this.showTestPage;
      },
      closePage(){
        this.showTestPage = true
      }
    },
    created() {
    },
    mounted() {
    },
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .page{
    width: 100%;
    height: 100%;
  }
</style>
