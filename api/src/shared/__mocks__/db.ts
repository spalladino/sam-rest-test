export const TableName = 'relayer-test';

export function getDB() {
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