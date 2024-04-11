// import React, { useState } from "react";

// const Form = ({ onSubmit }) => {
//   const [query, setQuery] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault(); // Prevent default form submission behavior
//     if (!query.trim()) {
//       // If the query is empty or contains only whitespace, return without submitting
//       return;
//     }
//     onSubmit(query.trim()); // Trim whitespace from the query and pass it to onSubmit
//     setQuery(""); // Clear the query after submission
//   };

//   const handleChange = (e) => {
//     setQuery(e.target.value); // Update the query state as the user types
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         value={query}
//         onChange={handleChange}
//         placeholder="Enter your question or query"
//       />
//       <button type="submit">Submit</button>
//     </form>
//   );
// };

// export default Form;
