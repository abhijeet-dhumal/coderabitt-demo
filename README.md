# CodeRabbit Demo

A demo repository for the **Agentic Code Review Workshop**.

The `src/` directory contains a Flask auth API with intentional security vulnerabilities — used to demonstrate CodeRabbit's IDE extension and automated PR review.

## Setup

```bash
pip install -r requirements.txt
python src/app.py
```

## CodeRabbit CLI

```bash
curl -fsSL https://cli.coderabbit.ai/install.sh | sh
```

## Resources

- [CodeRabbit Documentation](https://docs.coderabbit.ai/)
- [IDE Extension (VS Code / Cursor / Windsurf)](https://docs.coderabbit.ai/category/ide-review-extension)
- [CLI Tool](https://docs.coderabbit.ai/category/command-line-review-tool)
- [Configuration reference](https://docs.coderabbit.ai/reference/configuration)
- [Code review commands](https://docs.coderabbit.ai/reference/commands)

## Workshop — hands-on exercise

1. **Fork** this repo and clone your fork
2. Check out the buggy branch: `git checkout feat/add-user-auth`
3. Pick an open issue → assign yourself on GitHub
4. Create a branch: `git checkout -b fix/issue-N-your-name`
5. Fix the issue locally — use the **CodeRabbit IDE extension** to review before pushing
6. Push and open a PR back to `abhijeet-dhumal/coderabitt-demo`

CodeRabbit will automatically review your PR within ~60 seconds of it opening.

## Project structure

```
src/          Flask app source (app.py, auth.py)
tests/        pytest test suite
canvas/       Workshop presentation canvas
.github/      PR template
```

## Running tests

```bash
pip install pytest
pytest tests/ -v
```
