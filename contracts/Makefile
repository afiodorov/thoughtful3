SHELL := /bin/bash

# Set the target file names
ABI = abi.json
BYTECODE = bytecode

# Set the dependencies
DEPS = twitter.vy

# Set the rule to build the target files
$(ABI) $(BYTECODE): $(DEPS) .venv
	source .venv/bin/activate && vyper $(DEPS) -f abi > abi.json
	source .venv/bin/activate && vyper $(DEPS) > bytecode

# Set a phony target to run the commands every time a dependency is changed
.PHONY: update
update: $(DEPS)
	source .venv/bin/activate && vyper $(DEPS) -f abi > abi.json
	source .venv/bin/activate && vyper $(DEPS) > bytecode


# Set the target and dependencies
venv: .venv

# Set the rule to create and activate the virtual environment
.venv:
	python3.10 -m venv .venv
	source .venv/bin/activate && pip install -r requirements.txt
