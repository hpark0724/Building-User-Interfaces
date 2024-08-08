const Student = (props) => {
  // return the string depending on whether they are from Wisconsin
  let fromWI = props.fromWisconsin ? "from Wisconsin" : "NOT from Wisconsin";
  return (
    <div>
      <h2>
        {props.name.first} {props.name.last}
      </h2>
      {/* display all of the information about a student (except for their ID)*/}
      <p>
        <strong>{props.major}</strong>
      </p>
      <p>
        {props.name.first} is taking {props.numCredits} credits and is {fromWI}
      </p>
      <p>They have {props.interests.length} interests including...</p>
      <ul>
        {props.interests.map((interest, index) => (
          <li key={index}>{interest}</li>
        ))}
      </ul>
    </div>
  );
};

export default Student;
