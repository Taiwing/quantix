import {
    Connection,
    Keypair,
    sendAndConfirmTransaction,
    Transaction,
    TransactionInstruction,
} from '@solana/web3.js';

import fs from 'fs';

function createKeypairFromFile(path) {
    return Keypair.fromSecretKey(
        Buffer.from(JSON.parse(fs.readFileSync(path, "utf-8")))
    )
};

// Loading these from local files for development (TODO: move to environment variables)
const connection = new Connection(`http://localhost:8899`, 'confirmed');
const payer = createKeypairFromFile('../local.json');
const program = createKeypairFromFile('../quantum/target/deploy/quantum-keypair.json');

// We set up our instruction first.
let ix = new TransactionInstruction({
    keys: [
        {pubkey: payer.publicKey, isSigner: true, isWritable: true}
    ],
    programId: program.publicKey,
    data: Buffer.alloc(0), // No data
});

// Now we send the transaction over RPC
let transationSignature = await sendAndConfirmTransaction(
    connection,
    new Transaction().add(ix), // Add our instruction (you can add more than one)
    [payer]
);

// And finally we can check if it worked
console.log({ transationSignature });
