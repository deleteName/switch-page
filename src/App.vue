<template>
    <div id="app">
        <switch-page>
            <router-view></router-view>
        </switch-page>
    </div>
</template>

<script>

export default {
    name: 'app',
    data () {
        return {
        }
    }
}
</script>

<style>
body {
    margin: 0;
}
</style>
