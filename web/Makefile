COMBINE_BINARY = bin/combine_files
COMBINE_SOURCES = cmd/combine_files/main.go
SERVER_BINARY = bin/server
SERVER_SOURCES = cmd/server/main.go
COMBINED = index.html
BUNDLE = dist/bundle.js

all: $(COMBINE_BINARY) $(COMBINED) $(BUNDLE) $(SERVER_BINARY)

$(COMBINED): $(COMBINE_BINARY) $(wildcard css/*.css) src/index.html $(BUNDLE)
	$(COMBINE_BINARY)

.PHONY: css/%.css

$(COMBINE_BINARY): $(COMBINE_SOURCES)
	go build -o $@ $<

$(SERVER_BINARY): $(SERVER_SOURCES)
	go build -o $@ $<

clean:
	rm -f $(COMBINE_BINARY)
	rm -f $(BUNDLE)


$(BUNDLE): $(wildcard src/*.ts) $(wildcard src/**/*.ts)
	yarn run build
