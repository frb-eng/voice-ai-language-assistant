from fastapi import FastAPI, Response

app = FastAPI()


@app.get("/api")
async def api():
    return {'hello': 'world'}