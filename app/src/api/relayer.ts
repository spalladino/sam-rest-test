import { API } from 'aws-amplify';

const tenantId = 'DEFAULT_TENANT';

// quick and dirty random id generation
function getRandomId(): string {
  return Math.random().toString(16).substr(2);
}

export interface Relayer {
  name: string;
  relayerId: string;
  tenantId: string;
}

export async function createRelayer(name: string) : Promise<string> { 
  const apiName = 'RelayerApi';
  const path = 'relayers';
  const relayerId = getRandomId();
  const relayer =  {
    relayerId,
    name,
    tenantId: "DEFAULT_TENANT"
  }
  try {
    // Try with fetch in case there is an issue with amplify API class
    const res = await fetch('https://nb213nvuza.execute-api.us-east-1.amazonaws.com/Dev/relayers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(relayer),
      mode: 'cors'
    });
    // Replace by the following when CORS is solved
    // const res = await API.post(apiName, path, { body: relayer });
    console.log("RESPONSE", res);
  } catch (err) {
    console.error(`REQUEST FAILED`, err);
  }
  return relayerId;
}

export async function getRelayers() : Promise<Relayer[]> {
  return [];
  const apiName = 'relayerapi';
  const path = `/relayer/${tenantId}`;
  const res = await API.get(apiName, path, {});
  return res as Relayer[];
}