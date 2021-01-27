import Vue from 'vue'
import App from './App.vue'
import router from './router'
import SwitchPage from './SwitchPage'

Vue.use(SwitchPage)

new Vue({
    router,
    el: '#app',
    render: h => h(App)
})