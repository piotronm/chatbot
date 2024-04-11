// import React from "react";

// const BackupResponse = ({ data }) => {
//   return (
//     <div>
//       <h2>Backup API Response</h2>
//       <ul>
//         {data.map((item) => (
//           <li key={item.id}>
//             {item.first_name} {item.last_name} - {item.email}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default BackupResponse;

// To be added to Chatbot.jsx

// .catch(() => {
//     setError(
//       "Both primary and backup API requests failed. Please try again later."
//     );
//   });

// {response && response.error ? (
//   <p>{response.error}</p>
// ) : (
//   <p>
//     {Array.isArray(response) ? (
//       <BackupResponse data={response} />
//     ) : (
//       response
//     )}
//   </p>
// )}
