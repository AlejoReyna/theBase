import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

import { useActiveAccount } from "thirdweb/react";

import { useRouter, useSearchParams } from 'next/navigation';
import Image from "next/image";
//import { useRouter } from 'next/router';
import { createThirdwebClient, getContract, resolveMethod, ThirdwebContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";
import { ConnectButton, ThirdwebProvider, TransactionButton } from "thirdweb/react";
import { readContract } from "thirdweb";

export const client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

export const contract = getContract({
    client,
    chain: defineChain(84532),
    address: "0xDa69fDb6F12031620ec53120B6CB47D703647792"
});

interface PaymentComponentProps {
    guid: string;
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({ guid }) => {

    console.log("guid: ", guid);

    let paymentData: any = null;

    const router = useRouter();

    const handleHome = () => {
        router.push('/home'); // Redirects to Homepage.tsx
    }

    const [paymentTitle, setPaymentTitle] = useState("");
    const [paymentDescription, setPaymentDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [receiverAddress, setReceiverAddress] = useState("");
    const [isPaid, setIsPaid] = useState(false);

    async function getPaymentDetails(guid: string) {
        const data = await readContract({ 
            contract, 
            method: "function getPaymentDetails(string guid) view returns (uint256, string, string, string, address, bool)", 
            params: [guid] 
        })

        paymentData = data;

        console.log("data: ", data);
        setAmount(data[0].toString());
        setPaymentTitle(data[1]);
        setPaymentDescription(data[2]);
        setReceiverAddress(data[4]);
        setIsPaid(data[5]);

        console.log("amount: ", amount);
        console.log("paymentTitle: ", paymentTitle);
        console.log("paymentDescription: ", paymentDescription);
        console.log("receiverAddress: ", receiverAddress);
        console.log("isPaid: ", isPaid);
    }

    if (paymentData == null) {
        getPaymentDetails(guid);
    }


    return (
        <div className='container-fluid bg-black h-screen'>
            {/* First row */}
            <div className='flex flex-col'>
                <div className="w-full flex justify-between p-4">
                    <div className='btn-container justify-start m-4'>
                        <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-[12px] shadow actor-font"
                            onClick={handleHome}> Back </button>
                    </div>
                    <div className='justify-end m-4'>
                        <ConnectButton client={client} />
                    </div>
                </div>


                <div className="w-1/2 ml-4">
                    <h6 className='text-white text-3xl'> BirdlyPay </h6>
                </div>
            </div>
            <p className='text-white ml-8 mt-8'> Payment title </p>

            {/** Here must go the payment title */}
            <div className="flex justify-center mx-8 mt-4 p-4 bg-white rounded-xl ">
                <p > {paymentTitle} </p>
            </div>
            {/** End of payment title input */}

            <div className="flex justify-center items-center mx-8 mt-4 py-2 px-4 bg-white rounded-xl">
                <div className="flex justify-between items-center ">
                    <Image src={"/eth.png"} alt="Birdlypay"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: 'auto', height: '50px', margin: '5px' }}
                    />
                    <h6 className='font-bold align-middle'> Payment in ETH </h6>
                </div>

            </div>

            <p className='text-white ml-8 mt-8'> Amount </p>

            <div className="flex mx-8 mt-4 p-4 justify-center bg-white rounded-xl">
                <p> ${amount} USD </p>
            </div>

            <p className='text-white ml-8 mt-8'> Description </p>
            <div className="flex justify-center mx-8 mt-4 p-1 bg-white rounded-xl">
                <input
                style={{ width: '100%', outline: 'none' }}
                value={paymentDescription}
                placeholder="Payment description"
                className='p-2'
                readOnly
                />
            </div>

            <div className="w-full flex justify-center my-8">
                <button className="bg-[#24F129] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl"
                >
                    Pay!
                </button>
            </div>

        </div>
    );
};

export default PaymentComponent;