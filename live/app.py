import asyncio
import json
import websockets
import yfinance as yf

clients = set()

SYMBOLS = ["BTC-USD", "ETH-USD", "SOL-USD"]

async def get_symbol_data(symbol):
    ticker = yf.Ticker(symbol)
    info = ticker.info
    return {
        "id": symbol,
        "price": info.get("regularMarketPrice", 0),
        "time": str(int(info.get("regularMarketTime", 0)) * 1000),
        "currency": "USD",
        "exchange": info.get("exchange", ""),
        "change_percent": info.get("regularMarketChangePercent", 0),
        "day_volume": str(info.get("regularMarketVolume", 0)),
        "day_high": info.get("regularMarketDayHigh", 0),
        "day_low": info.get("regularMarketDayLow", 0),
        "change": info.get("regularMarketChange", 0),
        "open_price": info.get("regularMarketOpen", 0),
        "price_hint": "2"
    }

async def yahoo_message_handler(message):
    if clients:
        data = json.dumps(message)
        await asyncio.gather(*(client.send(data) for client in clients))

async def start_yahoo_websocket():
    ws = yf.AsyncWebSocket()
    await ws.subscribe(SYMBOLS)
    await ws.listen(yahoo_message_handler)

async def handle_client(websocket):
    for symbol in SYMBOLS:
        data = await get_symbol_data(symbol)
        await websocket.send(json.dumps(data))

    clients.add(websocket)
    try:
        async for _ in websocket:
            pass    # We don't care about client messages
    finally:
        clients.remove(websocket)

async def start_websocket_server():
    server = await websockets.serve(handle_client, "0.0.0.0", 8765)
    await server.wait_closed()

async def main():
    await asyncio.gather(
        start_yahoo_websocket(),
        start_websocket_server()
    )

if __name__ == "__main__":
    asyncio.run(main())
