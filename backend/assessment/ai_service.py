"""
AI Question Generation Service
Uses OpenAI API to generate questions based on topics
"""
import os
import json
from typing import List, Dict

# Try to import OpenAI (install with: pip install openai)
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("OpenAI library not installed. Using mock questions. Install with: pip install openai")

# Initialize OpenAI client
# Set OPENAI_API_KEY in environment variables or settings
if OPENAI_AVAILABLE:
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY', ''))


def generate_questions(topic: str, count: int = 50, difficulty: str = "medium") -> List[Dict]:
    """
    Generate questions using OpenAI API
    
    Args:
        topic: Programming language or technology (e.g., "Python", "Java")
        count: Number of questions to generate (default: 50)
        difficulty: Difficulty level (easy, medium, hard)
    
    Returns:
        List of question dictionaries
    """
    
    # If no API key or OpenAI not available, return mock questions for development
    api_key = os.getenv('OPENAI_API_KEY', '')
    if not OPENAI_AVAILABLE or not api_key:
        return _generate_mock_questions(topic, count, difficulty)
    
    try:
        # Create prompt for OpenAI
        prompt = f"""Generate {count} high-quality interview questions about {topic} programming language/technology.
        
Requirements:
- Mix of Multiple Choice Questions (MCQ) and Subjective questions
- Questions should be realistic and commonly asked in technical interviews
- Difficulty level: {difficulty}
- For MCQ: Provide 4 options with exactly one correct answer
- For Subjective: Provide a clear, concise answer
- Questions should test practical knowledge, not just theory

Format the response as a JSON array where each question has:
{{
    "question_text": "The question",
    "type": "mcq" or "subjective",
    "difficulty": "easy/medium/hard",
    "options": [{{"text": "option1", "is_correct": true/false}}, ...] (only for MCQ),
    "correct_answer": "answer text" (only for subjective)
}}

Return ONLY valid JSON, no additional text."""

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # or "gpt-4" for better quality
            messages=[
                {"role": "system", "content": "You are an expert technical interviewer. Generate realistic, practical interview questions."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=4000
        )
        
        # Parse response
        content = response.choices[0].message.content.strip()
        
        # Remove markdown code blocks if present
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        
        questions = json.loads(content)
        
        # Ensure we have exactly the requested count
        if isinstance(questions, list):
            return questions[:count]
        else:
            return [questions] if questions else []
            
    except Exception as e:
        print(f"Error generating questions with OpenAI: {e}")
        # Fallback to mock questions
        return _generate_mock_questions(topic, count, difficulty)


def _generate_mock_questions(topic: str, count: int, difficulty: str) -> List[Dict]:
    """Generate mock questions when OpenAI API is not available"""
    
    mcq_templates = {
        "Python": [
            {
                "question_text": "What is the difference between list and tuple in Python?",
                "type": "mcq",
                "difficulty": difficulty,
                "options": [
                    {"text": "Lists are mutable, tuples are immutable", "is_correct": True},
                    {"text": "Tuples are mutable, lists are immutable", "is_correct": False},
                    {"text": "Both are mutable", "is_correct": False},
                    {"text": "Both are immutable", "is_correct": False}
                ]
            },
            {
                "question_text": "What is a Python decorator?",
                "type": "mcq",
                "difficulty": difficulty,
                "options": [
                    {"text": "A function that modifies another function", "is_correct": True},
                    {"text": "A built-in Python class", "is_correct": False},
                    {"text": "A data structure", "is_correct": False},
                    {"text": "A Python module", "is_correct": False}
                ]
            },
            {
                "question_text": "What is the output of: print([i for i in range(5)])",
                "type": "mcq",
                "difficulty": difficulty,
                "options": [
                    {"text": "[0, 1, 2, 3, 4]", "is_correct": True},
                    {"text": "[1, 2, 3, 4, 5]", "is_correct": False},
                    {"text": "[0, 1, 2, 3, 4, 5]", "is_correct": False},
                    {"text": "Error", "is_correct": False}
                ]
            }
        ],
        "Java": [
            {
                "question_text": "What is the difference between == and .equals() in Java?",
                "type": "mcq",
                "difficulty": difficulty,
                "options": [
                    {"text": "== compares references, .equals() compares values", "is_correct": True},
                    {"text": ".equals() compares references, == compares values", "is_correct": False},
                    {"text": "Both are the same", "is_correct": False},
                    {"text": "== is for primitives, .equals() is for objects", "is_correct": False}
                ]
            },
            {
                "question_text": "What is method overriding in Java?",
                "type": "mcq",
                "difficulty": difficulty,
                "options": [
                    {"text": "Providing a specific implementation of a method in subclass", "is_correct": True},
                    {"text": "Creating multiple methods with same name", "is_correct": False},
                    {"text": "Hiding a method from parent class", "is_correct": False},
                    {"text": "Making a method static", "is_correct": False}
                ]
            }
        ]
    }
    
    subjective_templates = {
        "Python": [
            {
                "question_text": "Explain the Global Interpreter Lock (GIL) in Python and its implications.",
                "type": "subjective",
                "difficulty": difficulty,
                "correct_answer": "GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes at once. It can limit performance in CPU-bound multi-threaded programs but doesn't affect I/O-bound operations."
            },
            {
                "question_text": "What are Python generators and how do they differ from lists?",
                "type": "subjective",
                "difficulty": difficulty,
                "correct_answer": "Generators are functions that use yield to produce values lazily. They are memory efficient as they generate values on-the-fly, unlike lists which store all values in memory. Generators are iterators that can only be iterated once."
            }
        ],
        "Java": [
            {
                "question_text": "Explain the difference between checked and unchecked exceptions in Java.",
                "type": "subjective",
                "difficulty": difficulty,
                "correct_answer": "Checked exceptions must be handled at compile time (either caught or declared in throws). They extend Exception. Unchecked exceptions extend RuntimeException and don't need to be declared. Examples: IOException (checked), NullPointerException (unchecked)."
            }
        ]
    }
    
    questions = []
    
    # Get templates for the topic, or use generic ones
    mcq_list = mcq_templates.get(topic, mcq_templates.get("Python", []))
    subj_list = subjective_templates.get(topic, subjective_templates.get("Python", []))
    
    # Generate mix of MCQ and subjective
    mcq_count = int(count * 0.6)  # 60% MCQ
    subj_count = count - mcq_count  # 40% subjective
    
    # Add MCQ questions
    for i in range(mcq_count):
        if i < len(mcq_list):
            questions.append(mcq_list[i].copy())
        else:
            # Generate generic MCQ
            questions.append({
                "question_text": f"{topic} Question {i+1}: Explain a key concept in {topic}.",
                "type": "mcq",
                "difficulty": difficulty,
                "options": [
                    {"text": "Option A", "is_correct": True},
                    {"text": "Option B", "is_correct": False},
                    {"text": "Option C", "is_correct": False},
                    {"text": "Option D", "is_correct": False}
                ]
            })
    
    # Add subjective questions
    for i in range(subj_count):
        if i < len(subj_list):
            questions.append(subj_list[i].copy())
        else:
            # Generate generic subjective
            questions.append({
                "question_text": f"{topic} Question {i+1}: Describe a best practice in {topic} development.",
                "type": "subjective",
                "difficulty": difficulty,
                "correct_answer": f"This is a sample answer for {topic} best practices."
            })
    
    return questions[:count]

