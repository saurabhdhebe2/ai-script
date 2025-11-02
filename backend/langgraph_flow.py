from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv

load_dotenv()

class ScriptState(TypedDict):
    prompt: str
    script: str
    error: str | None
    attempts: int

def generate_with_openai(state: ScriptState) -> ScriptState:
    """Generate script using OpenAI"""
    try:
        llm = ChatOpenAI(
            model="gpt-4o-mini",
            api_key=os.getenv("OPENAI_API_KEY"),
            temperature=0.7
        )
        
        system_prompt = """You are a professional script writer. Generate engaging, 
        well-structured scripts based on the user's prompt. Include dialogue, scene 
        descriptions, and stage directions where appropriate."""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": state["prompt"]}
        ]
        
        response = llm.invoke(messages)
        state["script"] = response.content
        state["error"] = None
        return state
        
    except Exception as e:
        state["error"] = str(e)
        state["attempts"] = state.get("attempts", 0) + 1
        return state

def generate_with_groq(state: ScriptState) -> ScriptState:
    """Fallback: Generate script using Groq"""
    try:
        llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            api_key=os.getenv("GROQ_API_KEY"),
            temperature=0.7
        )
        
        system_prompt = """You are a professional script writer. Generate engaging, 
        well-structured scripts based on the user's prompt. Include dialogue, scene 
        descriptions, and stage directions where appropriate."""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": state["prompt"]}
        ]
        
        response = llm.invoke(messages)
        state["script"] = response.content
        state["error"] = None
        return state
        
    except Exception as e:
        state["error"] = f"Both OpenAI and Groq failed: {str(e)}"
        return state

def should_retry(state: ScriptState) -> str:
    """Decide whether to retry with fallback"""
    if state.get("error") and state.get("attempts", 0) < 2:
        return "groq"
    elif state.get("script"):
        return "end"
    else:
        return "end"

# Build the graph
workflow = StateGraph(ScriptState)

# Add nodes
workflow.add_node("openai", generate_with_openai)
workflow.add_node("groq", generate_with_groq)

# Set entry point
workflow.set_entry_point("openai")

# Add conditional edges
workflow.add_conditional_edges(
    "openai",
    should_retry,
    {
        "groq": "groq",
        "end": END
    }
)

workflow.add_edge("groq", END)

# Compile the graph
app = workflow.compile()

async def generate_script(prompt: str) -> dict:
    """Main function to generate script with fallback"""
    initial_state = ScriptState(
        prompt=prompt,
        script="",
        error=None,
        attempts=0
    )
    
    result = await app.ainvoke(initial_state)
    return result
