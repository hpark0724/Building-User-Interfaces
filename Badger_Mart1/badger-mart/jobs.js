function submitApplication(e) {
  e.preventDefault(); // You can ignore this; prevents the default form submission!

  // TODO: Alert the user of the job that they applied for!
  const radioJob = document.getElementsByName("job");
  let checkedJob = "";

  for (let job of radioJob) {
    if (job.checked) {
      checkedJob = job.value;
    }
  }

  if (checkedJob) {
    alert("Thank you for applying to be a " + checkedJob + "!");
  } else {
    alert("Please select a job!");
  }
}
