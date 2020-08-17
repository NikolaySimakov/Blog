import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '@/firebase'
import router from '@/router/index'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userProfile: {},
    posts: [],
    recentlySearched: []
  },
  getters: {
    recentlySearched: (state) => {
      return state.recentlySearched.reverse()
    }
  },
  mutations: {
    setUserProfile(state, profile) {
      state.userProfile = profile
    },
    setRecentlySearched(state, user) {
      let notInArray = (obj, list) => {
        let x;
        for (x in list) {
          if (list[x].name === obj.name && list[x].url === obj.url) return false;
        }
        return true;
      }
      if (notInArray(user, state.recentlySearched)) state.recentlySearched.push(user)
    },
    editPost(state, edit) {
      for (let post of state.posts) {
        if (post.docId === edit.docId) {
          post.title = edit.values.title
          post.body = edit.values.body
        }
      }
    },
    setPosts(state, posts) {
      state.posts = posts
    },
    addPost(state, doc) {
      state.posts.push(doc)
    },
    deletePost(state, docId) {
      state.posts.splice(state.posts.findIndex(i => {
        return i.docId === docId;
      }), 1);
    }
  },
  actions: {
    async signin({
      dispatch
    }, form) {
      const {
        user
      } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)
      dispatch('fetchUserProfile', user)
    },
    async signup({
      dispatch
    }, form) {
      let errorMessage = ''
      await fb.auth.createUserWithEmailAndPassword(form.email, form.password)
        .then(snapshot => {
          const data = {
            name: form.name,
            email: form.email,
            imageURL: form.imageURL
          }
          fb.users.doc(snapshot.user.uid).set(data)
          dispatch('fetchUserProfile', snapshot.user)
        })
        .catch(error => {
          errorMessage = error.message
        })
      return errorMessage
    },
    async fetchUserProfile({
      commit
    }, user) {
      const userProfile = await fb.users.doc(user.uid).get()
      commit('setUserProfile', userProfile.data())
      if (['/signup', '/signin'].includes(router.currentRoute.path)) router.push('/')
    },
    async logout({
      commit
    }) {
      await fb.auth.signOut()
      commit('setUserProfile', {})
      router.push('/signin')
    },
    async recentlySearchedUsers({
      commit
    }, userData) {
      commit('setRecentlySearched', userData)
    },
    async addPost({
      commit
    }, post) {
      const doc = await fb.posts.add(post)
      commit('addPost', Object.assign(post, {
        docId: doc.id
      }))
    },
    async getPosts({
      commit
    }, id) {
      fb.posts.where('userId', '==', id).get().then(querySnapshot => {
        const arr = []
        querySnapshot.forEach(doc => {
          arr.push(Object.assign(doc.data(), {
            docId: doc.id
          }))
        })
        commit('setPosts', arr)
      })
    },
    async editPost({
      commit
    }, edit) {
      const ref = fb.posts.doc(edit.docId);
      await ref.update(edit.values);
      commit('editPost', edit);
    },
    async deletePost({
      commit
    }, doc) {
      console.log(doc)
      fb.posts.doc(doc).delete().then(() => {
        console.log("Document successfully deleted!");
      }).catch(error => {
        console.error("Error removing document: ", error);
      });
      commit('deletePost', doc)
    }
  }
})

export default store