import { API } from 'aws-amplify';

const TENANT_ID = 'DEFAULT_TENANT';
const API_NAME = 'RelayerApi';

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
  const path = 'relayers';
  const relayerId = getRandomId();
  const relayer =  {
    relayerId,
    name,
    tenantId: TENANT_ID
  }
  await API.post(API_NAME, path, { body: relayer });
  return relayerId;
}

export async function getRelayers() : Promise<Relayer[]> {
  const path = `relayers`;
  const res = await API.get(API_NAME, path, {});
  return res as Relayer[];
}