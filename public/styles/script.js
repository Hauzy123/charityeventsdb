document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/events')
    .then(res => res.json())
    .then(events => {
      const container = document.getElementById('events');

      if (events.length === 0) {
        container.innerHTML = `<p>No events found. Check back soon!</p>`;
        return;
      }

      events.forEach(event => {
        const div = document.createElement('div');
        div.innerHTML = `
          <h3>${event.event_name}</h3>
          <p>${event.short_description}</p>
          <p><strong>Start:</strong> ${new Date(event.start_time).toLocaleString()}</p>
          <p><strong>Category:</strong> ${event.category}</p>
          <a href="eventdetails.html?id=${event.event_id}">View Details</a>
        `;
        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error("Failed to load events:", err);
      document.getElementById('events').innerHTML = `<p>Error loading events. Please try again later.</p>`;
    });
});
