IMAGE := naokihori/trash:latest
CONTAINER := trash
ARTIFACT_DESTINATION ?= dist
ARTIFACT_BASE ?= ./

help:
	@echo "build       : build artifacts"
	@echo "build-image : build docker image"
	@echo "dev         : launch development server"
	@echo "polish      : run type check, formatter, and linter"

build:
	docker rm -f $(CONTAINER) 2>/dev/null || true
	docker run \
    --name $(CONTAINER) \
    -v "${PWD}/index.html":/app/index.html:ro \
    -v "${PWD}/pages":/app/pages:ro \
    -v "${PWD}/src":/app/src:ro \
    -v "${PWD}/style.css":/app/style.css:ro \
    $(IMAGE) \
    npx vite build --outDir=/app/dist --base=$(ARTIFACT_BASE)
	docker cp $(CONTAINER):/app/dist $(ARTIFACT_DESTINATION)
	docker rm $(CONTAINER)

build-image:
	docker build --progress=plain -t $(IMAGE) .

dev:
	docker run \
    --rm \
    -p 5173:5173 \
    --name $(CONTAINER) \
    -v "${PWD}/index.html":/app/index.html:ro \
    -v "${PWD}/pages":/app/pages:ro \
    -v "${PWD}/src":/app/src:ro \
    -v "${PWD}/style.css":/app/style.css:ro \
    $(IMAGE) \
    npx vite dev --host

polish:
	# tsc, all sources are needed to type-check
	docker run \
    --rm \
    --name $(CONTAINER) \
    -v "${PWD}/pages":/app/pages:ro \
    -v "${PWD}/src":/app/src:ro \
    $(IMAGE) \
    npx tsc
	# formatter, writable access is needed to fix format violation
	docker run \
    --rm \
    --name $(CONTAINER) \
    -v "${PWD}/pages":/app/pages \
    -v "${PWD}/src":/app/src \
    $(IMAGE) \
    npx oxfmt
	# linter, all sources are needed to type-check
	docker run \
    --rm \
    --name $(CONTAINER) \
    -v "${PWD}/pages":/app/pages:ro \
    -v "${PWD}/src":/app/src:ro \
    $(IMAGE) \
    npx oxlint --type-aware -D correctness Advection/ CartPole/ CellularAutomaton/ Classifier/ ColorMapChecker/ Delaunay/ HIFU/ JuliaSetViewer/ Logo/ MiniMaze/ Roulette/ src/ SudokuAssistant/ Truss/

