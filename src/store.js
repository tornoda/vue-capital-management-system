import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import jwt_decode from 'jwt-decode'
import { Message } from 'element-ui'

Vue.use(Vuex)

const type = {
  REGISTER: 'REGISTER',
  REGISTER_BEGIN: 'REGISTER_BEGIN',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',

  LOGIN: 'LOGIN',
  LOGIN_BEGIN: 'LOGIN_BEGIN',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',

  EXIT: 'EXIT',

  SET_AUTHENTICATION: 'SET_AUTHENTICATION',
  SET_USER: 'SET_USER',
  SAVE_TOKEN_TO_LOCAL: 'SAVE_TOKEN_TO_LOCAL',

  //路由index/fundlist里面
  //对state的增，改，删
  ADD_LIST: 'ADD_LIST',
  DELETE_LIST: 'DELETE_LIST',
  EDIT_LIST: 'EDIT_LIST',

  FETCH_PROFILES_DATA: 'FETCH_PROFILES_DATA',
  ADD_LIST_REMOTE: 'ADD_LIST_REMOTE',
  DELETE_LIST_REMOTE: 'DELETE_LIST_REMOTE',
  EDIT_LIST_REMOTE: 'EDIT_LIST_REMOTE',

  //分页功能
  SET_ALL_DATA: 'SET_ALL_DATA',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  SET_CURRENT_PAGINATION: 'SET_CURRENT_PAGINATION',

  FILTER_REMOVE: "FILTER_REMOVE",
  FILTER_DATA: "FILTER_DATA",
  GET_INFO_FROM_STORAGE_REFRESHING: 'GET_INFO_FROM_STORAGE_REFRESHING',

  //按钮
  SHOW_ADD_BTN: "SHOW_ADD_BTN",
  SHOW_EDIT_BTN: "SHOW_EDIT_BTN",
  //隐藏弹窗
  HIDE_DIALOG: "HIDE_DIALOG",
  //保存当前操作index
  REMENBER_INDEX: "REMENBER_INDEX"
}

const state = {
  isAuthentication: false,
  user: {
    avatar: "#",
    name: "looyulong"
  },
  tableData: [],
  filterData: [],
  allTableData: [],
  allTableDataBackup: [],
  currenIndex: 0,

  dialog: {
    option: {
      title: "",
      type: "",
      visible: false
    },
    data: {
      type: "",
      describe: "",
      income: "",
      expend: "",
      cash: "",
      remark: ""
    }
  },

  pagination: {
    currentPage: 1,
    pageSize: 5
  },

  datePicker: {
    date: []
  }
}

const getters = {
  allTableDataNum: state => {
    return state.allTableData.length
  },
  isDatePickerDisabled: state => {
    if (state.datePicker.date.length === 0) return true
    return false
  },
  isResetBtnDisabled: state => {
    const { allTableData, allTableDataBackup } = state
    return allTableData.length === allTableDataBackup.length || allTableDataBackup.length === 0
  },
  pageNumber: state => {
    const { allTableData, pagination: { pageSize } } = state
    const totalItem = allTableData.length
    return Math.ceil(totalItem / pageSize)
  }
}

