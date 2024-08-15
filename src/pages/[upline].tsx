import { useEffect, useContext } from "react";
import { Navigate, useParams } from "react-router-dom";
import { decodeBase64 } from "../hooks/getDetails";
import { ethers } from "ethers";
import { RefContext } from "../contexts/referralContext";

// const sendReferral = (referrer: string) => {
//   // Ensure that gtag is available on the window object
//   if (window.gtag) {
//     // Send an event to Google Analytics
//     window.gtag("event", "referral", {
//       event_category: "Referral",
//       event_label: referrer,
//       transport_type: "beacon",
//       // Include 'non_interaction' parameter so this event would not affect bounce rate
//       non_interaction: true,
//     });
//   } else {
//     console.error(
//       "gtag is not defined. Make sure Google Analytics is properly set up."
//     );
//   }
// };

const Upline = () => {
  const context = useContext(RefContext);
  const { state, dispatch } = context || {};

  const { upline: uplineAddressFromParams } = useParams();
  const decodedUplineAddress = decodeBase64(String(uplineAddressFromParams));

  useEffect(() => {
    const fetchAddressFromParams = async () => {
      console.log("decodedUplineAddress", decodedUplineAddress);

      uplineAddressFromParams &&
        ethers.isAddress(decodedUplineAddress) &&
        dispatch({
          type: "UPDATE_KEY",
          key: "upline",
          value: `${decodedUplineAddress}`,
        });
    };

    // // Only send the referral if it's a new upline address
    // if (uplineAddressFromParams && decodedUplineAddress !== state.upline) {
    //   sendReferral(decodedUplineAddress);
    // }

    fetchAddressFromParams();
  }, [state.upline, decodedUplineAddress, dispatch]);

  // Logic for redirect
  // if (decodedUplineAddress === state.upline) {
  //   return (
  //     <Navigate
  //       to={`/?utm_source=referral&utm_medium=social&utm_campaign=${decodedUplineAddress}`}
  //       replace={true}
  //     />
  //   );
  // }

  // return <Navigate to="/swap" replace={true} />;

  // Logic for redirect with SEO component included
  return (
    <>
      <Navigate
        to={
          uplineAddressFromParams
            ? `/?utm_source=referral&utm_medium=social&utm_campaign=${decodedUplineAddress}`
            : "/"
        }
        replace={true}
      />
    </>
  );
};

export default Upline;

// useEffect(() => {
//     const interval = setInterval(() => {
//         const sessionValues = extractSessionValues('refContextState');
//         if (sessionValues) {
//             // console.log(sessionValues)
//             console.log(formatTime(sessionValues.remainingTime, TimeFormat.COUNTDOWN));
//         } else {
//             clearInterval(interval);
//         }
//     }, 1000); // Update every second

//     return () => clearInterval(interval);
// }, []);
