import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)

const state = {
	num: 5,
	loading: false,
}

const mutations = {
	add(state) {
		state.num++
	},
	minus(state) {
		state.num--
	},
	// changeLoading (state, status) {
	// 	if (typeof status !== 'boolean') {
	// 		throw new Error('状态错误')
	// 	}
	// 	state.loading = status
	// },
	startLoad (state) {
		state.loading = true
	},
	endLoad (state) {
		state.loading = false
	},
}

const actions = {
	add({commit}) {
		commit('add')
	},
	minus({commit}) {
		commit('minus')
	}
}

const getters = { 
    num: function(state) {
        return state.num
	}
}


export default new vuex.Store({
	state,
	mutations,
	actions,
	getters
})