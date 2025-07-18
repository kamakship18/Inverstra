export const contractABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "FormSubmitted",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "getForm",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getUserFormCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "community",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "category",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "asset",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "predictionType",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "targetPrice",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "deadline",
                "type": "string"
            },
            {
                "internalType": "uint8",
                "name": "confidence",
                "type": "uint8"
            },
            {
                "internalType": "string",
                "name": "reasoning",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "confirmed",
                "type": "bool"
            }
        ],
        "name": "submitForm",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "userForms",
        "outputs": [
            {
                "internalType": "string",
                "name": "community",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "category",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "asset",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "predictionType",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "targetPrice",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "deadline",
                "type": "string"
            },
            {
                "internalType": "uint8",
                "name": "confidence",
                "type": "uint8"
            },
            {
                "internalType": "string",
                "name": "reasoning",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "confirmed",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];


// [
//     {
//       "anonymous": false,
//       "inputs": [
//         { "indexed": false, "internalType": "string", "name": "tip", "type": "string" },
//         { "indexed": false, "internalType": "string", "name": "risk", "type": "string" },
//         { "indexed": false, "internalType": "string", "name": "source", "type": "string" },
//         { "indexed": false, "internalType": "uint256", "name": "votes", "type": "uint256" },
//         { "indexed": false, "internalType": "uint256", "name": "communityAccuracy", "type": "uint256" }
//       ],
//       "name": "PredictionSubmitted",
//       "type": "event"
//     },
//     {
//       "inputs": [],
//       "name": "getAllPredictions",
//       "outputs": [
//         {
//           "components": [
//             { "internalType": "string", "name": "tip", "type": "string" },
//             { "internalType": "string", "name": "risk", "type": "string" },
//             { "internalType": "string", "name": "source", "type": "string" },
//             { "internalType": "uint256", "name": "votes", "type": "uint256" },
//             { "internalType": "uint256", "name": "communityAccuracy", "type": "uint256" }
//           ],
//           "internalType": "struct PredictionContract.Prediction[]",
//           "name": "",
//           "type": "tuple[]"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         { "internalType": "string", "name": "_tip", "type": "string" },
//         { "internalType": "string", "name": "_source", "type": "string" },
//         { "internalType": "string", "name": "_risk", "type": "string" },
//         { "internalType": "uint256", "name": "_votes", "type": "uint256" },
//         { "internalType": "uint256", "name": "_communityAccuracy", "type": "uint256" }
//       ],
//       "name": "submitPrediction",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     }
//   ];