// Example: Form validation or interactivity for leave request forms

document.addEventListener('DOMContentLoaded', () => {
  const leaveForm = document.getElementById('leaveRequestForm');

  if (leaveForm) {
    leaveForm.addEventListener('submit', event => {
      const startDate = document.getElementById('start_date').value;
      const endDate = document.getElementById('end_date').value;

      if (new Date(startDate) > new Date(endDate)) {
        alert('End date must be after start date');
        event.preventDefault();
      }
    });
  }
});
