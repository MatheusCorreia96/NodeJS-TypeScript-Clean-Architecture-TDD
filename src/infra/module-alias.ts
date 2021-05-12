const moduleAlias = require('module-alias');
moduleAlias.addAlias('infra', __dirname + '/../infra');
moduleAlias.addAlias('@adapters', __dirname + '/../adapters');
moduleAlias.addAlias('@constants', __dirname + '/../constants');
moduleAlias.addAlias('@interactors', __dirname + '/../interactors');
moduleAlias.addAlias('@entities', __dirname + '/../entities');