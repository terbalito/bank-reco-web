export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://grrkl3gjae.execute-api.eu-north-1.amazonaws.com/prod',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
}
