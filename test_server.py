from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/")
async def root():
    return {"status": "ok", "message": "测试服务器"}

@app.post("/api/chat")
async def chat(data: dict):
    return {
        "code": 200,
        "data": {"answer": f"收到: {data.get('question', '无问题')}"}
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
