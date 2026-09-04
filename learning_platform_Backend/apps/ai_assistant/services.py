import os

from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage


def get_ai_response(
    message,
    problem=None,
    language="",
    source_code="",
    error="",
    history=None,
):
    """
    Generate a response from Learner AI Tutor.

    The AI receives:
    - Current problem
    - Programming language
    - Student's current code
    - Current error
    - Previous conversation history
    - Current student question
    """

    # -----------------------------------------
    # Get Groq API key
    # -----------------------------------------

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise ValueError(
            "GROQ_API_KEY is not configured."
        )

    # -----------------------------------------
    # Create Groq LLM
    # -----------------------------------------

    llm = ChatGroq(
        api_key=api_key,
        model="openai/gpt-oss-120b",
        temperature=0.2,
    )

    # -----------------------------------------
    # Problem context
    # -----------------------------------------

    if problem:
        problem_context = (
            "Problem title:\n"
            + str(problem.title)
            + "\n\n"
            + "Problem description:\n"
            + str(problem.description or "Not provided")
            + "\n\n"
            + "Input format:\n"
            + str(problem.input_format or "Not provided")
            + "\n\n"
            + "Output format:\n"
            + str(problem.output_format or "Not provided")
            + "\n\n"
            + "Constraints:\n"
            + str(problem.constraints or "Not provided")
            + "\n\n"
            + "Sample input:\n"
            + str(problem.sample_input or "Not provided")
            + "\n\n"
            + "Sample output:\n"
            + str(problem.sample_output or "Not provided")
        )
    else:
        problem_context = (
            "No current problem context was provided."
        )

    # -----------------------------------------
    # Student code context
    # -----------------------------------------

    code_context = (
        "Programming language:\n"
        + str(language or "Not specified")
        + "\n\n"
        + "Student's current code:\n"
        + "----- CODE START -----\n"
        + str(source_code or "No code provided.")
        + "\n----- CODE END -----"
    )

    # -----------------------------------------
    # Error context
    # -----------------------------------------

    error_context = (
        "Current execution/compiler error:\n"
        + str(error or "No error reported.")
    )

    # -----------------------------------------
    # Conversation history
    # -----------------------------------------

    history = history or []

    history_text = ""

    # Keep only the last 10 messages to avoid
    # sending an unnecessarily large prompt.
    for item in history[-10:]:
        if not isinstance(item, dict):
            continue

        role = item.get("role", "")
        content = item.get("content", "")

        if not content:
            continue

        if role == "user":
            history_text += (
                "Student: "
                + str(content)
                + "\n"
            )

        elif role == "assistant":
            history_text += (
                "AI Tutor: "
                + str(content)
                + "\n"
            )

    if not history_text:
        history_text = "No previous conversation."

    # -----------------------------------------
    # System instructions
    # -----------------------------------------

    system_prompt = (
        "You are Learner AI Tutor, a concise programming assistant.\n\n"

        "Your job is to help students understand programming "
        "and solve coding problems.\n\n"

        "CONVERSATION AWARENESS:\n"
        "1. Remember and use previous messages when relevant.\n"
        "2. If the student says 'above solution', 'previous code', "
        "'your code', 'explain that', or similar, refer to the "
        "previous conversation.\n"
        "3. Do not ask the student to paste code or text that "
        "already appears in the conversation history.\n\n"

        "QUESTION INTERPRETATION:\n"
        "4. Answer exactly what the student asks.\n"
        "5. Do not automatically assume a generic programming "
        "question refers to the current problem.\n"
        "6. Use the current problem context when the student clearly "
        "refers to it, for example 'this problem', 'this question', "
        "'this solution', or 'my code'.\n"
        "7. If the student says 'sum of two numbers', understand it "
        "as simple addition unless they clearly refer to the Two Sum "
        "problem.\n\n"

        "RESPONSE STYLE:\n"
        "8. Keep normal answers concise, usually under 120 words.\n"
        "9. Do not repeat the complete problem statement unless needed.\n"
        "10. Do not use unnecessary introductions such as 'Sure!' "
        "or 'Here is a detailed explanation'.\n"
        "11. Use short paragraphs and simple language.\n"
        "12. Use Markdown code blocks when showing code.\n\n"

        "HINTS:\n"
        "13. If the student asks for a hint, give a hint rather than "
        "immediately giving the complete solution.\n\n"

        "CODE:\n"
        "14. If the student asks for code, provide code in the "
        "requested programming language.\n"
        "15. Keep code simple when the student asks for simple code.\n\n"

        "ERRORS:\n"
        "16. When an error is provided, identify the exact cause first.\n"
        "17. Give the simplest practical fix.\n\n"

        "EXPLANATIONS:\n"
        "18. If the student asks to explain previous code or a previous "
        "answer, explain that exact code or answer.\n"
        "19. For 'simple logic', use 3-6 short steps.\n"
        "20. Give Time and Space complexity briefly when relevant."
    )

    # -----------------------------------------
    # User prompt
    # -----------------------------------------

    user_prompt = (
        "CURRENT PROBLEM CONTEXT:\n"
        + problem_context
        + "\n\n"

        + "CURRENT CODE CONTEXT:\n"
        + code_context
        + "\n\n"

        + "CURRENT ERROR CONTEXT:\n"
        + error_context
        + "\n\n"

        + "PREVIOUS CONVERSATION:\n"
        + history_text
        + "\n\n"

        + "CURRENT STUDENT QUESTION:\n"
        + str(message)
        + "\n\n"

        + "Determine what the student is asking and answer that "
        "question directly. Use previous conversation when the "
        "student refers to something already discussed."
    )

    # -----------------------------------------
    # Call the model
    # -----------------------------------------

    response = llm.invoke(
        [
            SystemMessage(
                content=system_prompt
            ),
            HumanMessage(
                content=user_prompt
            ),
        ]
    )

    # -----------------------------------------
    # Return AI answer
    # -----------------------------------------

    return response.content