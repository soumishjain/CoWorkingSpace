import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey : process.env.OPENAI_API_KEY
})

export async function generateSubtasks(title , description) {
    const prompt = `Break this task into clear actionable subtasks
    
    Task : ${title}

    Description : ${description}

    Break the tasks such that one subtask can be assigned to one person
    Return only a numbered list of subtasks
    `

    const response = await openai.chat.completions.create({
        model : "gpt-4o-mini",
        messages : [
            {
                role : "user",
                content : prompt
            }
        ]
    })

    return response.choices[0].message.content
}

