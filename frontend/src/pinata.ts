import axios from 'axios';
import FormData from 'form-data';

const key = process.env.REACT_APP_PINATA_KEY;
const secret = process.env.REACT_APP_PINATA_SECRET;

interface UploadResult {
    success: boolean;
    pinataURL?: string;
    message?: string;
}

export const uploadJSONToIPFS = async (JSONBody: Object): Promise<UploadResult> => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

    try {
        const response = await axios.post(url, JSONBody, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${JSONBody}`,
                Authorization: secret
            }
        });

        console.log("metadata uploaded", response.data.IpfsHash);

        return {
            success: true,
            pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
        };
    } catch (error: any) {
        console.log("error uploading metadata")
        return {
            success: false,
            message: "error.message",
        };
    }
};

export const uploadFileToIPFS = async (file: File): Promise<UploadResult> => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    let data = new FormData();
    data.append('file', file);

    const metadata = JSON.stringify({
        name: 'testname',
        keyvalues: {
            exampleKey: 'exampleValue'
        }
    });
    data.append('pinataMetadata', metadata);

    const pinataOptions = JSON.stringify({
        cidVersion: 0,
        customPinPolicy: {
            regions: [
                {
                    id: 'FRA1',
                    desiredReplicationCount: 1
                },
                {
                    id: 'NYC1',
                    desiredReplicationCount: 2
                }
            ]
        }
    });
    data.append('pinataOptions', pinataOptions);

    try {
        const response = await axios.post(url, data, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        });

        console.log("image uploaded", response.data.IpfsHash);
        return {
            success: true,
            pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
        };
    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
};
