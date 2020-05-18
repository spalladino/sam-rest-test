export const TableName = 'relayer-test';

export function getDBWithCredentials() {
  return {
    query: () => ({
      promise: async () => (
        { Items: [
          { relayerId: 1, name: 'foo' }
        ]}
      )
    })  
  };
}