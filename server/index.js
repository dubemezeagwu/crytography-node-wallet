const express = require("express");
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const {toHex, utf8ToBytes} = require("ethereum-cryptography/utils");

const app = express();
const cors = require("cors");

const port = 5042;

app.use(cors());
app.use(express.json());

const balances = {
  "0311cf2bcae5b41a6cb5579ea997a4753f2cac6073cfbb49214030312300bc2ba9": 100,
  "03cafcddd7bec7895a5d620c4ec180b0436df1f6f1da92cbc981f71aa815cbc5b7": 50,
  "02275cd0285e18d9cd0e2966af5cd26b4e276263009a00f94f37baced9e9e0aaa5": 75,
};

// const balances = {
//   "0xa": 100,
//   "0xb": 50,
//   "0xc": 75,
// };

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { sender, recipient, amount, signature, recovery } = req.body;

  if (!signature) res.status(404).send({message: "signature dont was provide"});
  if (!recovery) res.status(400).send({message: "recovery dont was provide"});

  try {
    const bytes = utf8ToBytes(JSON.stringify({sender, recipient, amount}));
    const hash = keccak256(bytes);

    const sig = new Uint8Array(signature);
    const publicKey = await secp.recoverPublicKey(hash, sig, recovery);

    if (toHex(publicKey) !== sender){
      res.status(400).send({ message: "signature no is valid!" })
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
