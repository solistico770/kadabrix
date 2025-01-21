let eventsArr = [];

/**
 * Publish an event to all subscribers.
 * Listeners are executed asynchronously in the order of their priority.
 * @param {string} event - The event name.
 * @param {any} args - Arguments to pass to the listeners.
 */
async function emit(event, args) {
  // Find all listeners for the given event name
  const eventListeners = eventsArr.filter(eventObj => eventObj.eventName === event);

  console.log(`Running event: "${event}" with ${eventListeners.length} listeners`);

  // Sort listeners by priority (highest priority first)
  eventListeners.sort((a, b) => b.priority - a.priority);

  // Array to hold all promises of async listeners
  const promises = eventListeners.map(listener => {
    try {
      // Call the listener and ensure async handling
      return listener.callback(args);
    } catch (error) {
      console.error(`Error in listener for event "${event}":`, error);
      return Promise.resolve(); // Return resolved promise to continue execution
    }
  });

  // Wait for all listeners to complete asynchronously
  await Promise.all(promises);
}

/**
 * Subscribe to an event with a callback.
 * Optionally, specify a priority for the listener.
 * @param {string} event - The event name.
 * @param {function} callback - The listener callback function.
 * @param {number} [priority=0] - The listener priority (higher values are executed first).
 */
function on(event, callback, priority = 0) {
  // Ensure priority is a valid number
  priority = Number(priority);

  // Add the listener to the events array
  eventsArr.push({
    eventName: event,
    priority,
    callback
  });
}

/**
 * Unsubscribe from an event by removing a listener.
 * @param {string} event - The event name.
 * @param {function} callback - The listener callback function to remove.
 */
function off(event, callback) {
  // Remove the specified listener for the event
  eventsArr = eventsArr.filter(eventObj => {
    return !(eventObj.eventName === event && eventObj.callback === callback);
  });
}

// Export the event bus as default
export default {
  emit,
  on,
  off
};