const mutations = {
  //注册
  [type.REGISTER_BEGIN]() {
    Message({
      message: '请稍候...',
      type: 'info',
      center: true
    })
  },
  [type.REGISTER_SUCCESS](state, msg) {
    Message({
      message: msg,
      type: 'success',
      center: true
    })
  },
  //登录
  [type.LOGIN_BEGIN]() {
    Message({
      message: '登录中，请稍后',
      type: 'info',
      center: true
    })
  },
  [type.LOGIN_SUCCESS](state, msg) {
    Message({
      message: msg,
      type: 'success',
      center: true
    })
  },
  //退出登录
  [type.EXIT](state) {
    state.isAuthentication = false;
    state.user = {};
    router.push("/login");
    localStorage.removeItem("eleToken")
  },
  //登录后
  [type.SET_AUTHENTICATION](state, isAuthentication = true) {
    state.isAuthentication = isAuthentication
  },

  [type.SET_USER](state, user) {
    state.user = user || {}
  },
  [type.SAVE_TOKEN_TO_LOCAL](state, token) {
    localStorage.setItem('eleToken', token || '')
  },
  //刷新页面所需要的
  [type.GET_INFO_FROM_STORAGE_REFRESHING](state) {
    const tokenDecoded = jwt_decode(localStorage.eleToken)
    const { name, avatar } = tokenDecoded
    state.user = {
      name,
      avatar
    }
  },
  //赠。改。删
  [type.ADD_LIST](state, newList) {
    const data = state.allTableData.slice();
    data.push(newList)
    state.allTableData = data
  },
  [type.DELETE_LIST](state, index) {
    const data = state.allTableData.slice()
    data.splice(index, 1)
    state.allTableData = data
  },
  [type.EDIT_LIST](state, { index, newList }) {
    const copyData = state.allTableData.slice()
    const { pagination: { currentPage, pageSize }, dialog: { data } } = state
    const trueIndex = currentPage * pageSize + index
    copyData[trueIndex] = data
    state.allTableData = copyData
  },
  //设置分页功能
  //点击页码时，显示在屏幕的条目
  [type.SET_CURRENT_PAGE](state, currentPage = 1) {
    const { allTableData, pagination: { pageSize } } = state
    const start = pageSize * (currentPage - 1)
    state.tableData = allTableData.slice().splice(start, pageSize)
  },
  //表观上设置pagination的数字，用于赠删改后的页面更新
  [type.SET_CURRENT_PAGINATION](state, pageNO) {
    state.pagination.currentPage = pageNO
  },
  //设置所有数据
  [type.SET_ALL_DATA](state, allData) {
    state.allTableData = allData
  },
  //筛选
  [type.FILTER_DATA](state) {
    const [start, end] = state.datePicker.date
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const filteredList = state.allTableData.filter(val => {
      const thisTime = new Date(val.data).getTime();
      return thisTime <= endTime && thisTime >= startTime;
    });
    //改变整个List前把所有的数据备份到data里面；方便之后取消筛选后还原
    state.allTableDataBackup = state.allTableData.slice();
    state.allTableData = filteredList
  },
  [type.FILTER_REMOVE]({ allTableDataBackup }) {
    state.datePicker.data = []
    state.allTableData = allTableDataBackup.slice();
  },
  //显示修改和增加按钮
  [type.SHOW_ADD_BTN](state) {
    state.dialog.option = {
      title: "增加一条数据",
      type: "add",
      visible: true
    }
  },
  [type.SHOW_EDIT_BTN](state, oldData) {
    state.dialog.option = {
      title: "在原始数据上修改",
      type: "edit",
      visible: true
    };
    state.dialog.data = oldData;
  },
  [type.HIDE_DIALOG](state) {
    state.dialog.option = {
      visible: false
    }
  },
  //但前编辑的table行
  [type.REMENBER_INDEX](state, index) {
    state.currenIndex = index
  }
}

const actions = {
  [type.REGISTER]({ commit }, userInfo) {
    commit(type.REGISTER_BEGIN)
    return Vue.http.post("http://localhost:8000/api/users/register", userInfo)
      .then(res => {
        (async () => {
          await commit(type.REGISTER_SUCCESS, res.body.msg)
          // await Message({
          //   message: `${res.body.msg}`,
          //   center: true,
          //   type: "success"
          // });
          // return Promise.resolve();
        })().then(() => {
          router.push("/login");
        });
      })
  },

  [type.LOGIN]({ commit }, userInfo) {
    commit(type.LOGIN_BEGIN)
    return Vue.http //验证通过后POST登录，并显示相关信息
      .post("http://localhost:8000/api/users/login", userInfo)
      .then(res => {
        const { token } = res.body;
        const tokenDecoded = jwt_decode(token);
        (async () => {
          await commit(type.LOGIN_SUCCESS, res.body.msg)
          // await Message({
          //   message: `${res.body.msg}`,
          //   type: "success"
          // });
        })().then(() => {
          router.push("/index");
        });
        return Promise.resolve({ tokenDecoded, token })
        // localStorage.setItem("eleToken", token || "");
        // if (token) commit('SET_AUTHENTICATION');
        // commit('SET_USER', { id, name, avatar, identity });
      });
  },

  [type.FETCH_PROFILES_DATA]({ state, commit }) {
    return Vue.http.get("http://localhost:8000/api/profiles")
      .then((res) => {
        // state.allTableData = res.body
        commit(type.SET_ALL_DATA, res.body)
        return Promise.resolve()
      })
      .catch(err => { throw err })
  },

  [type.ADD_LIST_REMOTE]({ commit, state }) {
    const { dialog: { data } } = state
    return Vue.http.post("http://localhost:8000/api/profiles/add", data)
      .then((res) => {
        commit(type.ADD_LIST, res.body);
        return Promise.resolve()
      })
      .catch(err => { return Promise.reject(err) })
  },

  [type.DELETE_LIST_REMOTE]({ commit, state }) {
    const { tableData, currenIndex } = state
    const id = tableData[currenIndex]["_id"]
    return Vue.http.post("http://localhost:8000/api/profiles/delete/" + id)
      .then((res) => {
        commit(type.DELETE_LIST, currenIndex)
        return Promise.resolve()
      })
      .catch((err) => {
        return Promise.reject(err)
      })
  },

  [type.EDIT_LIST_REMOTE]({ commit, state }, index) {
    const { dialog: { data } } = state
    const id = data._id
    // const newData = Object.assign({}, )
    return Vue.http.post("http://localhost:8000/api/profiles/edit/" + id, data)
      .then((res) => {
        commit(type.EDIT_LIST, { index, newList: data })
        return Promise.resolve()
      })
      .catch((err) => {
        return Promise.reject(err)
      })
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
