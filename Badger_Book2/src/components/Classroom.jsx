import { Button, Container, Form, Row, Col, Pagination } from "react-bootstrap";
import { useEffect, useState } from "react";
import Student from "./Student";

const Classroom = () => {
  // State variable for storing student data
  const [students, setStudents] = useState([]);
  // State variable for storing the student data that are searched
  const [shownStudents, setShownStudents] = useState([]);
  // State variable for storing the student name
  const [nameSearch, setNameSearch] = useState("");
  // State variable for storing the student major
  const [majorSearch, setMajorSearch] = useState("");
  // State variable for storing the student interest
  const [interestSearch, setInterestSearch] = useState("");
  // State variable for storing the page number
  const [activePage, setActivePage] = useState(1);
  // use useEffect hook to fetch the data
  useEffect(() => {
    fetch("https://cs571.org/api/s24/hw4/students", {
      // header 'X-CS571-ID' specifying Badger ID for making HTTP request
      headers: {
        "X-CS571-ID": CS571.getBadgerId(),
      },
    })
      .then((res) => {
        console.log(res.status);
        return res.json();
      })
      .then((data) => {
        setStudents(data);
        setShownStudents(data);
        console.log(data); // console.log the contents of the array
      });
  }, []);

  useEffect(() => {
    function handleSearch(student) {
      // initialize variables to store the student information
      // if undefined store empty string
      const firstName = student.name.first || "";
      const lastName = student.name.last || "";
      const major = student.major || "";
      const interest = student.interest || "";

      // initialize variable to store student's full name
      const studentName = (
        firstName.toLowerCase() +
        " " +
        lastName.toLowerCase()
      ).trim();
      // true if the student name includes the name user has searched,
      // or the search term is empty
      const nameMatch =
        studentName.includes(nameSearch.trim().toLowerCase()) ||
        nameSearch.trim() === "";
      // true if the student major includes the major user has searched,
      // or the search term is empty
      const majorMatch =
        major.toLowerCase().includes(majorSearch.trim().toLowerCase()) ||
        majorSearch.trim() === "";
      // true if the student interest includes the interest user has searched,
      // or the search term is empty
      const interestMatch =
        student.interests.some((interest) =>
          interest.toLowerCase().includes(interestSearch.trim().toLowerCase())
        ) || interestSearch.trim() === "";

      return nameMatch && majorMatch && interestMatch;
    }

    // filter the student information that matches the search term
    const studentFiltered = students.filter((student) => handleSearch(student));

    // update the list of students that are searched
    setShownStudents(studentFiltered);
    // set the default page to 1
    setActivePage(1);
  }, [nameSearch, majorSearch, interestSearch, students]);

  const buildPaginator = () => {
    const pages = [];
    const resultPerPage = 24;
    const pageNum = Math.ceil(shownStudents.length / resultPerPage);

    // set previous button
    pages.push(
      <Pagination.Prev
        key="previous"
        // button disabled when the user is on the first page or there are not result
        disabled={activePage === 1 || shownStudents.length === 0}
        onClick={() => setActivePage((prevPage) => Math.max(1, prevPage - 1))}
      />
    );

    for (let i = 1; i <= pageNum; i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={activePage === i}
          onClick={() => setActivePage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    // set next button
    pages.push(
      <Pagination.Next
        key="next"
        // button disabled when the user is on the first page or there are not result
        disabled={activePage === pageNum || shownStudents.length === 0}
        onClick={() =>
          setActivePage((nextPage) => Math.min(pageNum - 1, nextPage + 1))
        }
      />
    );
    return pages;
  };

  // reset search terms
  const reset = () => {
    setNameSearch(""); // clear name search
    setMajorSearch(""); // clear major search
    setInterestSearch(""); // clear interest search
    setShownStudents(students); // reset searched students and display all students
    setActivePage(1); // set the page to 1
  };

  return (
    <div>
      <h1>Badger Book</h1>
      <p>Search for students below!</p>
      <hr />
      <Form>
        <Form.Label htmlFor="searchName">Name</Form.Label>
        <Form.Control
          id="searchName"
          // input name value
          value={nameSearch}
          // update nameSearch state variable to the user name input
          onChange={(e) => setNameSearch(e.target.value)}
        />
        <Form.Label htmlFor="searchMajor">Major</Form.Label>
        <Form.Control
          id="searchMajor"
          // input major value
          value={majorSearch}
          // update majorSearch state variable to the user major input
          onChange={(e) => setMajorSearch(e.target.value)}
        />
        <Form.Label htmlFor="searchInterest">Interest</Form.Label>
        <Form.Control
          id="searchInterest"
          // input interest search
          value={interestSearch}
          // update interestSearch state variable to the user interest input
          onChange={(e) => setInterestSearch(e.target.value)}
        />
        <br />
        <Button variant="neutral" onClick={reset}>
          Reset Search
        </Button>
      </Form>
      <p>There are {shownStudents.length} student(s) matching your search</p>
      <Container fluid>
        <Row>
          {/* display the student's data using the 'Student' component */}
          {shownStudents
            .slice(24 * (activePage - 1), 24 * activePage)
            .map((student) => (
              <Col xs={12} sm={12} md={6} lg={4} xl={3} key={student.id}>
                <Student {...student} />
              </Col>
            ))}
        </Row>
      </Container>
      <Pagination>{buildPaginator()}</Pagination>
    </div>
  );
};

export default Classroom;
