//events - a super-basic Javascript (publish subscribe) pattern

let events = {
  events: {},
  // on
  subscribe: function (eventName, fn) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  },
  // off
  // remove: function (eventName, fn) {
  //   if (this.events[eventName]) {
  //     for (var i = 0; i < this.events[eventName].length; i++) {
  //       if (this.events[eventName][i] === fn) {
  //         this.events[eventName].splice(i, 1);
  //         break;
  //       }
  //     }
  //   }
  // },
  remove: function (eventName) {
    if (this.events[eventName]) {
      for (var i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i]) {
          this.events[eventName].splice(i, 1);
          break;
        }
      }
    }
  },
  // emit
  publish: function (eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function (fn) {
        fn(data);
      });
    }
  },
};

export default events;

// events.subscribe('log', () => console.log(data)))
/* 
  events = {
      // eventName: [handler] 
      log: [() => console.log(data)] 
  }
  */

// events.publish('log', 'published!')

// runs each handler with given data for a given eventName

// So, when a module publishes an event, it runs handlers (functions) of a module that subscribes to it.
