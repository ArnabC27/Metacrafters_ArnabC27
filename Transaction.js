// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} = require("@solana/web3.js");


// Making a keypair and getting the private key
const newPair = Keypair.generate();
console.log(newPair);

// paste your secret that is logged here
const DEMO_FROM_SECRET_KEY = new Uint8Array(
  // paste your secret key array here
    [
        223, 172, 191,  99, 204,  76, 147, 242,  30, 240, 186,
        205, 128, 239,  76,  51, 147, 226, 173,  16, 233,  19,
        8, 133,  90, 107, 215, 159,  55, 239,  89,  86,  69,
        64, 145, 157, 224,  84, 178,   4, 244,  72, 234, 156,
        255, 250,   6, 207, 112, 202, 140,  32, 176, 165, 243,
        70, 144, 203, 158, 198,  76, 176, 254, 174
      ]            
);

const transferSol = async() => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Get Keypair from Secret Key
    var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);
    var fromWalletBalance = await connection.getBalance(from.publicKey);
    // Other things to try: 
    // 1) Form array from userSecretKey
    // const from = Keypair.fromSecretKey(Uint8Array.from(userSecretKey));
    // 2) Make a new Keypair (starts with 0 SOL)
    // const from = Keypair.generate();

    // Generate another Keypair (account we'll be sending to)
    const to = Keypair.generate();
    var toWalletBalance = await connection.getBalance(to.publicKey);
    // Aidrop 2 SOL to Sender wallet
    console.log(`from Wallet Balance : ${parseInt(fromWalletBalance) / LAMPORTS_PER_SOL} SOL`);
    console.log(`to Wallet Balance : ${parseInt(toWalletBalance) / LAMPORTS_PER_SOL} SOL`);
    console.log("Airdopping some SOL to Sender wallet!");
    const fromAirDropSignature = await connection.requestAirdrop(
        new PublicKey(from.publicKey),
        2 * LAMPORTS_PER_SOL
    );

    // Latest blockhash (unique identifer of the block) of the cluster
    let latestBlockHash = await connection.getLatestBlockhash();

    // Confirm transaction using the last valid block height (refers to its time)
    // to check for transaction expiration
    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: fromAirDropSignature
    });

    console.log("Airdrop completed for the Sender account");
    fromWalletBalance = await connection.getBalance(from.publicKey);
    toWalletBalance = await connection.getBalance(to.publicKey);
    console.log(`from Wallet Balance : ${parseInt(fromWalletBalance) / LAMPORTS_PER_SOL} SOL`);
    console.log(`to Wallet Balance : ${parseInt(toWalletBalance) / LAMPORTS_PER_SOL} SOL`);
    // Send money from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: LAMPORTS_PER_SOL / 100
        })
    );

    // Sign transaction
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );
    
    console.log('Signature is', signature);

    fromWalletBalance = await connection.getBalance(from.publicKey);
    toWalletBalance = await connection.getBalance(to.publicKey);
    console.log(`from Wallet Balance : ${parseInt(fromWalletBalance) / LAMPORTS_PER_SOL} SOL`);
    console.log(`to Wallet Balance : ${parseInt(toWalletBalance) / LAMPORTS_PER_SOL} SOL`);
}

transferSol();