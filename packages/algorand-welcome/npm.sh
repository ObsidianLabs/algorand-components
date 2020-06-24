#!/bin/bash

npm unpublish @obsidians/algorand-welcome --force --registry http://localhost:4873
npm publish --registry http://localhost:4873