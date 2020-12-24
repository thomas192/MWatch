<template>
  <div class="container">
    <section class="draggable-container">
      <Vue2InteractDraggable
        @draggedDown="draggedDown"
        @draggedLeft="draggedLeft"
        @draggedRight="draggedRight"
        @draggedUp="draggedUp"
        :interact-max-rotation="15"
        :interact-out-of-sight-x-coordinate="500"
        :interact-x-threshold="200"
        :interact-event-bus-events="interactEventBusEvents"
        v-if="isShowing"
        class="card isCurrent"
      >
        <div><h3 class="cardTitle">Drag me!</h3></div>
      </Vue2InteractDraggable>
    </section>
    <section class="buttons">
      <BaseButton class="event-button" @click="dragLeft" label="⇦" />
      <BaseButton class="event-button" @click="dragDown" label="⇩" />
      <BaseButton class="event-button" @click="dragRight" label="⇨" />
      <BaseButton class="event-button" @click="dragUp" label="⇧" />
    </section>
  </div>
</template>

<script>
import BaseButton from "./components/BaseButton";
import { Vue2InteractDraggable, InteractEventBus } from "vue2-interact";

const INTERACT_DRAGGED_DOWN = "INTERACT_DRAGGED_DOWN";
const INTERACT_DRAGGED_LEFT = "INTERACT_DRAGGED_LEFT";
const INTERACT_DRAGGED_RIGHT = "INTERACT_DRAGGED_RIGHT";
const INTERACT_DRAGGED_UP = "INTERACT_DRAGGED_UP";

export default {
  components: {
    Vue2InteractDraggable,
    BaseButton
  },

  data() {
    return {
      isShowing: true,
      interactEventBusEvents: {
        draggedDown: INTERACT_DRAGGED_DOWN,
        draggedLeft: INTERACT_DRAGGED_LEFT,
        draggedRight: INTERACT_DRAGGED_RIGHT,
        draggedUp: INTERACT_DRAGGED_UP
      }
    };
  },

  methods: {
    draggedDown() {
      console.log("dragged down!");
      this.hideCard();
    },

    draggedLeft() {
      console.log("dragged left!");
      this.hideCard();
    },

    draggedRight() {
      console.log("dragged right!");
      this.hideCard();
    },

    draggedUp() {
      console.log("dragged up!");
      this.hideCard();
    },

    hideCard() {
      setTimeout(() => {
        this.isShowing = false;
      }, 200);
      setTimeout(() => {
        this.isShowing = true;
      }, 1000);
    },

    dragDown() {
      InteractEventBus.$emit(INTERACT_DRAGGED_DOWN);
    },

    dragLeft() {
      InteractEventBus.$emit(INTERACT_DRAGGED_LEFT);
    },

    dragRight() {
      InteractEventBus.$emit(INTERACT_DRAGGED_RIGHT);
    },

    dragUp() {
      InteractEventBus.$emit(INTERACT_DRAGGED_UP);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./styles/index.scss";

$cardsWidth: 200px;
$fs-card-title: 1.125em;

.container {
  margin-top: 100px;
}

.draggable-container {
  @include sizing(200px);

  display: flex;
  margin: auto auto 100px;
}

.switches {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  &__article {
    margin-right: 30px;
  }
}

.property-switch {
  margin-top: 5px;
}

.card {
  @include card();
  @include absolute(0);
  @include sizing(200px);
  @include flex-center();

  display: flex;
  max-height: 200px;
  margin: auto;
  font-size: $fs-h2;
  font-weight: $fw-bold;
  color: $c-white;
  background-image: url('https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg') ;
  background-size: 100% 100%;
  
  opacity: 1;
  transform-origin: 50%, 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  user-select: none;
  pointer-events: none;
  will-change: transform, opacity;

  height: 100vw;

  &.isCurrent {
    pointer-events: auto;
  }

  &.isAnimating {
    transition: transform 0.7s $ease-out-back;
  }
}

.cardTitle {
  margin: 0 0 15px;
  font-size: $fs-card-title;
}

.buttons {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

.event-button {
  margin: 0 20px;
}
</style>
