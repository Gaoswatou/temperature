<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}
body,
html {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  font-family: PingFangSC-Regular, PingFang SC, Avenir, Helvetica, Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 400;
  height: 100%;
}
</style>
