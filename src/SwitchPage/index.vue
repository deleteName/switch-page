<template>
    <div
        class="switch-page"
        ref="switchContainer"
    >
        <transition :name="motion.from">
            <div
                v-if="!routerBack"
                ref="pageRouter"
                class="switch-page-router"
            >
                <div class="router-keep-alive"></div>
                <slot></slot>
            </div>
        </transition>

        <transition :name="motion.to">
            <div
                v-if="routerBack"
                ref="pageRouter"
                class="switch-page-router"
            >
                <div class="router-keep-alive"></div>
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'switch-page',
    props: {
        disable: {
            type: Array,
            default: () => []
        },
        direction: {
            type: String,
            default: 'vertical',
            validator (val) {
                return ['vertical', 'transverse'].includes(val)
            }
        }
    },
    data () {
        return {
            first: true,
            routerAdd: null,
            routerBack: false
        }
    },
    created () {
        const routerJumpFnName = ['push', 'replace', 'go']
        routerJumpFnName.forEach(fnName => {
            const routerJump = this.$router[fnName]
            this.$router[fnName] = (...arg) => {
                this.routerAdd = true
                routerJump.call(this.$router, ...arg)
            }
        })
    },
    computed: {
        motion () {
            const result = {
                vertical: {
                    to: 'static',
                    from: 'slide-top'
                },
                transverse: {
                    to: 'slide-right',
                    from: 'slide-left'
                }
            }[this.direction]

            return this.first === true ? {} : result
        }
    },
    watch: {
        '$route' (to, from) {
            const setSwitchPageState = (routerAdd) => {
                if (this.first) this.first = false
                this.routerBack = routerAdd
                this.cloneRoutePage()

                this.$nextTick(() => {
                    this.routerBack = !routerAdd
                })
            }

            // 切换动画
            if (this.disable.includes(to.name) || this.disable.includes(to.path)) {
                this.first = true
            }
            else if (this.routerAdd !== null) {
                setSwitchPageState(this.routerAdd)
            }

            this.routerAdd = false
        }
    },
    methods: {
        cloneRoutePage () {
            const odlNode = this.$refs.pageRouter
            odlNode.firstChild.innerHTML = ''
            const oldChildren = odlNode.lastChild.cloneNode(true)
            this.$nextTick(() => {
                const node = this.$refs.pageRouter
                node.lastChild.style.display = 'none'
                node.firstChild.appendChild(oldChildren)
            })
        }
    }
}
</script>

<style lang="less" scoped>
@shadow-color: rgba(133, 132, 132, 0.26);
@duration: 0.5s;

.mask-page {
    &::after {
        position: absolute;
        content: ' ';
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1024;
    }
}

.switch-page {
    width: 100%;
    height: 100%;

    &-router {
        width: 100vw;
        height: 100vh;
        position: fixed;
        overflow: hidden;
        background-color: #fff;
    }
}
.slide-top-enter-active,
.slide-top-leave-active {
    box-shadow: 0 -4px 18px 4px @shadow-color;
}
.slide-left-enter-active {
    box-shadow: -4px 0 18px 4px @shadow-color;
}
.slide-right-enter-active {
    box-shadow: 4px 0 18px 4px @shadow-color;
}

// 进入动画
.slide-left-enter-active,
.slide-right-enter-active,
.slide-top-enter-active,
.slide-top-leave-active {
    z-index: 1;
    transition: all @duration cubic-bezier(0.075, 0.72, 0.165, 1);

    // .mask-page();
}
// 离开动画
.static-enter-active,
.static-leave-active,
.slide-left-leave-active,
.slide-right-leave-active {
    z-index: 0;
    transition: all @duration cubic-bezier(0.075, 0.52, 0.765, 1);

    .mask-page();
}

.slide-top-leave {
    transform: translate(0, 0);
}
.slide-top-enter {
    transform: translate(0, 100%);
}
.slide-top-enter-to {
    animation: slide-top-enter @duration;
}
.slide-top-leave-to {
    animation: slide-top-leave @duration;
}

@keyframes slide-top-leave {
    0% {
        transform: scale(1);
    }
    40% {
        transform: translate(0, 0) scale(0.9);
    }
    100% {
        transform: translate(0, 100%) scale(0.9);
    }
}

@keyframes slide-top-enter {
    0% {
        transform: translate(0, 100%) scale(0.9);
    }
    60% {
        transform: translate(0, 0) scale(0.9);
    }
    100% {
        transform: scale(1);
    }
}

.slide-right-leave-to,
.slide-right-enter {
    transform: translate(-100%, 0);
}

// 完成后最终位置和离开时起始位置
.slide-right-leave,
.slide-right-enter-to,
.slide-left-leave,
.slide-left-enter-to {
    transform: translate(0, 0);
}

.slide-left-enter,
.slide-left-leave-to {
    transform: translate(90%, 0);
}
</style>