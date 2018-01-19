class Entity {
    constructor(id) {
        this.id = id;
        this.type = null;
        this.states = [];
    }

    addState(state) {
        this.states.push(state);
    }

    lerp(prev, next, value) {
        return prev + value * (next - prev);
    }
}