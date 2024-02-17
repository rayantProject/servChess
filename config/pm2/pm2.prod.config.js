const { name, output } = require('../config.json');

module.exports = {
  apps: [
    {
      auto_restart: true,
      name: name,
      script: `${output.path}/${output.filename}`,
      watch: false,
      
      exec_mode: 'cluster', // Mode d'exécution en cluster
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
