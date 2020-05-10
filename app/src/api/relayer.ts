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
  return '1';
  const apiName = 'relayerapi';
  const path = '/relayer';
  const relayerId = getRandomId();
  const res = await API.post(apiName, path, {
    body: {
      relayerId,
      tenantId: "DEFAULT_TENANT",
      name
    }
  });
  console.log("RESPONSE", res);
  return relayerId;
}

export async function getRelayers() : Promise<Relayer[]> {
  return [];
  const apiName = 'relayerapi';
  const path = `/relayer/${tenantId}`;
  const res = await API.get(apiName, path, {});
  return res as Relayer[];
}