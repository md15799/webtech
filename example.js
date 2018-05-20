// States and transitions from RFC 793
// var states = {
//   "CLOSED": {
//     description: "represents no connection state at all.",
//     style: "fill: #f77"
//   },
//
//   "LISTEN": {
//     description: "represents waiting for a connection request from any " +
//                  "remote TCP and port."
//   },
//
//   "SYN SENT": {
//     description: "represents waiting for a matching connection " +
//                  "request after having sent a connection request."
//   },
//
//   "SYN RCVD": {
//     description: "represents waiting for a confirming connection " +
//                  "request acknowledgment after having both received and sent a " +
//                  "connection request."
//   },
//
//
//   "ESTAB": {
//     description: "represents an open connection, data received " +
//                  "can be delivered to the user.  The normal state for the data " +
//                  "transfer phase of the connection.",
//     style: "fill: #7f7"
//   },
//
//   "FINWAIT-1": {
//     description: "represents waiting for a connection termination " +
//                  "request from the remote TCP, or an acknowledgment of the " +
//                  "connection termination request previously sent."
//
//   },
//
//   "FINWAIT-2": {
//     description: "represents waiting for a connection termination " +
//                  "request from the remote TCP."
//   },
//
//
//   "CLOSE WAIT": {
//     description: "represents waiting for a connection termination " +
//                  "request from the local user."
//   },
//
//   "CLOSING": {
//     description: "represents waiting for a connection termination " +
//                  "request acknowledgment from the remote TCP."
//   },
//
//   "LAST-ACK": {
//     description: "represents waiting for an acknowledgment of the " +
//                  "connection termination request previously sent to the remote " +
//                  "TCP (which includes an acknowledgment of its connection " +
//                  "termination request)."
//   },
//
//   "TIME WAIT": {
//     description: "represents waiting for enough time to pass to be " +
//                  "sure the remote TCP received the acknowledgment of its " +
//                  "connection termination request."
//   }
// };
