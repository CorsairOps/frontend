module.exports = {
    'user-service': {
        input: './api-docs.json',
        output: {
            target: '../../src/api/services',
            client: 'react-query',
            override: {
                mutator: {
                    path: '../../src/api/axiosInstance.ts',
                    name: 'axiosInstance',
                }
            }
        }
    }
}