// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const ChatSection = ({ showChatSection }) => {
//   const [data, setData] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (showChatSection) {
//       axios
//         .get("/data.json") // Assuming data.json is in the public folder
//         .then((response) => {
//           setData(response.data);
//         })
//         .catch((error) => {
//           console.error("Error fetching data:", error);
//           setError(
//             "An unexpected error occurred while fetching data. Please try again later."
//           );
//         });
//     }
//   }, [showChatSection]);

//   return (
//     <div className="chat-section">
//       {showChatSection && (
//         <>
//           {error && <p className="error">{error}</p>}
//           <ul>
//             {data.map((item) => (
//               <li key={item.id}>
//                 <div>
//                   <strong>Name:</strong> {item.first_name} {item.last_name}
//                 </div>
//                 <div>
//                   <strong>Email:</strong> {item.email}
//                 </div>
//                 <div>
//                   <strong>Gender:</strong> {item.gender}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </>
//       )}
//     </div>
//   );
// };

// export default ChatSection;
