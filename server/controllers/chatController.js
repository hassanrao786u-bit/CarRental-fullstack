import { GoogleGenerativeAI } from '@google/generative-ai'
import Car from '../models/Car.js'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const chatWithBot = async (req, res) => {
    try {
        const { message } = req.body

        if (!message) {
            return res.json({ success: false, message: "Message is required" })
        }

        // Fetch available cars from database
        const cars = await Car.find({ isAvaliable: true })

        // Build cars info string
        const carsInfo = cars.map(car => `
- ${car.brand} ${car.model} (${car.year})
  Category: ${car.category}
  Price: Rs ${car.pricePerDay} per day
  Transmission: ${car.transmission}
  Fuel Type: ${car.fuel_type}
  Seating: ${car.seating_capacity} persons
  Location: ${car.location}
  Description: ${car.description}
        `).join('\n')

        const systemPrompt = `You are a helpful AI assistant for a car rental website in Pakistan.

You only answer questions related to:
- Available cars and their details
- Car booking process
- Pickup and return dates
- Pricing
- Locations available
- How to cancel or modify bookings
- Account and login issues

If someone asks anything unrelated to car rental, politely say: "I can only help with car rental related questions."

Always respond in the same language the user writes in (Urdu or English).
Keep answers short, helpful and friendly.

Here are the currently available cars in our fleet:
${carsInfo}

Only provide information about these cars. Do not make up any other cars.`

        const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' })

        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: systemPrompt }]
                },
                {
                    role: 'model',
                    parts: [{ text: 'Understood. I will only answer car rental related questions and provide information about the available cars listed.' }]
                }
            ]
        })

        const result = await chat.sendMessage(message)
        const response = result.response.text()

        res.json({ success: true, reply: response })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}