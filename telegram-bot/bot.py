import os
import requests
import json
from datetime import datetime
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, ContextTypes

API_BASE = os.getenv("VELOCITY_API", "http://localhost:8000")

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "YOUR_BOT_TOKEN_HERE")

user_sessions = {}

def get_api(endpoint: str):
    try:
        resp = requests.get(f"{API_BASE}{endpoint}", timeout=10)
        return resp.json() if resp.status_code == 200 else None
    except:
        return None

def post_api(endpoint: str, data: dict):
    try:
        resp = requests.post(f"{API_BASE}{endpoint}", json=data, timeout=10)
        return resp.json() if resp.status_code == 200 else None
    except:
        return None

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🚗 *Welcome to VeloCity!*\n\n"
        "Your digital fuel access ecosystem.\n\n"
        "Use /book to book a fuel slot\n"
        "Use /status to check station status\n"
        "Use /wallet to check your balance\n"
        "Use /register to register a vehicle\n"
        "Use /help to see all commands",
        parse_mode="Markdown"
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "📋 *Available Commands:*\n\n"
        "/start - Welcome message\n"
        "/book - Book a fuel slot\n"
        "/status - Check station status\n"
        "/wallet - Check wallet balance\n"
        "/register - Register new vehicle\n"
        "/history - Transaction history\n"
        "/help - Show this help",
        parse_mode="Markdown"
    )

async def book_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.message.from_user.id
    stations = get_api("/api/stations")
    
    if not stations:
        await update.message.reply_text("❌ Cannot connect to server. Please try again.")
        return
    
    keyboard = []
    for station in stations[:5]:
        keyboard.append([
            InlineKeyboardButton(
                f"⛽ {station['name']} ({station['location']})",
                callback_data=f"station_{station['id']}"
            )
        ])
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        "📍 *Select a Station:*",
        reply_markup=reply_markup,
        parse_mode="Markdown"
    )

async def status_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    stations = get_api("/api/stations")
    
    if not stations:
        await update.message.reply_text("❌ Cannot connect to server.")
        return
    
    msg = "📊 *Station Status*\n\n"
    for s in stations:
        status = "🟢" if s['inventory'] > 5000 else "🟡" if s['inventory'] > 2000 else "🔴"
        msg += f"{status} *{s['name']}*\n"
        msg += f"   📍 {s['location']}\n"
        msg += f"   ⛽ {s['inventory']}L remaining\n\n"
    
    await update.message.reply_text(msg, parse_mode="Markdown")

async def wallet_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "💰 Please enter your phone number to check wallet:",
        parse_mode="Markdown"
    )

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text
    user_id = update.message.from_user.id
    
    if text.startswith("+"):
        vehicles = get_api(f"/api/vehicles?phone={text}")
        if vehicles and len(vehicles) > 0:
            msg = "💰 *Your Wallets:*\n\n"
            for v in vehicles:
                wallet = get_api(f"/api/wallet/{v['id']}")
                balance = wallet.get('balance', 0) if wallet else 0
                msg += f"🚗 *{v['plate']}*\n"
                msg += f"   Balance: ${balance:.2f}\n\n"
            await update.message.reply_text(msg, parse_mode="Markdown")
        else:
            await update.message.reply_text("❌ No vehicles found with this phone number.")
    
    elif text in ["1", "2", "3", "4", "5", "6", "7"]:
        await update.message.reply_text(f"⏰ Time slot {text} selected! Use /book to confirm.")

async def callback_query(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    
    if query.data.startswith("station_"):
        station_id = query.data.split("_")[1]
        
        time_slots = [
            ("1", "06:00 - 08:00"),
            ("2", "08:00 - 10:00"),
            ("3", "10:00 - 12:00"),
            ("4", "12:00 - 14:00"),
            ("5", "14:00 - 16:00"),
            ("6", "16:00 - 18:00"),
            ("7", "18:00 - 20:00"),
        ]
        
        keyboard = [
            [InlineKeyboardButton(f"⏰ {slot[1]}", callback_data=f"slot_{station_id}_{slot[0]}")]
            for slot in time_slots
        ]
        
        await query.edit_message_text(
            "⏰ *Select Time Slot:*",
            reply_markup=InlineKeyboardMarkup(keyboard),
            parse_mode="Markdown"
        )
    
    elif query.data.startswith("slot_"):
        parts = query.data.split("_")
        station_id = parts[1]
        time_slot = parts[2]
        
        await query.edit_message_text(
            f"✅ Booking confirmed!\n\n"
            f"Station: {station_id}\n"
            f"Time Slot: {time_slot}\n\n"
            f"Present at the station during your time slot and show your QR code to the attendant.",
            parse_mode="Markdown"
        )

async def register_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.message.from_user.id
    user_sessions[user_id] = {"step": "type"}
    
    keyboard = [
        [InlineKeyboardButton("🛑 Bajaj (Green)", callback_data="reg_bajaj")],
        [InlineKeyboardButton("🚗 Automobile (Blue)", callback_data="reg_automobile")],
        [InlineKeyboardButton("🚛 Truck (Black)", callback_data="reg_truck")],
    ]
    
    await update.message.reply_text(
        "📝 *Vehicle Registration*\n\nSelect vehicle type:",
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="Markdown"
    )

async def history_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "📜 Please enter your phone number to view transaction history:",
        parse_mode="Markdown"
    )

def main():
    print("🤖 Starting VeloCity Telegram Bot...")
    
    application = Application.builder().token(BOT_TOKEN).build()
    
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("book", book_command))
    application.add_handler(CommandHandler("status", status_command))
    application.add_handler(CommandHandler("wallet", wallet_command))
    application.add_handler(CommandHandler("register", register_command))
    application.add_handler(CommandHandler("history", history_command))
    application.add_handler(MessageHandler(None, handle_message))
    application.add_handler(CallbackQueryHandler(callback_query))
    
    print("✅ Bot is running! Press Ctrl+C to stop.")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()