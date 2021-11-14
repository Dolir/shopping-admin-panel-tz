<template>
  <div class="main">
    <div class="session-selector">
      <h4 class="text-left">Сессия</h4>
      <va-select v-model="selectedSession" :options="sessionNames" searchable />
    </div>

    <div v-if="selectedSession.text" class="session-block">
      <div class="session-block-header">
        <h4>
          Время: {{ formatDate(selectedSession.value.enter) }} -
          {{ formatDate(selectedSession.value.exit) }}
        </h4>
        <va-icon v-if="selectedSession.value.submitted" name="done_outline" color="#00FF00" class="mr-2"/>
      </div>
      <ul>
        <li
          v-for="product in selectedSession.value.products"
          v-bind:key="product.sessionId"
        >
          <Item v-bind:data="product" @incrementItem="incrementItem"
          @decrementItem="decrementItem"
          @deleteItem="deleteItem"
          v-bind:submitted="selectedSession.value.submitted"/>
          <va-divider />
        </li>
      </ul>
      <div class="action-buttons" v-if="!selectedSession.value.submitted">
        <va-button :rounded="false" outline @click="showModal = !showModal"
          >Добавить продукт</va-button
        >
        <va-modal v-model="showModal" hide-default-actions>
          <template #header>
            <h2 class="mb-4">Добавить продукт</h2>
          </template>
          <va-form>
            <va-input
              class="mb-4"
              label="Название продукта"
              v-model="itemToAdd.name"
              :rules="[
                (value) => (value && value.length > 0) || 'Поле обязательное!'
              ]"
            />
            <va-input
              label="Количество"
              type="number"
              v-model="itemToAdd.quantity"
              :rules="[
                (value) => (value && value.length > 0) || 'Поле обязательное!',
                (value) => value > 0 || 'Число должно быть положительным'
              ]"
            />
          </va-form>
          <template #footer>
            <va-button
              class="mr-1"
              :rounded="false"
              outline
              @click="showModal = !showModal"
              >Отмена</va-button
            >
            <va-button
              class="ml-1"
              :rounded="false"
              @click="
                itemToAdd.quantity && itemToAdd.name
                  ? (addItem({
                      sessionId: selectedSession.value.sessionId,
                      ...itemToAdd
                    }),
                    (showModal = !showModal),
                    (itemToAdd = {})
                   )
                  : ''
              "
              >Добавить</va-button
            >
          </template>
        </va-modal>

        <va-button :rounded="false" @click="submitSession(selectedSession.value)">Сохранить</va-button>
      </div>
    </div>
  </div>
</template>

<script>
import Item from "./components/Item.vue"
import { mapMutations, mapState } from "vuex"
import { trunstileEvents, events } from "./data"

export default {
  name: "App",
  data() {
    return {
      selectedSession: {
        text:"",
        value:{}
      },
      itemToAdd: {},
      showModal: false
    }
  },
  computed: {
    ...mapState(["sessions"]),
    sessionNames: (state) => {
      return state.sessions.map((session) => ({
        text: session.sessionId,
        value: session
      }))
    }
  },
  methods: {
    ...mapMutations(["addSessions", "addItems", "addItem", "incrementItem", "decrementItem","deleteItem","submitSession"]),
    formatDate: (number) => {
      return new Date(number * 1000).toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      })
    },
    
  },
  mounted() {
    this.addSessions(trunstileEvents)
    this.addItems(events)
  },
  components: {
    Item
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.main {
  max-width: 750px;
  margin: 0 auto;
}
.session-selector {
  margin: 0 5%;
}
.session-block {
  margin: 0 5%;
  padding: 10px;
  text-align: left;
  margin-top: 40px;
  border-radius: 5px;
  box-shadow: 0 0px 2px 1px rgb(216, 216, 216);
}
.session-block-header {
  border-bottom: 1px rgb(90, 90, 90) solid;
  margin-bottom: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
.action-buttons {
  display: flex;
  justify-content: space-around;
}
</style>
