yarn:
	yarn

dev: yarn
	npx expo start

build: yarn
	npx expo export --dump-sourcemap
