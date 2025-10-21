module.exports = {
    'maintenance-service': {
        input: './api-docs.json',
        output: {
            target: '../../src/lib/api/services',
            client: 'react-query',
            override: {
                mutator: {
                    path: '../../src/lib/api/axiosInstance.ts',
                    name: 'axiosInstance',
                }
            }
        }
    }
}