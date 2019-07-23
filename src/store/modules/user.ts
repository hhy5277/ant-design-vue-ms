import Vue from 'vue'
import { login, getInfo } from '@/api/api'
const user = {
    state: {
        username: sessionStorage.getItem('username'),
        token: sessionStorage.getItem('token'),
        roles: [],
        cover: false
    },
    mutations: {
        SET_USER: (state: any, data: any): void => {
            state.username = data.username
        },
        SET_TOKEN: (state: any, data: any): void => {
            state.token = data.token
        },
        SET_ROLES: (state: any, data: any): void => {
            state.roles = data
        },
        SET_COVER: (state: any, data: any): void => {
            state.cover = data
        }
    },
    actions: {
        // 登录
        Login(store: any, userInfo: any) {
            return new Promise((resolve, reject) => {
                login(userInfo).then((res: any) => {
                    if (res.data.status === 200) {
                        const result = res.data.resultData
                        Vue.ls.set('ACCESS_TOKEN', result.ACCESS_TOKEN, 60 * 60 * 1000 * 60 * 24)
                        sessionStorage.setItem('loginName', result.username)
                        store.commit('SET_TOKEN', result.ACCESS_TOKEN)
                        store.commit('SET_USER', result.username)
                        resolve(res)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        // 获取用户角色信息
        GetInfo(store: any) {
            return new Promise((resolve, reject) => {
                getInfo().then((res: any): void => {
                    if (res.data.status === 200) {
                        store.commit('SET_ROLES', res.data.resultData.info.roles)
                        sessionStorage.setItem('roles', JSON.stringify(res.data.resultData.info))
                    }
                    resolve(res)
                })
            })
        },
        Logout(store: any) {
            return new Promise((resolve, reject) => {
                sessionStorage.clear()
                store.commit('SET_TOKEN', '')
                store.commit('SET_USER', '')
                store.commit('SET_ROLES', [])
                resolve()
            })
        }
    }
}
export default user