function buildStudents(studs) {
  // TODO This function is just a suggestion! I would suggest calling it after
  //      fetching the data or performing a search. It should populate the
  //      index.html with student data by using createElement and appendChild.
  const studentRow = document.getElementById("students");

  // use innerHTML to clear the data
  studentRow.innerHTML = "";

  // loop through the student objects
  studs.forEach((student) => {
    // initialize div element that contains student's information
    const studDiv = document.createElement("div");
    studDiv.className =
      "col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 student-info";

    // initialize h2 element for student's name
    const name = (document = document.createElement("h2"));
    // assign the content of the name as student's full name
    name.textContent = student.name.first + " " + student.name.last;
    // append the name to the student div element
    studDiv.appendChild(name);

    // initialize h6 element for student's major
    const major = document.createElement("h6");
    // assign the content of the h6 element as student's major
    major.textContent = student.major;
    // append the major to student div element
    studDiv.appendChild(major);

    // assign string to the variable depending on
    // whether the student is from or not from Wisconsin
    let fromWI = student.fromWisconsin
      ? "from Wisconsin"
      : "not from Wisconsin";

    // initialize a paragraph element for student's information
    const info = document.createElement("p");
    // assign the content of student information to the
    // paragraph element
    info.textContent =
      student.name.first +
      " is taking " +
      student.numCredits +
      " credits and is " +
      fromWI;
    // append information to the student div element
    studDiv.appendChild(info);

    // initialize a paragraph element for student's information
    const interests = document.createElement("p");
    // assign the content of student interest to the
    // paragraph element
    interests.textContent =
      "They have " + student.interests.length + " interests including...";
    // append information to the student div element
    studDiv.appendChild(interests);

    // initialize an list of student's interests detail
    const listInterests = document.createElement("ul");
    // loop through student's interests and append the item
    // for each
    student.interests.forEach((interest) => {
      const element = document.createElement("li");
      element.textContent = interest;
      listInterests.appendChild(element);
    });

    // append interest to the student div element
    studDiv.appendChild(listInterests);
    // append student div to the row container
    studentRow.appendChild(studDiv);
  });
}

// function to handle the search
function handleSearch(e) {
  e?.preventDefault(); // You can ignore this; prevents the default form submission!

  // retrieve user input for search and use trim and toLowerCase method
  // for comparison
  const nameSearch = document
    .getElementById("search-name")
    .value.trim()
    .toLowerCase();
  const majorSearch = document
    .getElementById("search-major")
    .value.trim()
    .toLowerCase();
  const interestSearch = document
    .getElementById("search-interest")
    .value.trim()
    .toLowerCase();

  // filter students information based on user input
  const studentfiltered = studentInfo.filter((student) => {
    const name = (student.name.first + " " + student.name.last)
      .trim()
      .replace(/\s+/g, "")
      .toLowerCase();
    const major = student.major.toLowerCase();
    const interest = student.interests.map((interest) =>
      interest.toLowerCase()
    );

    // compare student input and its existing information
    return (
      (!nameSearch || name.includes(nameSearch)) &&
      (!majorSearch || major.includes(majorSearch)) &&
      (!interestSearch ||
        interest.some((interest) => interest.includes(interestSearch)))
    );
  });

  // update number of search with the searched student data length
  document.getElementById("num-results").innerText = studentfiltered.length;
  buildStudents(studentfiltered);
}

let studentInfo = [];

// fetch student information from the url
fetch("https://cs571.org/api/s24/hw2/students", {
  method: "GET",
  headers: {
    "X-CS571-ID":
      "bid_48398bcaa022a10b0f89f319621d249c62e4440da176996a65620ce44ce42d82",
  },
})
  .then((res) => res.json())
  .then((studs) => {
    // assign student information to studentInfo array
    studentInfo = studs;
    // display the student information
    console.log(studs);
    // display the number of students in the fetched student information
    document.getElementById("num-results").innerText = studs.length;
    buildStudents(studs);
  })
  .catch((err) => {
    console.error(err);
  });

document.getElementById("search-btn").addEventListener("click", handleSearch);
