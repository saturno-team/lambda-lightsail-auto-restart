import AWS from 'aws-sdk';
import process from 'process';
import 'dotenv/config';

export const handler = async (event) => {
    const config = {
        apiVersion: 'latest',
        credentials: {
          accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
          secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
        },
        region: process.env['AWS_REGION'],
    };
    AWS.config.update(config);

    const lightsail = new AWS.Lightsail({ region: 'us-east-1' });
    const instanceName = "Typebotv2";

    try {
        console.log(`Stoping instance... ${instanceName}`);
        await lightsail.stopInstance({ instanceName }).promise();

        await waitForState(lightsail, instanceName, "stopped");

        console.log(`Start instance: ${instanceName}`);
        await lightsail.startInstance({ instanceName }).promise();
        console.log('OK');
        return { status: "OK", statusCode: 200 };
    } catch (error) {
        console.error("Error on restart: ", error);
        return { status: "Error", error, statusCode: 500 };
    }
};
async function waitForState(lightsail, instanceName, desiredState) {
    let currentState = "";
    while (currentState !== desiredState) {
        console.log(`Checking instance state...`);
        const { instance } = await lightsail.getInstance({ instanceName }).promise();
        currentState = instance.state.name;
        console.log(`Current state: ${currentState}`);
        
        if (currentState !== desiredState) {
            await new Promise(resolve => setTimeout(resolve, 5000)); 
        }
    }
}
handler();