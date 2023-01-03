SHELL := /bin/bash

ABI_V1 = v1/abi.json
BYTECODE_V1 = v1/bytecode
DEPS_V1 = v1/twitter.vy

ABI_V2 = v2/abi.json
BYTECODE_V2 = v2/bytecode
DEPS_V2 = v2/twitter.vy

$(ABI_V1) $(BYTECODE_V1): $(DEPS_V1) .venv
	source .venv/bin/activate && vyper $(DEPS_V1) -f abi > $(ABI_V1)
	source .venv/bin/activate && vyper $(DEPS_V1) > $(BYTECODE_V1)

$(ABI_V2) $(BYTECODE_V2): $(DEPS_V2) .venv
	source .venv/bin/activate && vyper $(DEPS_V2) -f abi > $(ABI_V2)
	source .venv/bin/activate && vyper $(DEPS_V2) > $(BYTECODE_V2)

# Set a phony target to run the commands every time a dependency is changed
.PHONY: update-v1
update-v1: $(DEPS_V1)
	source .venv/bin/activate && vyper $(DEPS_V1) -f abi > $(ABI_V1)
	source .venv/bin/activate && vyper $(DEPS_V1) > $(BYTECODE_V1)

.PHONY: update-v2
update-v2: $(DEPS_V2)
	source .venv/bin/activate && vyper $(DEPS_V2) -f abi > $(ABI_V2)
	source .venv/bin/activate && vyper $(DEPS_V2) > $(BYTECODE_V2)

venv: .venv

.venv:
	python3.10 -m venv .venv
	source .venv/bin/activate && pip install -r requirements.txt
