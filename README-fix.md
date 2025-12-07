
# Patch: Fix string literal in /api/app/main.py

- Corrected the M3U and XMLTV string literals using triple quotes.
- Endpoints now return `fastapi.responses.Response` with proper `media_type`.
- This resolves `SyntaxError: unterminated string literal` at startup.
