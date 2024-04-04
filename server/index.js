const express = require("express");
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const {toHex, utf8ToBytes} = require("ethereum-cryptography/utils");

const app = express();
const cors = require("cors");

const port = 5042;

app.use(cors());
app.use(express.json());


// Generated private keys for mapping the balances to each specific address
const balances = {
  "046fdbf7f546261c6a68dcb6b793a0f2ca0930ee65e0a4923d7cc481df4f6083afd09d8bb4688288e0fb368b4251682128f36615c41690c19dc0030045472fbabf": 100,
  "04b4fc054009dfd3950e426ef3cd103497c08b212d4209b74912ca83b24706e18d55985f9e9b155738db4e25bad53f078ac4629fd3c0151c370d341826b5846cc9": 50,
  "049b345fbc04efabc5b5a24843471d5915298d55c48793494a1a402c3d845123902cad347d95a9ae56a33a1d078b7781ca2767d70ae3c0a9e08488548671a910ef": 75,
};


app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { sender, recipient, amount, signature, recovery } = req.body;

  if (!signature) res.status(404).send({message: "signature was not provided"});
  if (!recovery) res.status(400).send({message: "recovery was not provided"});


  // On the node-server we hash the data and sign it using the keccak256()
  // we get the signature and recover the public key to verify if the private key
  // sent initially is the corresponding public key of the sender.
  try {
    const bytes = utf8ToBytes(JSON.stringify({sender, recipient, amount}));
    const hash = keccak256(bytes);

    const sig = new Uint8Array(signature);
    const publicKey = await secp.recoverPublicKey(hash, sig, recovery);

    if (toHex(publicKey) !== sender){
      res.status(400).send({ message: "signature not is valid!" })
    }

    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } catch (err){
    console.log(error.message);
  }

});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
